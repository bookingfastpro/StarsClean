import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import dotenv from "dotenv";
import compression from "compression";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import nodemailer from "nodemailer";
import type { ViteDevServer } from "vite";
import type { Property } from "./shared/types";
import { buildSitemap, getPageMeta, parseRoute, renderHeadTags, safeJson, PATHS } from "./shared/seo";
import { BUSINESS, DEFAULT_SITE_URL } from "./shared/site";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const PORT = Number(process.env.PORT) || 3000;
const SITE_URL = (process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
const PROPERTIES_FILE = path.join(process.cwd(), "properties.json");

// ---------------------------------------------------------------------------
// Authentification administrateur
// ---------------------------------------------------------------------------
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "stars-clean-2026";
if (!process.env.ADMIN_PASSWORD) {
  console.warn("⚠️  ADMIN_PASSWORD n'est pas défini : le mot de passe par défaut est utilisé. Définissez-le dans vos variables d'environnement !");
}
// Secret de signature des sessions. S'il n'est pas défini, il change à chaque redémarrage (les admins devront se reconnecter).
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 h

const safeEqual = (a: string, b: string) => {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
};

function signToken(): string {
  const payload = Buffer.from(JSON.stringify({ u: ADMIN_USERNAME, exp: Date.now() + SESSION_DURATION_MS })).toString("base64url");
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!verifyToken(token)) return res.status(401).json({ error: "Session expirée, veuillez vous reconnecter." });
  next();
}

// Limitation simple des tentatives de connexion (anti force brute)
const loginAttempts = new Map<string, { count: number; first: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX = 10;

// ---------------------------------------------------------------------------
// Supabase / stockage
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.SUPABASE_URL || "";
// La clé « service_role » (côté serveur uniquement) est recommandée : elle permet de restreindre les politiques RLS publiques.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } }) : null;
console.log(supabase ? "✅ Supabase initialisé." : "⚠️  Supabase non configuré : utilisation de properties.json.");

const BUCKET = "property-images";
const ALLOWED_FIELDS = ["title", "category", "location", "capacity", "beds", "bathrooms", "pmr", "desc", "images", "features", "isVisible", "bookingAction"] as const;
const CATEGORIES = ["studios", "minivillas", "villas", "appartements"];

/** Ne conserve que les champs connus et les normalise (évite les erreurs de colonnes inconnues). */
function sanitizeProperty(body: any, partial = false): Partial<Property> {
  const out: any = {};
  for (const key of ALLOWED_FIELDS) {
    if (body?.[key] === undefined) continue;
    out[key] = body[key];
  }
  if (out.title !== undefined) out.title = String(out.title).trim().slice(0, 200);
  if (out.location !== undefined) out.location = String(out.location).trim().slice(0, 120);
  if (out.capacity !== undefined) out.capacity = String(out.capacity).trim().slice(0, 60);
  if (out.desc !== undefined) out.desc = String(out.desc).slice(0, 10000);
  if (out.beds !== undefined) out.beds = Math.max(0, Number(out.beds) || 0);
  if (out.bathrooms !== undefined) out.bathrooms = Math.max(0, Number(out.bathrooms) || 0);
  if (out.pmr !== undefined) out.pmr = Boolean(out.pmr);
  if (out.isVisible !== undefined) out.isVisible = Boolean(out.isVisible);
  if (out.category !== undefined && !CATEGORIES.includes(out.category)) out.category = "studios";
  if (out.bookingAction !== undefined && !["iframe", "contact"].includes(out.bookingAction)) out.bookingAction = "iframe";
  if (out.images !== undefined) out.images = (Array.isArray(out.images) ? out.images : []).map(String).filter(Boolean).slice(0, 60);
  if (out.features !== undefined) out.features = (Array.isArray(out.features) ? out.features : []).map((f: unknown) => String(f).trim()).filter(Boolean).slice(0, 60);
  if (!partial) {
    out.features ??= [];
    out.images ??= [];
  }
  return out;
}

// Cache mémoire des biens (évite une requête Supabase à chaque page vue)
let propertiesCache: { data: Property[]; at: number } | null = null;
const CACHE_MS = 60 * 1000;
const invalidateCache = () => {
  propertiesCache = null;
};

async function readLocalFile(): Promise<Property[]> {
  return JSON.parse(await fs.readFile(PROPERTIES_FILE, "utf-8"));
}

async function getAllProperties(force = false): Promise<Property[]> {
  if (!force && propertiesCache && Date.now() - propertiesCache.at < CACHE_MS) return propertiesCache.data;
  let data: Property[];
  if (supabase) {
    const res = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (res.error) throw res.error;
    data = res.data as Property[];
  } else {
    data = await readLocalFile();
  }
  propertiesCache = { data, at: Date.now() };
  return data;
}

const visibleOnly = (list: Property[]) => list.filter((p) => p.isVisible !== false);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 30 },
  fileFilter: (_req, file, cb) => cb(null, /^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimetype)),
});

const transporter =
  process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: true,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    : null;

const escapeHtml = (s: string) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------
async function startServer() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", true);
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));

  // Domaine unique : www.<domaine> ⇄ <domaine> redirigé vers l'adresse de SITE_URL
  const canonicalHost = new URL(SITE_URL).hostname;
  const altHost = canonicalHost.startsWith("www.") ? canonicalHost.slice(4) : `www.${canonicalHost}`;
  app.use((req, res, next) => {
    if (req.hostname === altHost) return res.redirect(301, `${SITE_URL}${req.originalUrl}`);
    next();
  });

  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // --- Auth ---------------------------------------------------------------
  app.post("/api/login", (req, res) => {
    const ip = req.ip || "unknown";
    const now = Date.now();
    const entry = loginAttempts.get(ip);
    if (entry && now - entry.first < LOGIN_WINDOW_MS && entry.count >= LOGIN_MAX) {
      return res.status(429).json({ success: false, error: "Trop de tentatives. Réessayez dans quelques minutes." });
    }
    const { username = "", password = "" } = req.body || {};
    if (safeEqual(String(username), ADMIN_USERNAME) && safeEqual(String(password), ADMIN_PASSWORD)) {
      loginAttempts.delete(ip);
      return res.json({ success: true, token: signToken(), expiresIn: SESSION_DURATION_MS });
    }
    if (!entry || now - entry.first >= LOGIN_WINDOW_MS) loginAttempts.set(ip, { count: 1, first: now });
    else entry.count++;
    res.status(401).json({ success: false, error: "Identifiant ou mot de passe incorrect." });
  });

  app.get("/api/session", requireAdmin, (_req, res) => res.json({ ok: true }));

  // --- Images -------------------------------------------------------------
  app.post("/api/upload", requireAdmin, upload.single("image"), async (req, res) => {
    try {
      if (!supabase) return res.status(500).json({ error: "Supabase n'est pas configuré : l'envoi de photos est impossible." });
      if (!req.file) return res.status(400).json({ error: "Aucune image valide reçue (formats acceptés : JPG, PNG, WebP)." });

      const ext = (req.file.mimetype.split("/")[1] || "jpg").replace("jpeg", "jpg");
      const filePath = `properties/${Date.now()}-${crypto.randomBytes(5).toString("hex")}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) {
        console.error("Supabase Storage Error:", error);
        return res.status(500).json({ error: error.message });
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
      res.json({ url: data.publicUrl });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Échec de l'envoi de l'image", message: error?.message });
    }
  });

  app.get("/api/storage/images", requireAdmin, async (_req, res) => {
    try {
      if (!supabase) return res.json([]);
      const { data, error } = await supabase.storage.from(BUCKET).list("properties", {
        limit: 500,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });
      if (error) throw error;
      res.json(
        data
          .filter((f) => f.name && !f.name.startsWith("."))
          .map((f) => supabase.storage.from(BUCKET).getPublicUrl(`properties/${f.name}`).data.publicUrl),
      );
    } catch (error: any) {
      console.error("List images error:", error);
      res.status(500).json({ error: "Impossible de charger la bibliothèque", message: error?.message });
    }
  });

  // --- Contact ------------------------------------------------------------
  app.post("/api/contact", async (req, res) => {
    const name = String(req.body?.name || "").slice(0, 200);
    const email = String(req.body?.email || "").slice(0, 200);
    const message = String(req.body?.message || "").slice(0, 5000);
    if (!name || !email || !message) return res.status(400).json({ error: "Champs manquants" });
    try {
      if (supabase) {
        const { error } = await supabase.from("contact_requests").insert([{ name, email, message }]);
        if (error) console.error("Supabase Contact Error:", error);
      }
      if (transporter) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Star's Clean" <${process.env.SMTP_USER}>`,
          to: BUSINESS.email,
          replyTo: email,
          subject: `Nouveau message de contact - ${name.replace(/[\r\n]/g, " ")}`,
          text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
          html: `<div style="font-family:sans-serif;padding:20px;border:1px solid #eee;border-radius:10px">
              <h2 style="color:#2563eb">Nouveau message de contact</h2>
              <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <div style="background:#f8fafc;padding:15px;border-radius:8px">${escapeHtml(message).replace(/\n/g, "<br>")}</div>
            </div>`,
        });
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Erreur lors de l'envoi du message" });
    }
  });

  // --- Biens --------------------------------------------------------------
  // Public : uniquement les biens visibles
  app.get("/api/properties", async (_req, res) => {
    try {
      res.setHeader("Cache-Control", "public, max-age=60");
      res.json(visibleOnly(await getAllProperties()));
    } catch (error) {
      console.error("Error reading properties:", error);
      res.status(500).json({ error: "Impossible de charger les biens" });
    }
  });

  // Admin : tous les biens, y compris masqués
  app.get("/api/admin/properties", requireAdmin, async (_req, res) => {
    try {
      res.setHeader("Cache-Control", "no-store");
      res.json(await getAllProperties(true));
    } catch (error: any) {
      console.error("Error reading properties:", error);
      res.status(500).json({ error: "Impossible de charger les biens", message: error?.message });
    }
  });

  app.post("/api/properties", requireAdmin, async (req, res) => {
    try {
      const saveData = sanitizeProperty(req.body);
      if (!saveData.title || !saveData.location) return res.status(400).json({ message: "Le titre et la localisation sont obligatoires." });
      invalidateCache();
      if (supabase) {
        const { data, error } = await supabase.from("properties").insert([saveData]).select();
        if (error) {
          console.error("Supabase Insert Error:", error);
          return res.status(500).json({ message: error.message || "Échec de l'ajout du bien" });
        }
        return res.status(201).json(data[0]);
      }
      const properties = await readLocalFile();
      const newProperty = { ...saveData, id: Date.now().toString(), created_at: new Date().toISOString() } as Property;
      properties.unshift(newProperty);
      await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2));
      res.status(201).json(newProperty);
    } catch (error: any) {
      console.error("Error adding property:", error);
      res.status(500).json({ message: "Échec de l'ajout du bien" });
    }
  });

  app.put("/api/properties/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = sanitizeProperty(req.body, true);
      invalidateCache();
      if (supabase) {
        const { data, error } = await supabase.from("properties").update(updateData).eq("id", id).select();
        if (error) {
          console.error("Supabase Update Error:", error);
          return res.status(500).json({ message: error.message || "Échec de la mise à jour" });
        }
        if (!data || data.length === 0) return res.status(404).json({ message: "Bien introuvable" });
        return res.json(data[0]);
      }
      const properties = await readLocalFile();
      const index = properties.findIndex((p) => String(p.id) === id);
      if (index === -1) return res.status(404).json({ message: "Bien introuvable" });
      properties[index] = { ...properties[index], ...updateData, id };
      await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2));
      res.json(properties[index]);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Échec de la mise à jour" });
    }
  });

  app.delete("/api/properties/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      invalidateCache();
      if (supabase) {
        const { error } = await supabase.from("properties").delete().eq("id", id);
        if (error) throw error;
        return res.status(204).send();
      }
      const properties = (await readLocalFile()).filter((p) => String(p.id) !== id);
      await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Échec de la suppression" });
    }
  });

  app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

  // --- SEO : robots.txt & sitemap.xml --------------------------------------
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(`User-agent: *\nAllow: /\nDisallow: ${PATHS.admin}\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      res.type("application/xml").setHeader("Cache-Control", "public, max-age=3600");
      res.send(buildSitemap(await getAllProperties(), SITE_URL));
    } catch (error) {
      console.error("Sitemap error:", error);
      res.status(500).send("");
    }
  });

  // --- Front-end ------------------------------------------------------------
  let vite: ViteDevServer | undefined;
  const distPath = path.join(process.cwd(), "dist");
  if (!isProd) {
    const { createServer } = await import("vite");
    vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
    app.use(vite.middlewares);
  } else {
    app.use(
      "/assets",
      express.static(path.join(distPath, "assets"), { immutable: true, maxAge: "1y", fallthrough: false }),
    );
    app.use(express.static(distPath, { index: false, maxAge: "1d" }));
  }

  let prodTemplate: string | null = null;
  const getTemplate = async (url: string) => {
    if (vite) return vite.transformIndexHtml(url, await fs.readFile(path.join(process.cwd(), "index.html"), "utf-8"));
    prodTemplate ??= await fs.readFile(path.join(distPath, "index.html"), "utf-8");
    return prodTemplate;
  };

  app.get("*", async (req, res, next) => {
    try {
      // URL canonique : suppression du slash final (/contact/ → /contact)
      if (req.path.length > 1 && req.path.endsWith("/")) {
        const q = req.url.slice(req.path.length);
        return res.redirect(301, req.path.replace(/\/+$/, "") + q);
      }
      const route = parseRoute(req.path);
      let properties: Property[] = [];
      try {
        properties = visibleOnly(await getAllProperties());
      } catch (e) {
        console.error("Impossible de charger les biens pour le rendu :", e);
      }
      const meta = getPageMeta(route, properties, SITE_URL);
      const head = renderHeadTags(meta, SITE_URL);
      const preload = route.name === "home" ? `<link rel="preload" as="image" href="${BUSINESS.heroImage}" fetchpriority="high">` : "";
      const html = (await getTemplate(req.originalUrl))
        .replace("<!--app-head-->", `${head}\n    ${preload}`)
        .replace("<!--app-data-->", `<script>window.__SITE_URL__=${safeJson(SITE_URL)};window.__INITIAL_PROPERTIES__=${safeJson(properties)}</script>`);
      res
        .status(meta.status)
        .set({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" })
        .send(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} (SITE_URL=${SITE_URL})`);
  });
}

startServer();

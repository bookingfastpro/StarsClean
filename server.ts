import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROPERTIES_FILE = path.join(process.cwd(), "properties.json");

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "stars-clean-2026";

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

if (!supabase) {
  console.warn("⚠️ Supabase is NOT initialized. Check SUPABASE_URL and SUPABASE_ANON_KEY environment variables.");
} else {
  console.log("✅ Supabase initialized successfully.");
}

// Multer setup for memory storage
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: "Identifiants invalides" });
    }
  });

  // Upload endpoint
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!supabase) {
        return res.status(500).json({ error: "Supabase not configured" });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = req.file;
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { data, error } = await supabase.storage
        .from("property-images")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) {
        console.error("Supabase Storage Error:", error);
        return res.status(500).json({ error: error.message, details: error });
      }

      const { data: { publicUrl } } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      res.json({ url: publicUrl });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        error: "Failed to upload image", 
        message: error?.message || String(error) 
      });
    }
  });

  // List images endpoint
  app.get("/api/storage/images", async (req, res) => {
    try {
      if (!supabase) {
        return res.status(500).json({ error: "Supabase not configured" });
      }

      const { data, error } = await supabase.storage
        .from("property-images")
        .list("properties", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const imageUrls = data.map((file) => {
        const { data: { publicUrl } } = supabase.storage
          .from("property-images")
          .getPublicUrl(`properties/${file.name}`);
        return publicUrl;
      });

      res.json(imageUrls);
    } catch (error: any) {
      console.error("List images error:", error);
      res.status(500).json({ error: "Failed to list images", message: error?.message });
    }
  });

  app.get("/api/properties", async (req, res) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        return res.json(data);
      }
      
      // Fallback to local file if Supabase is not configured
      const data = await fs.readFile(PROPERTIES_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Error reading properties:", error);
      res.status(500).json({ error: "Failed to read properties" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("properties")
          .insert([req.body])
          .select();
        
        if (error) throw error;
        return res.status(201).json(data[0]);
      }

      // Fallback to local file
      const data = await fs.readFile(PROPERTIES_FILE, "utf-8");
      const properties = JSON.parse(data);
      const newProperty = { ...req.body, id: Date.now().toString() };
      properties.push(newProperty);
      await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2));
      res.status(201).json(newProperty);
    } catch (error) {
      console.error("Error adding property:", error);
      res.status(500).json({ error: "Failed to add property" });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (supabase) {
        const { data, error } = await supabase
          .from("properties")
          .update(req.body)
          .eq("id", id)
          .select();
        
        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ error: "Property not found" });
        return res.json(data[0]);
      }

      // Fallback to local file
      const data = await fs.readFile(PROPERTIES_FILE, "utf-8");
      let properties = JSON.parse(data);
      const index = properties.findIndex((p: any) => p.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Property not found" });
      }
      properties[index] = { ...req.body, id }; // Ensure ID stays the same
      await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2));
      res.json(properties[index]);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (supabase) {
        const { error } = await supabase
          .from("properties")
          .delete()
          .eq("id", id);
        
        if (error) throw error;
        return res.status(204).send();
      }

      // Fallback to local file
      const data = await fs.readFile(PROPERTIES_FILE, "utf-8");
      let properties = JSON.parse(data);
      properties = properties.filter((p: any) => p.id !== id);
      await fs.writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ error: "Failed to delete property" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROPERTIES_FILE = path.join(process.cwd(), "properties.json");

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/properties", async (req, res) => {
    try {
      const data = await fs.readFile(PROPERTIES_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Error reading properties:", error);
      res.status(500).json({ error: "Failed to read properties" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
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

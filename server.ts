import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Fixes missing TS config errors if we use ESM
import { requireAuth } from "./src/middleware/auth.ts";
import { db } from "./src/db/index.ts";
import { translationEntries, users } from "./src/db/schema.ts";
import { desc } from "drizzle-orm";

const app = express();
const PORT = 3000;

// Middleware for JSON parsing
app.use(express.json({ limit: "15mb" }));

app.post('/api/sync-user', requireAuth, async (req: any, res: any) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email || '';
    const result = await db.insert(users)
      .values({ id: uid, email })
      .onConflictDoUpdate({
        target: users.id,
        set: { email }
      })
      .returning();
    res.json(result[0]);
  } catch (error: any) {
    console.error("Sync user error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/entries', async (req, res) => {
  try {
    const result = await db.select().from(translationEntries).orderBy(desc(translationEntries.createdAt));
    res.json(result);
  } catch (error: any) {
    console.error("Get entries error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/entries', requireAuth, async (req: any, res: any) => {
  try {
    const { id, nativeText, frenchTranslation, description, type, category, audioUrl, examples } = req.body;
    const userId = req.user.uid;
    const result = await db.insert(translationEntries).values({
      id,
      nativeText,
      frenchTranslation,
      description,
      type,
      category,
      audioUrl,
      examples,
      userId
    }).onConflictDoUpdate({
      target: translationEntries.id,
      set: {
        nativeText,
        frenchTranslation,
        description,
        type,
        category,
        audioUrl,
        examples
      }
    }).returning();
    res.json(result[0]);
  } catch(error: any) {
    console.error("Save entry error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Removed Gemini API configuration and /api/translate, /api/generate-context endpoints.
// The frontend strictly uses local data for dictionary translation as per the user's constraints.

// REST API endpoint: Download companion mobile APK package
app.get("/api/download-apk", (req, res) => {
  res.status(501).json({
    status: "error",
    code: "MISSING_ANDROID_SDK",
    message: "Le serveur Cloud actuel (Node.js) ne dispose pas des outils de compilation natifs (Java SDK, Gradle) nécessaires pour générer ou signer un véritable fichier .apk en dynamique. Le package précédent était corrompu (placeholder), ce qui causait l'erreur d'analyse sur votre téléphone Android. Veuillez utiliser l'installation PWA depuis le navigateur, qui est 100% fonctionnelle.",
    resolution: "Pour générer un fichier .apk réel, exportez le projet localement et utilisez un compilateur hybride via npx cap add android."
  });
});

// Configure Vite integration or Static Files serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware mounted.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving compiled static production files from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur démarré et disponible sur http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Échec du démarrage du serveur:", err);
});

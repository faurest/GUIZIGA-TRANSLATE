import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for JSON parsing
app.use(express.json({ limit: "15mb" }));

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

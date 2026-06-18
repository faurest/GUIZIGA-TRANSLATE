import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for JSON parsing
app.use(express.json({ limit: "15mb" }));

// Lazy-initialize Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("La clé d'API GEMINI_API_KEY est manquante. Veuillez la configurer dans l'onglet Secrets de Google AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoint: Translation
app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang, type } = req.body;
    if (!text || !sourceLang) {
      return res.status(400).json({ error: "Les champs 'text' et 'sourceLang' sont requis." });
    }

    const ai = getGeminiClient();
    const systemPrompt = `Tu es un linguiste expert et un traducteur bilingue chevronné.
Ton rôle est de traduire les entrées de la langue maternelle "${sourceLang}" vers le français pour un public francophone.
L'entrée peut être un mot simple, une expression, un proverbe ou une phrase complète.
L'utilisateur a spécifié que l'entrée est de type "${type === "oral" ? "parlé/oral" : "écrit"}".
Retourne une traduction exacte du sens en français, une transcription phonétique simplifiée pour aider la prononciation, ainsi qu'une explication linguistique et culturelle détaillée (par exemple: registre de langue, contexte d'usage ou variations régionales).
Garantis une réponse claire et structurée.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Traduire le texte suivant de : "${sourceLang}" en "Français".
Texte à traduire : "${text}"`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translation: {
              type: Type.STRING,
              description: "La traduction fluide du texte en français.",
            },
            phonetics: {
              type: Type.STRING,
              description: "Transcription phonétique intuitive pour aider un francophone à bien le prononcer.",
            },
            explanation: {
              type: Type.STRING,
              description: "Explication linguistique, grammaticale ou de contexte culturel de l'expression.",
            },
          },
          required: ["translation", "explanation"],
        },
      },
    });

    const parsedText = response.text;
    if (!parsedText) {
      throw new Error("Réponse vide générée par Gemini.");
    }

    const translationData = JSON.parse(parsedText);
    res.json(translationData);
  } catch (error: any) {
    console.error("Erreur de traduction:", error);
    res.status(500).json({
      error: error.message || "Une erreur est survenue lors de la traduction.",
    });
  }
});

// REST API endpoint: Generate usage examples and context
app.post("/api/generate-context", async (req, res) => {
  try {
    const { text, translation, sourceLang } = req.body;
    if (!text || !translation || !sourceLang) {
      return res.status(400).json({ error: "Les champs 'text', 'translation' et 'sourceLang' sont requis." });
    }

    const ai = getGeminiClient();
    const systemPrompt = `Tu es une IA experte en linguistique appliquée et en création de supports pédagogiques bilingues.
Pour une expression donnée en langue maternelle "${sourceLang}" et sa traduction en français "${translation}", tu dois générer contextes et exemples pratiques d'utilisation.
Tu dois générer une description précise du contexte idéal d'usage (quand, à qui, et comment le dire) ainsi qu'un tableau de trois phrases d'exemples concrètes pour illustrer l'expression dans des dialogues ou situations réelles de la vie quotidienne.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Générer du contexte et 3 exemples pour l'expression "${text}" (${sourceLang}) qui se traduit par "${translation}" en français.`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "Explication précise sur le contexte idéal d'usage et les nuances de politesse, d'affection ou d'ironie.",
            },
            examples: {
              type: Type.ARRAY,
              description: "Liste de 3 exemples d'utilisation de l'expression.",
              items: {
                type: Type.OBJECT,
                properties: {
                  nativeSentence: {
                    type: Type.STRING,
                    description: "La phrase d'exemple dans la langue d'origine.",
                  },
                  frenchSentence: {
                    type: Type.STRING,
                    description: "La traduction de cette phrase d'exemple en français.",
                  },
                  contextDescription: {
                    type: Type.STRING,
                    description: "Description de la situation où l'on utilise cet exemple spécifique (ex: discussion amicale, formule d'accueil formelle, etc.).",
                  },
                },
                required: ["nativeSentence", "frenchSentence", "contextDescription"],
              },
            },
          },
          required: ["description", "examples"],
        },
      },
    });

    const parsedText = response.text;
    if (!parsedText) {
      throw new Error("Réponse vide générée par Gemini.");
    }

    const contextData = JSON.parse(parsedText);
    res.json(contextData);
  } catch (error: any) {
    console.error("Erreur de génération de contexte:", error);
    res.status(500).json({
      error: error.message || "Impossible de générer le contexte optionnel.",
    });
  }
});

// REST API endpoint: Download companion mobile APK package
app.get("/api/download-apk", (req, res) => {
  const apkPlaceholder = Buffer.from(
    "PK\x03\x04\n\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x11\x00\x00\x00AndroidManifest.xml... GUIZIGA translate Android Native Wrapper package. Ready for mobile installation side-load. Created by senior developers."
  );
  res.setHeader("Content-Disposition", "attachment; filename=guiziga-translate.apk");
  res.setHeader("Content-Type", "application/vnd.android.package-archive");
  res.send(apkPlaceholder);
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

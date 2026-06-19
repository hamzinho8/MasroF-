import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

let MOROCCAN_DB = "[]";
try {
  MOROCCAN_DB = fs.readFileSync(
    path.join(process.cwd(), "src", "moroccanItemsDB.ts"),
    "utf-8"
  );
} catch (e) {
  console.log("Could not load MOROCCAN_DB", e);
}

async function generateAIContent(
  aiProvider: string,
  geminiKey: string,
  openRouterKey: string,
  parts: any[],
  maxTokens: number = 1000
) {
  if (aiProvider === "openrouter") {
    if (!openRouterKey) throw new Error("OpenRouter API key missing");
    let contentArray = [];
    for (const p of parts) {
      if (p.text) contentArray.push({ type: "text", text: p.text });
      if (p.inlineData) {
        contentArray.push({
          type: "image_url",
          image_url: {
            url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`,
          },
        });
      }
    }

    const imageParts = contentArray.filter((c) => c.type === "image_url");
    const imageSizeLog =
      imageParts.length > 0
        ? `Taille image: ${imageParts
            .map(
              (p) => Math.round((p.image_url?.url.length || 0) / 1024) + "KB"
            )
            .join(", ")}`
        : "Aucune image";
    console.log(
      `[OpenRouter API] Modèle: qwen/qwen2.5-vl-72b-instruct | ${imageSizeLog} | max_tokens demandé: ${maxTokens}`
    );

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://masrof.app",
          "X-Title": "Masrof",
        },
        body: JSON.stringify({
          model: "qwen/qwen2.5-vl-72b-instruct",
          messages: [{ role: "user", content: contentArray }],
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 402) {
        throw new Error(
          "Crédit insuffisant ou limite atteinte sur OpenRouter. Veuillez vérifier votre compte."
        );
      }
      throw new Error(
        `Erreur OpenRouter (${response.status}): ${
          errorData?.error?.message || "Réponse invalide"
        }`
      );
    }
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } else {
    const apiKey = geminiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key missing");
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: parts }],
    });
    return response.text || "";
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API routes FIRST
  app.post("/api/scan-items", async (req, res) => {
    try {
      const {
        imageBase64,
        predefinedItems,
        apiKey,
        openRouterApiKey,
        aiProvider,
      } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      const predefinedText = predefinedItems
        ? `\n\nPREDEFINED ITEMS LIST (JSON):\n${JSON.stringify(
            predefinedItems
          )}\n\nIMPORTANT: Try strictly to match detected items with the ones in this JSON list. If an item matches exactly or closely, output its EXACT name. For its 'amount', use its EXACT json price. DO NOT multiply by quantity detected. Even if there are 3 Danones, 'amount' must be the exact price of 1 Danone.`
        : "";

      const parts = [
        {
          inlineData: {
            data: imageBase64.includes(",")
              ? imageBase64.split(",")[1]
              : imageBase64,
            mimeType: "image/jpeg",
          },
        },
        {
          text: `Analyze this receipt or image of purchased goods from Morocco. Extract:\n1. 'items': an array of UNIQUE items purchased. If the image has identical items, group them into a single item and sum their prices. For each item, give 'amount' (number, representing the total price), 'category' (strictly from ['Nourriture', 'Logement', 'Transport', 'Sanitaire', 'Shopping', 'Loisirs', 'Devoir', 'Autres']), 'title' (string), and 'isStorable' (boolean, true for physical goods).\n2. 'totalReceiptAmount': sum of the receipt (number).\n3. 'paymentMethod': strictly 'CARD', 'CASH', or 'UNKNOWN' if undetermined.\nRespond purely in JSON format like: {"totalReceiptAmount": 100.50, "paymentMethod": "CARD", "items": [{"title": "Danone", "amount": 12.50, "category": "Nourriture", "isStorable": true}]}. Return ONLY valid JSON.${predefinedText}\n\nHere is a list of typical Moroccan items as a reference for item name normalization and category:\n${MOROCCAN_DB}`,
        },
      ];

      const text = await generateAIContent(
        aiProvider,
        apiKey,
        openRouterApiKey,
        parts,
        1500
      );
      const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const data = JSON.parse(match ? match[0] : text);
      res.json(data);
    } catch (e: any) {
      console.error("OCR Items Error:", e);
      res.status(500).json({ error: e.message || "Failed to scan items" });
    }
  });

  app.post("/api/scan-single-item", async (req, res) => {
    try {
      const {
        imageBase64,
        predefinedItems,
        barcode,
        apiKey,
        openRouterApiKey,
        aiProvider,
      } = req.body;
      if (!imageBase64 && !barcode) {
        return res.status(400).json({ error: "No image or barcode provided" });
      }

      const predefinedText = predefinedItems
        ? `\n\nPREDEFINED ITEMS LIST (JSON):\n${JSON.stringify(
            predefinedItems
          )}\n\nIMPORTANT INSTRUCTIONS:\n1. Check if the scanned item resembles any item in this list. If it does, include 'matchedItemId' in your JSON response with the id of that item (otherwise null).\n2. [APPRENTISSAGE] If it matches a predefined item, you MUST use EXACTLY the same category and iconName as the matched item. This allows the system to learn from past user corrections.`
        : "";

      let parts = [];
      if (imageBase64) {
        const actualBase64 = imageBase64.includes(",")
          ? imageBase64.split(",")[1]
          : imageBase64;
        parts.push({
          inlineData: {
            data: actualBase64,
            mimeType: "image/jpeg",
          },
        });
        parts.push({
          text: `You are an expert AI for analyzing Moroccan products (supermarket items, grocery items, etc.).
The user has provided an image of a single product. 
Your task is to identify this product and provide details to add it to a predefined items list.

Extract the following in JSON:
- 'name': The name of the product. Keep it concise, e.g., "Danone Vanille", "Oulmes", "Sidi Ali", "Lait Frais".
- 'price': Estimate the typical current price of this item in Moroccan Dirhams (MAD/DH). If there is a price tag in the image, use it. Otherwise, provide a realistic estimated price (number).
- 'category': The category, strictly ONE of ['Nourriture', 'Logement', 'Transport', 'Sanitaire', 'Shopping', 'Loisirs', 'Devoir', 'Autres'].
- 'iconSvg': Generate a minimalist, scalable, single-color SVG icon string representing this specific item precisely. Use exactly this format with your paths inside: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"> ... </svg>
- 'iconName': A fallback lucide icon name (e.g., 'PackageOpen').
- 'matchedItemId': The id of the predefined item that resembles this one (if any). Otherwise null.
- 'confidence': An integer from 0 to 100 representing how confident you are in your identification. High confidence (>80) if clearly visible and known.
- 'barcode': If you can clearly read a barcode number on the product, include it as a string. Otherwise null.

Respond purely in JSON format like:
{
  "name": "Danone",
  "price": 2.50,
  "category": "Nourriture",
  "iconSvg": "<svg ...>...</svg>",
  "iconName": "Milk",
  "matchedItemId": "3",
  "confidence": 92,
  "barcode": "6111234567890"
}
Return ONLY valid JSON, no markdown formatting blocks.${predefinedText}`,
        });
      } else {
        parts.push({
          text: `You are an expert AI for analyzing Moroccan products (supermarket items, grocery items, etc.).
The user has scanned a product barcode: "${barcode}".
Your task is to identify this product based on its barcode and provide details to add it to a predefined items list. For example, 42104964 is Eau de table Ciel, Morocco, etc. Try your best to identify the product. If you cannot identify the exact product from the barcode, suggest a generic product name based on the barcode format or typical Moroccan products.

Extract the following in JSON:
- 'name': The name of the product (e.g. "Eau Minérale Ciel 33cl"). If completely unknown, return "Article inconnu".
- 'price': Estimate the typical current price of this item in Moroccan Dirhams (MAD/DH). 
- 'category': The category, strictly ONE of ['Nourriture', 'Logement', 'Transport', 'Sanitaire', 'Shopping', 'Loisirs', 'Devoir', 'Autres'].
- 'iconSvg': Generate a minimalist, scalable, single-color SVG icon string representing this specific item precisely. Use exactly this format with your paths inside: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"> ... </svg>
- 'iconName': A fallback lucide icon name (e.g., 'PackageOpen').
- 'matchedItemId': The id of the predefined item that resembles this one (if any). Otherwise null.
- 'confidence': An integer from 0 to 100 representing how confident you are in your identification.
- 'barcode': "${barcode}"

Respond purely in JSON format like:
{
  "name": "Danone",
  "price": 2.50,
  "category": "Nourriture",
  "iconSvg": "<svg ...>...</svg>",
  "iconName": "Milk",
  "matchedItemId": "3",
  "confidence": 92,
  "barcode": "${barcode}"
}
Return ONLY valid JSON, no markdown formatting blocks.${predefinedText}`,
        });
      }

      const text = await generateAIContent(
        aiProvider,
        apiKey,
        openRouterApiKey,
        parts,
        1500
      );
      const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const data = JSON.parse(match ? match[0] : text);
      res.json(data);
    } catch (e: any) {
      console.error("Single Item Scan Error:", e);
      res.status(500).json({ error: e.message || "Failed to scan item" });
    }
  });

  app.post("/api/regenerate-icon", async (req, res) => {
    try {
      const { name, category, apiKey, openRouterApiKey, aiProvider } = req.body;
      const parts = [
        {
          text: `I need a completely custom, perfectly tailored SVG icon for the following item:
Item Name: "${name}"
Category: "${category}"

REQUIREMENTS:
1. Generate a modern, minimalist, single-color SVG icon that looks like a high-quality Lucide icon and perfectly represents the item. Do not just use generic icons if you can draw the exact item.
2. Provide ONLY the pure <svg> HTML string. No markdown wrappers.
3. SVG format must be EXACTLY: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"> ...paths/shapes... </svg>
4. Do not include any text or explanations. Be creative and draw exactly what the item represents.`,
        },
      ];

      let svg = await generateAIContent(
        aiProvider,
        apiKey,
        openRouterApiKey,
        parts,
        800
      );
      svg = svg
        .trim()
        .replace(/^```(svg|html)?\n/, "")
        .replace(/\n```$/, "");
      res.json({ iconSvg: svg });
    } catch (e: any) {
      console.error("Regenerate Icon Error:", e);
      res.status(500).json({ error: e.message || "Failed to regenerate icon" });
    }
  });

  app.post("/api/scan-voice", async (req, res) => {
    try {
      const {
        audioBase64,
        mimeType,
        predefinedItems,
        apiKey,
        openRouterApiKey,
        aiProvider,
      } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: "No audio provided" });
      }

      const predefinedText = predefinedItems
        ? `\n\nPREDEFINED ITEMS LIST (JSON):\n${JSON.stringify(
            predefinedItems
          )}\n\nIMPORTANT: If the user says an item that matches one in this list, output its EXACT name. For its 'amount', output its EXACT json price. DO NOT multiply by quantity.`
        : "";

      const actualBase64 = audioBase64.includes(",")
        ? audioBase64.split(",")[1]
        : audioBase64;

      const parts = [
        {
          inlineData: {
            data: actualBase64,
            mimeType: mimeType || "audio/webm",
          },
        },
        {
          text: `Listen to this voice recording (probably Moroccan Arabic/French) describing bought articles. Extract:\n1. 'items': an array of UNIQUE items mentioned. Group identical items and sum their prices. For each item, give 'amount' (number), 'category' (strictly from ['Nourriture', 'Logement', 'Transport', 'Sanitaire', 'Shopping', 'Loisirs', 'Devoir', 'Autres']), 'title' (string), and 'isStorable' (boolean).\n2. 'totalReceiptAmount': sum of the items (number).\nRespond purely in JSON format like: {"totalReceiptAmount": 100.50, "items": [{"title": "Cafe", "amount": 10, "category": "Nourriture", "isStorable": true}]}. Return ONLY valid JSON.${predefinedText}\n\nHere is a list of typical Moroccan items as a reference for item name normalization and category:\n${MOROCCAN_DB}`,
        },
      ];

      const text = await generateAIContent(
        aiProvider,
        apiKey,
        openRouterApiKey,
        parts,
        1500
      );
      const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const data = JSON.parse(match ? match[0] : text);
      res.json(data);
    } catch (e: any) {
      console.error("Voice parse error:", e);
      res.status(500).json({ error: e.message || "Failed to parse voice" });
    }
  });

  app.post("/api/scan-receipt", async (req, res) => {
    try {
      const { imageBase64, apiKey, openRouterApiKey, aiProvider } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      const parts = [
        {
          inlineData: {
            data: imageBase64.includes(",")
              ? imageBase64.split(",")[1]
              : imageBase64,
            mimeType: "image/jpeg",
          },
        },
        {
          text: "Extract the total amount, expense category, title and date from this receipt. Note: category must be one of ['Alimentation', 'Nourriture', 'Transport', 'Logement', 'Factures', 'Santé', 'Éducation', 'Shopping', 'Loisirs', 'Voyage', 'Autres']. Respond purely in a JSON object format like: {\"amount\": 12.50, \"category\": \"Nourriture\", \"title\": \"Supermarché\", \"date\": \"DD/MM/YYYY\"}. If you can't read it, just return empty values or reasonable defaults. Return ONLY valid JSON, no markdown blocks.",
        },
      ];

      const text = await generateAIContent(
        aiProvider,
        apiKey,
        openRouterApiKey,
        parts,
        2500
      );
      const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const data = JSON.parse(match ? match[0] : text);
      res.json(data);
    } catch (e: any) {
      console.error("OCR Error:", e);
      res.status(500).json({ error: e.message || "Failed to scan receipt" });
    }
  });

  app.post("/api/parse-voice", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "No text provided" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res
          .status(500)
          .json({ error: "Gemini API key is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Extract information from this voice transcript: "${text}". Extract: 1. 'amount' (number), 2. 'label' (string), 3. 'category' (strictly from ['Nourriture', 'Shopping', 'Transport', 'Loisirs', 'Autres']). Respond purely in JSON format like: {"amount": 50, "label": "coffee", "category": "Nourriture"}. If you can't determine something, leave it null. Return ONLY valid JSON, no markdown blocks.\n\nHere is a list of typical Moroccan items as a reference for item name normalization and category:\n${MOROCCAN_DB}`,
              },
            ],
          },
        ],
      });

      const rawText = response.text || "{}";
      const match = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const data = JSON.parse(match ? match[0] : rawText);
      res.json(data);
    } catch (e: any) {
      console.error("Voice Parse Error:", e);
      res
        .status(500)
        .json({ error: e.message || "Failed to parse voice text" });
    }
  });

  app.post("/api/cloudflare-icon", async (req, res) => {
    try {
      const { promptText, cloudflareKey } = req.body;
      if (!cloudflareKey) {
        return res
          .status(400)
          .json({ error: "No Cloudflare API key provided" });
      }

      const accountId = "c662224bb24739b992de58c0d6eda130";
      const model = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
      const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cloudflareKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a professional SVG icon designer. You only output SVG code. Do not output markdown, DO NOT explain anything, just output the raw SVG element.",
            },
            {
              role: "user",
              content: promptText,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Cloudflare API error", errText);
        return res
          .status(response.status)
          .json({ error: "Erreur Cloudflare API" });
      }

      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      console.error("Cloudflare exception:", e);
      res
        .status(500)
        .json({ error: e.message || "Failed to generate Cloudflare icon" });
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

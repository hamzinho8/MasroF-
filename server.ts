import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

let MOROCCAN_DB = "[]";
try {
   MOROCCAN_DB = fs.readFileSync(path.join(process.cwd(), 'src', 'moroccanItemsDB.ts'), 'utf-8');
} catch(e) {
   console.log("Could not load MOROCCAN_DB", e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API routes FIRST
  app.post("/api/scan-items", async (req, res) => {
    try {
      const { imageBase64, predefinedItems } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const predefinedText = predefinedItems ? `\n\nPREDEFINED ITEMS LIST (JSON):\n${JSON.stringify(predefinedItems)}\n\nIMPORTANT: Try strictly to match detected items with the ones in this JSON list. If an item matches exactly or closely, output its EXACT name. For its 'amount', use its EXACT json price. DO NOT multiply by quantity detected. Even if there are 3 Danones, 'amount' must be the exact price of 1 Danone.` : "";

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: "image/jpeg"
                }
              },
              {
                text: `Analyze this receipt or image of purchased goods from Morocco. Extract:\n1. 'items': an array of UNIQUE items purchased. If the image has identical items, group them into a single item and sum their prices. For each item, give 'amount' (number, representing the total price), 'category' (strictly from ['Nourriture', 'Logement', 'Transport', 'Sanitaire', 'Shopping', 'Loisirs', 'Devoir', 'Autres']), 'title' (string), and 'isStorable' (boolean, true for physical goods).\n2. 'totalReceiptAmount': sum of the receipt (number).\n3. 'paymentMethod': strictly 'CARD', 'CASH', or 'UNKNOWN' if undetermined.\nRespond purely in JSON format like: {"totalReceiptAmount": 100.50, "paymentMethod": "CARD", "items": [{"title": "Danone", "amount": 12.50, "category": "Nourriture", "isStorable": true}]}. Return ONLY valid JSON.${predefinedText}\n\nHere is a list of typical Moroccan items as a reference for item name normalization and category:\n${MOROCCAN_DB}`
              }
            ]
          }
        ]
      });

      const text = response.text || "[]";
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(cleanText);
      res.json(data);
    } catch (e: any) {
      console.error("OCR Items Error:", e);
      res.status(500).json({ error: e.message || "Failed to scan items" });
    }
  });

  app.post("/api/scan-single-item", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: "image/jpeg"
                }
              },
              {
                text: `You are an expert AI for analyzing Moroccan products (supermarket items, grocery items, etc.).
The user has provided an image of a single product. 
Your task is to identify this product and provide details to add it to a predefined items list.

Extract the following in JSON:
- 'name': The name of the product. Keep it concise, e.g., "Danone Vanille", "Oulmes", "Sidi Ali", "Lait Frais".
- 'price': Estimate the typical current price of this item in Moroccan Dirhams (MAD/DH). If there is a price tag in the image, use it. Otherwise, provide a realistic estimated price (number).
- 'category': The category, strictly ONE of ['Nourriture', 'Logement', 'Transport', 'Sanitaire', 'Shopping', 'Loisirs', 'Devoir', 'Autres'].
- 'iconName': Choose the most appropriate icon name from lucide-react (e.g., 'Coffee', 'Milk', 'Wheat', 'PackageOpen', 'Cookie', 'Droplets', 'CupSoda', 'Candy', 'Beef', 'Fish', 'Carrot', 'Apple', 'Nut', 'IceCream', 'Baby', 'Cigarette', 'WashingMachine', 'Bath', 'ShoppingBag', 'Utensils').

Respond purely in JSON format like:
{
  "name": "Danone",
  "price": 2.50,
  "category": "Nourriture",
  "iconName": "Milk"
}
Return ONLY valid JSON, no markdown formatting blocks.`
              }
            ]
          }
        ]
      });

      const text = response.text || "{}";
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(cleanText);
      res.json(data);
    } catch (e: any) {
      console.error("Single Item Scan Error:", e);
      res.status(500).json({ error: e.message || "Failed to scan item" });
    }
  });

  app.post("/api/regenerate-icon", async (req, res) => {
    try {
      const { itemName, category } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key missing" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `I need a lucide-react icon name for an item.
Item Name: ${itemName}
Category: ${category}
Give me ONLY the exact string name of a lucide-react icon that best represents this, like 'Coffee', 'Carrot', 'Milk', 'PackageOpen', 'WashingMachine', etc. 
Do not include any other text, JSON, or quotes.`
              }
            ]
          }
        ]
      });

      let text = response.text || "PackageOpen";
      text = text.trim().replace(/['"]/g, '');
      res.json({ iconName: text });
    } catch (e: any) {
      console.error("Regenerate Icon Error:", e);
      res.status(500).json({ error: e.message || "Failed to regenerate icon" });
    }
  });

  app.post("/api/scan-voice", async (req, res) => {
    try {
      const { audioBase64, mimeType, predefinedItems } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: "No audio provided" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const predefinedText = predefinedItems ? `\n\nPREDEFINED ITEMS LIST (JSON):\n${JSON.stringify(predefinedItems)}\n\nIMPORTANT: If the user says an item that matches one in this list, output its EXACT name. For its 'amount', output its EXACT json price. DO NOT multiply by quantity.` : "";

      const actualBase64 = audioBase64.includes(',') ? audioBase64.split(',')[1] : audioBase64;
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: actualBase64,
                  mimeType: mimeType || "audio/webm"
                }
              },
              {
                text: `Listen to this voice recording (probably Moroccan Arabic/French) describing bought articles. Extract:\n1. 'items': an array of UNIQUE items mentioned. Group identical items and sum their prices. For each item, give 'amount' (number), 'category' (strictly from ['Nourriture', 'Logement', 'Transport', 'Sanitaire', 'Shopping', 'Loisirs', 'Devoir', 'Autres']), 'title' (string), and 'isStorable' (boolean).\n2. 'totalReceiptAmount': sum of the items (number).\nRespond purely in JSON format like: {"totalReceiptAmount": 100.50, "items": [{"title": "Cafe", "amount": 10, "category": "Nourriture", "isStorable": true}]}. Return ONLY valid JSON.${predefinedText}\n\nHere is a list of typical Moroccan items as a reference for item name normalization and category:\n${MOROCCAN_DB}`
              }
            ]
          }
        ]
      });

      const text = response.text || "[]";
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(cleanText);
      res.json(data);
    } catch (e: any) {
      console.error("Voice parse error:", e);
      res.status(500).json({ error: e.message || "Failed to parse voice" });
    }
  });

  app.post("/api/scan-receipt", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: "image/jpeg"
                }
              },
              {
                text: "Extract the total amount, expense category, title and date from this receipt. Note: category must be one of ['Alimentation', 'Nourriture', 'Transport', 'Logement', 'Factures', 'Santé', 'Éducation', 'Shopping', 'Loisirs', 'Voyage', 'Autres']. Respond purely in a JSON object format like: {\"amount\": 12.50, \"category\": \"Nourriture\", \"title\": \"Supermarché\", \"date\": \"DD/MM/YYYY\"}. If you can't read it, just return empty values or reasonable defaults. Return ONLY valid JSON, no markdown blocks."
              }
            ]
          }
        ]
      });

      const text = response.text || "{}";
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(cleanText);
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
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Extract information from this voice transcript: "${text}". Extract: 1. 'amount' (number), 2. 'label' (string), 3. 'category' (strictly from ['Nourriture', 'Shopping', 'Transport', 'Loisirs', 'Autres']). Respond purely in JSON format like: {"amount": 50, "label": "coffee", "category": "Nourriture"}. If you can't determine something, leave it null. Return ONLY valid JSON, no markdown blocks.\n\nHere is a list of typical Moroccan items as a reference for item name normalization and category:\n${MOROCCAN_DB}`
              }
            ]
          }
        ]
      });

      const rawText = response.text || "{}";
      const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(cleanText);
      res.json(data);
    } catch (e: any) {
      console.error("Voice Parse Error:", e);
      res.status(500).json({ error: e.message || "Failed to parse voice text" });
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

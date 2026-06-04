var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.post("/api/scan-items", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured on the server." });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
                text: `Analyze this receipt or image. Extract:
1. 'items': an array of items purchased. For each, give 'amount' (number), 'category' (strictly from ['Nourriture', 'Shopping', 'Transport', 'Loisirs', 'Autres']), 'title' (string), and 'isStorable' (true if it's a physical good that can be put in an inventory/stock, false for services or restaurants).
2. 'totalReceiptAmount': sum of the receipt (number).
3. 'paymentMethod': strictly 'CARD', 'CASH', or 'UNKNOWN' if undetermined.
Respond purely in JSON format like: {"totalReceiptAmount": 100.50, "paymentMethod": "CARD", "items": [{"title": "Pizza", "amount": 12.50, "category": "Nourriture", "isStorable": false}]}. Return ONLY valid JSON.`
              }
            ]
          }
        ]
      });
      const text = response.text || "[]";
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(cleanText);
      res.json(data);
    } catch (e) {
      console.error("OCR Items Error:", e);
      res.status(500).json({ error: e.message || "Failed to scan items" });
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
      const ai = new import_genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
                text: `Extract the total amount, expense category, title and date from this receipt. Note: category must be one of ['Alimentation', 'Nourriture', 'Transport', 'Logement', 'Factures', 'Sant\xE9', '\xC9ducation', 'Shopping', 'Loisirs', 'Voyage', 'Autres']. Respond purely in a JSON object format like: {"amount": 12.50, "category": "Nourriture", "title": "Supermarch\xE9", "date": "DD/MM/YYYY"}. If you can't read it, just return empty values or reasonable defaults. Return ONLY valid JSON, no markdown blocks.`
              }
            ]
          }
        ]
      });
      const text = response.text || "{}";
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const data = JSON.parse(cleanText);
      res.json(data);
    } catch (e) {
      console.error("OCR Error:", e);
      res.status(500).json({ error: e.message || "Failed to scan receipt" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

import { GoogleGenAI } from "@google/genai";

export async function generateAIContent(
  aiProvider: string,
  geminiKey: string | null | undefined,
  openRouterKey: string | null | undefined,
  parts: any[],
  maxTokens: number = 800,
  jsonMode: boolean = false
): Promise<string> {
  const contentArray = parts.map((p) => {
    if (p.inlineData) {
      return {
        type: "image_url",
        image_url: {
          url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`,
        },
      };
    } else if (p.text) {
      return {
        type: "text",
        text: p.text,
      };
    }
    return p;
  });

  if (aiProvider === "openrouter") {
    if (!openRouterKey) throw new Error("OpenRouter API key missing");

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

    const bodyVariables: any = {
      model: "qwen/qwen2.5-vl-72b-instruct",
      messages: [
        {
          role: "user",
          content:
            imageParts.length === 0
              ? contentArray.map((c: any) => c.text || JSON.stringify(c)).join("\n")
              : contentArray,
        },
      ],
      max_tokens: maxTokens,
    };

    if (jsonMode) {
      bodyVariables.response_format = { type: "json_object" };
    }

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
        body: JSON.stringify(bodyVariables),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.debug("[OpenRouter API] Error HTTP", response.status, errText);
      throw new Error(`OpenRouter error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } else {
    const apiKey = geminiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key missing");

    // Fallback: Using normal gemini
    const ai = new GoogleGenAI({ apiKey });

    const config: any = {};
    if (jsonMode) {
      config.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: parts }],
      config: config,
    });
    return response.text || "";
  }
}

import React, { useRef, useState, useEffect } from "react";
import {
  Camera,
  X,
  Plus,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  RefreshCw,
  Barcode,
  Repeat,
  CheckCircle2,
  AlertTriangle,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PredefinedItem } from "../types";
import { CATEGORIES, ICON_MAP } from "../constants";
import { Html5QrcodeScanner } from "html5-qrcode";
import { generateAIContent } from "../utils/ai";

interface ReceiptScannerModalProps {
  onClose: () => void;
  predefinedItems: PredefinedItem[];
  onAddPredefinedItem: (item: PredefinedItem) => void;
  onUpdatePredefinedItem: (
    id: string,
    updates: Partial<PredefinedItem>
  ) => void;
}

export default function ReceiptScannerModal({
  onClose,
  predefinedItems,
  onAddPredefinedItem,
  onUpdatePredefinedItem,
}: ReceiptScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItem, setScannedItem] = useState<{
    name: string;
    price: number;
    category: string;
    iconName: string;
    iconSvg?: string;
    matchedItemId?: string | null;
    confidence?: number;
    barcode?: string | null;
  } | null>(null);
  const [isRegeneratingIcon, setIsRegeneratingIcon] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isContinuousMode, setIsContinuousMode] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [isBarcodeReaderOpen, setIsBarcodeReaderOpen] = useState(false);
  const [aiProvider, setAiProvider] = useState<string>(
    () => localStorage.getItem("ai_provider") || "gemini"
  );

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isBarcodeReaderOpen) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          fps: 10,
        },
        false
      );
      scanner.render(
        (decodedText) => {
          scanner.clear();
          setIsBarcodeReaderOpen(false);
          handleBarcodeFound(decodedText);
        },
        (error) => {}
      );
      return () => {
        scanner.clear().catch((e) => console.error(e));
      };
    }
  }, [isBarcodeReaderOpen]);

  const handleBarcodeFound = async (code: string) => {
    setIsScanning(true);
    setError(null);
    try {
      const apiKeyValue =
        import.meta.env.VITE_GEMINI_API_KEY ||
        localStorage.getItem("gemini_api_key");
      const openRouterKeyValue = localStorage.getItem("openrouter_api_key");

      const predefinedText = predefinedItems
        ? `\n\nPREDEFINED ITEMS LIST (JSON):\n${JSON.stringify(
            predefinedItems
          )}\n\nIMPORTANT INSTRUCTIONS:\n1. Check if the scanned item resembles any item in this list. If it does, include 'matchedItemId' in your JSON response with the id of that item (otherwise null).\n2. [APPRENTISSAGE] If it matches a predefined item, you MUST use EXACTLY the same category and iconName as the matched item. This allows the system to learn from past user corrections.`
        : "";

      const parts = [
        {
          text: `You are an expert AI for analyzing Moroccan products (supermarket items, grocery items, etc.).
The user has scanned a product barcode: "${code}".
Your task is to identify this product based on its barcode and provide details to add it to a predefined items list. For example, 42104964 is Eau de table Ciel, Morocco, etc. Try your best to identify the product. If you cannot identify the exact product from the barcode, suggest a generic product name based on the barcode format or typical Moroccan products.

Extract the following in JSON:
- 'name': The name of the product (e.g. "Eau Minérale Ciel 33cl"). If completely unknown, return "Article inconnu".
- 'price': Estimate the typical current price of this item in Moroccan Dirhams (MAD/DH). 
- 'category': The category, strictly ONE of ['Nourriture', 'Logement', 'Transport', 'Sanitaire', 'Shopping', 'Loisirs', 'Devoir', 'Autres'].
- 'iconSvg': Generate a minimalist, scalable, single-color SVG icon string representing this specific item precisely. Use exactly this format with your paths inside: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"> ... </svg>
- 'iconName': A fallback lucide icon name (e.g., 'PackageOpen').
- 'matchedItemId': The id of the predefined item that resembles this one (if any). Otherwise null.
- 'confidence': An integer from 0 to 100 representing how confident you are in your identification.
- 'barcode': "${code}"

Respond purely in JSON format like:
{
  "name": "Danone",
  "price": 2.50,
  "category": "Nourriture",
  "iconSvg": "<svg ...>...</svg>",
  "iconName": "Milk",
  "matchedItemId": "3",
  "confidence": 92,
  "barcode": "${code}"
}
Return ONLY valid JSON, no markdown formatting blocks.${predefinedText}`,
        },
      ];

      const textResult = await generateAIContent(
        aiProvider,
        apiKeyValue,
        openRouterKeyValue,
        parts,
        1500,
        true
      );
      const match = textResult.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      const data = JSON.parse(match ? match[0] : textResult);

      if (data && data.name) {
        setScannedItem({
          name: data.name || `Article (${code})`,
          price: data.price || 0,
          category: data.category || "Autres",
          iconName: data.iconName || "PackageOpen",
          iconSvg: data.iconSvg,
          matchedItemId: data.matchedItemId,
          confidence: data.confidence,
          barcode: data.barcode || code,
        });
      } else {
        setError("L'IA n'a pas pu identifier cet article. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Barcode scanning error", err);
      setScannedItem({
        name: `Article (${code})`,
        price: 0,
        category: "Autres",
        iconName: "PackageOpen",
        barcode: code,
        confidence: 100,
      });
    }
    setIsScanning(false);
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // max width for API
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        try {
          const apiKeyValue =
            import.meta.env.VITE_GEMINI_API_KEY ||
            localStorage.getItem("gemini_api_key");
          const openRouterKeyValue = localStorage.getItem("openrouter_api_key");

          const predefinedText = predefinedItems
            ? `\n\nPREDEFINED ITEMS LIST (JSON):\n${JSON.stringify(
                predefinedItems
              )}\n\nIMPORTANT INSTRUCTIONS:\n1. Check if the scanned item resembles any item in this list. If it does, include 'matchedItemId' in your JSON response with the id of that item (otherwise null).\n2. [APPRENTISSAGE] If it matches a predefined item, you MUST use EXACTLY the same category and iconName as the matched item. This allows the system to learn from past user corrections.`
            : "";
          const parts = [
            {
              inlineData: {
                data: compressedBase64.includes(",")
                  ? compressedBase64.split(",")[1]
                  : compressedBase64,
                mimeType: "image/jpeg",
              },
            },
            {
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
            },
          ];

          const textResult = await generateAIContent(
            aiProvider,
            apiKeyValue,
            openRouterKeyValue,
            parts,
            1500,
            true
          );
          const match = textResult.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          const data = JSON.parse(match ? match[0] : textResult);

          if (data && data.name) {
            setScannedItem({
              name: data.name || "",
              price: data.price || 0,
              category: data.category || "Autres",
              iconName: data.iconName || "PackageOpen",
              iconSvg: data.iconSvg,
              matchedItemId: data.matchedItemId,
              confidence: data.confidence,
              barcode: data.barcode,
            });
          } else {
            setError(
              "L'IA n'a pas pu identifier cet article. Veuillez réessayer."
            );
          }
        } catch (err) {
          console.error("Scanning error", err);
          setError("Problème de connexion. Veuillez réessayer.");
        }
        setIsScanning(false);
      };

      img.onerror = () => {
        setError("Impossible de lire l'image.");
        setIsScanning(false);
      };

      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setError("Impossible de lire l'image.");
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRegenerateIcon = async () => {
    if (!scannedItem) return;
    setIsRegeneratingIcon(true);
    try {
      const apiKeyValue =
        import.meta.env.VITE_GEMINI_API_KEY ||
        localStorage.getItem("gemini_api_key");
      const openRouterKeyValue = localStorage.getItem("openrouter_api_key");

      const parts = [
        {
          text: `I need a completely custom, perfectly tailored SVG icon for the following item:
Item Name: "${scannedItem.name}"
Category: "${scannedItem.category}"

REQUIREMENTS:
1. Generate a modern, minimalist, single-color SVG icon that looks like a high-quality Lucide icon and perfectly represents the item. Do not just use generic icons if you can draw the exact item.
2. Provide ONLY the pure <svg> HTML string. No markdown wrappers.
3. SVG format must be EXACTLY: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"> ...paths/shapes... </svg>
4. Do not include any text or explanations. Be creative and draw exactly what the item represents.`,
        },
      ];

      let svgResult = await generateAIContent(
        aiProvider,
        apiKeyValue,
        openRouterKeyValue,
        parts,
        800
      );
      svgResult = svgResult
        .trim()
        .replace(/^```(svg|html)?\n/, "")
        .replace(/\n```$/, "");

      if (svgResult && svgResult.startsWith("<svg")) {
        setScannedItem({ ...scannedItem, iconSvg: svgResult });
      }
    } catch (e) {
      console.error(e);
    }
    setIsRegeneratingIcon(false);
  };

  const handleAdd = () => {
    if (!scannedItem) return;
    const id =
      Date.now().toString() + Math.random().toString(36).substring(2, 9);
    onAddPredefinedItem({
      id,
      name: scannedItem.name,
      price: scannedItem.price,
      category: scannedItem.category,
      iconName: scannedItem.iconName,
      iconSvg: scannedItem.iconSvg,
      frequent: true,
      // barcode: scannedItem.barcode // if the type supported it
    });

    if (isContinuousMode) {
      setScannedItem(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 2000);
    } else {
      onClose();
    }
  };

  const handleUpdate = () => {
    if (!scannedItem || !scannedItem.matchedItemId) return;
    onUpdatePredefinedItem(scannedItem.matchedItemId, {
      name: scannedItem.name,
      price: scannedItem.price,
      category: scannedItem.category,
      iconName: scannedItem.iconName,
      iconSvg: scannedItem.iconSvg,
    });
    if (isContinuousMode) {
      setScannedItem(null);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 2000);
    } else {
      onClose();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000]"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 max-h-[90vh] h-[85vh] flex flex-col bg-slate-50 rounded-t-[32px] shadow-2xl z-[1001] overflow-hidden max-w-md mx-auto"
      >
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">
                Scanner Article
              </h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
                Par Intelligence Artificielle
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:bg-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence>
            {successToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 left-6 right-6 bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-lg rounded-xl p-3 flex items-center justify-center gap-2 z-50 font-bold"
              >
                <CheckCircle2 size={18} /> Article ajouté avec succès !
              </motion.div>
            )}
          </AnimatePresence>

          {!isScanning && !scannedItem && (
            <div className="flex flex-col items-center justify-center text-center bg-white rounded-[24px] border border-slate-100 shadow-sm mt-4 overflow-hidden relative">
              {isBarcodeReaderOpen ? (
                <div className="w-full relative flex flex-col items-center">
                  <div className="w-full bg-slate-900 relative flex items-center justify-center overflow-hidden min-h-[300px] rounded-t-[24px]">
                    <div
                      id="reader"
                      className="w-full h-full text-white overflow-hidden [&_video]:object-cover [&_video]:w-full [&_video]:h-full [&_button]:bg-blue-600 [&_button]:text-white [&_button]:px-4 [&_button]:py-2 [&_button]:rounded-xl [&_button]:font-bold [&_button]:mt-4 [&_button]:mb-4 [&_select]:text-slate-800 [&_select]:p-2 [&_select]:rounded-lg [&_select]:mb-4"
                    />
                  </div>
                  <button
                    onClick={() => setIsBarcodeReaderOpen(false)}
                    className="w-full bg-slate-100 text-slate-600 font-bold py-4 px-2 hover:bg-slate-200 transition"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <div className="p-8 w-full flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-slate-600 font-medium mb-6">
                    Prenez une photo d'un de vos articles d'achat pour que notre
                    IA l'analyse et l'ajoute à votre catalogue.
                  </p>

                  {error && (
                    <div className="w-full bg-rose-50 text-rose-600 text-sm font-bold p-4 rounded-xl mb-6 shadow-sm border border-rose-100">
                      {error}
                    </div>
                  )}

                  <div className="flex w-full gap-4 mb-4 justify-between">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold h-20 rounded-2xl hover:opacity-90 transition shadow-md flex items-center justify-center"
                    >
                      <Camera size={32} />
                    </button>
                    <button
                      onClick={() => setIsBarcodeReaderOpen(true)}
                      className="flex-1 bg-slate-800 text-white font-bold h-20 rounded-2xl hover:bg-slate-700 transition shadow-md flex items-center justify-center"
                    >
                      <Barcode size={32} />
                    </button>
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex-1 bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold h-20 rounded-2xl hover:opacity-90 transition shadow-md flex items-center justify-center"
                    >
                      <ImageIcon size={32} />
                    </button>
                  </div>

                  <div className="w-full mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 text-center">
                      Moteur d'IA
                    </label>
                    <div className="flex bg-slate-100/80 rounded-2xl p-1.5 h-[60px] items-center overflow-hidden w-full border border-slate-200/60 shadow-inner">
                      <button
                        type="button"
                        onClick={() => {
                          setAiProvider("gemini");
                          localStorage.setItem("ai_provider", "gemini");
                        }}
                        className={`flex-1 h-full rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${
                          aiProvider === "gemini"
                            ? "bg-white text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                        }`}
                      >
                        <Sparkles
                          size={16}
                          className={
                            aiProvider === "gemini" ? "text-blue-500" : ""
                          }
                        />{" "}
                        Gemini
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAiProvider("openrouter");
                          localStorage.setItem("ai_provider", "openrouter");
                        }}
                        className={`flex-1 h-full rounded-xl text-xs font-black tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${
                          aiProvider === "openrouter"
                            ? "bg-white text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                        }`}
                      >
                        <Cpu
                          size={16}
                          className={
                            aiProvider === "openrouter" ? "text-blue-500" : ""
                          }
                        />{" "}
                        OpenRouter
                      </button>
                    </div>
                  </div>

                  <label
                    onClick={() => setIsContinuousMode(!isContinuousMode)}
                    className="flex items-center gap-3 bg-slate-50 border border-slate-200 w-full p-4 rounded-2xl cursor-pointer hover:bg-slate-100 transition mt-2"
                  >
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        isContinuousMode
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isContinuousMode && <CheckCircle2 size={16} />}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Repeat size={14} className="text-blue-500" /> Mode Scan
                        Continu
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Ajouter plusieurs articles à la suite sans refermer
                      </span>
                    </div>
                  </label>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
                className="hidden"
                onChange={handleImageSelection}
              />
              <input
                type="file"
                accept="image/*"
                ref={galleryInputRef}
                className="hidden"
                onChange={handleImageSelection}
              />
            </div>
          )}

          {isScanning && (
            <div className="flex flex-col items-center justify-center p-12 mt-12">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse" />
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg relative border border-blue-100">
                  <Sparkles size={32} className="text-blue-500 animate-pulse" />
                </div>
              </div>
              <p className="text-slate-600 font-bold mb-2">
                L'IA analyse votre image...
              </p>
              <p className="text-slate-400 text-sm text-center">
                Détection de l'article, du prix estimé et génération de l'icône
                appropriée.
              </p>
            </div>
          )}

          {scannedItem && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4 mb-6 relative">
                  <div
                    className={`w-20 h-20 shadow-inner rounded-2xl flex items-center justify-center group ${
                      CATEGORIES.find((c) => c.id === scannedItem.category)
                        ?.bgColor || "bg-slate-50"
                    }`}
                  >
                    {(() => {
                      const cat =
                        CATEGORIES.find((c) => c.id === scannedItem.category) ||
                        CATEGORIES.find((c) => c.id === "Autres")!;
                      if (scannedItem.iconSvg) {
                        return (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: scannedItem.iconSvg,
                            }}
                            className={`w-10 h-10 ${cat.color} transition-transform group-hover:scale-110`}
                          />
                        );
                      }
                      const IconComponent =
                        (ICON_MAP as Record<string, React.ElementType>)[
                          scannedItem.iconName
                        ] || ICON_MAP["PackageOpen"];
                      return (
                        <IconComponent
                          size={40}
                          className={`${cat.color} transition-transform group-hover:scale-110`}
                        />
                      );
                    })()}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-center w-full">
                      <button
                        onClick={handleRegenerateIcon}
                        disabled={isRegeneratingIcon}
                        className="flex items-center justify-center flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold active:bg-blue-100 transition-colors"
                      >
                        {isRegeneratingIcon ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RefreshCw size={16} className="mr-1" />
                        )}
                        Icône
                      </button>
                    </div>
                    {scannedItem.confidence !== undefined && (
                      <div
                        className={`text-[10px] w-full font-black uppercase tracking-wider px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5 ${
                          scannedItem.confidence >= 80
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : scannedItem.confidence >= 50
                            ? "bg-amber-50 text-amber-600 border border-amber-200"
                            : "bg-rose-50 text-rose-600 border border-rose-200"
                        }`}
                      >
                        <Sparkles size={12} />
                        Confiance IA: {scannedItem.confidence}%
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {scannedItem.barcode && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Barcode size={18} />
                        <span className="text-xs font-bold">
                          Code-Barres détecté
                        </span>
                      </div>
                      <span className="text-sm font-mono font-black text-slate-800">
                        {scannedItem.barcode}
                      </span>
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">
                      Nom de l'article
                    </label>
                    <input
                      type="text"
                      value={scannedItem.name}
                      onChange={(e) =>
                        setScannedItem({ ...scannedItem, name: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">
                        Prix (DH)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={scannedItem.price}
                        onChange={(e) =>
                          setScannedItem({
                            ...scannedItem,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="flex-[1.5]">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">
                        Catégorie
                      </label>
                      <select
                        value={scannedItem.category}
                        onChange={(e) =>
                          setScannedItem({
                            ...scannedItem,
                            category: e.target.value,
                          })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {scannedItem && (
          <div className="p-6 bg-white border-t border-slate-100 flex-shrink-0 absolute bottom-0 left-0 right-0 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            {scannedItem.matchedItemId ? (
              <div className="space-y-3">
                <div className="text-center text-xs font-bold text-amber-700 bg-amber-50 rounded-lg p-3 border border-amber-200 shadow-sm flex items-center justify-center gap-2">
                  <Sparkles size={16} /> L'article ressemble à "
                  {
                    predefinedItems.find(
                      (p) => p.id === scannedItem.matchedItemId
                    )?.name
                  }
                  ".
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 bg-amber-500 text-white font-black py-4 px-2 rounded-2xl hover:bg-amber-600 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 text-sm text-center leading-tight"
                  >
                    Mettre à jour l'existant
                  </button>
                  <button
                    onClick={handleAdd}
                    className="flex-1 bg-slate-900 text-white font-black py-4 px-2 rounded-2xl hover:bg-slate-800 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 text-sm leading-tight"
                  >
                    <Plus size={18} />
                    Nouveau
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full bg-slate-900 text-white font-black py-4 px-6 rounded-2xl hover:bg-slate-800 transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Valider et Ajouter au catalogue
              </button>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}

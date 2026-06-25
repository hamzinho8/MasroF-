import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Camera as CameraIcon } from "@capacitor/camera"; // capacitor camera
import { CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { GoogleGenAI } from "@google/genai";
import { generateAIContent } from "../utils/ai";
import {
  X,
  Check,
  Image as ImageIcon,
  Camera as CameraLucideIcon,
  Utensils,
  ShoppingBag,
  Car,
  Gamepad2,
  MoreHorizontal,
  ScanText,
  Loader2,
  Mic,
  MicOff,
  Home as HomeIcon,
  HeartPulse,
  Heart,
  ShoppingCart,
  Sparkles,
  Cpu,
} from "lucide-react";
import { PredefinedItem } from "../types";
import {
  ICON_MAP,
  CATEGORIES,
  INITIAL_PREDEFINED_ITEMS,
  getArticleInfo,
} from "../constants";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    label: string,
    amount: number,
    type: "INCOME" | "EXPENSE",
    category?: string,
    paidByBank?: boolean,
    isPureInflow?: boolean,
    inventoryData?: {
      quantity: number;
      color: string;
      bg: string;
      iconName: string;
      iconSvg?: string;
    }
  ) => void;
  initialType: "INCOME" | "EXPENSE";
  currency: string;
  predefinedItems: PredefinedItem[];
  isShoppingMode?: boolean;
  initialLabel?: string;
  initialAmount?: number;
  initialCategory?: string;
}

interface ScannedItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  addToInventory?: boolean;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
  initialType,
  currency,
  predefinedItems,
  isShoppingMode,
  initialLabel,
  initialAmount,
  initialCategory,
}: AddTransactionModalProps) {
  const [label, setLabel] = useState(initialLabel || "");
  const [amount, setAmount] = useState(
    initialAmount ? initialAmount.toString() : ""
  );
  const [type, setType] = useState<"INCOME" | "EXPENSE">(initialType);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "Autres"
  );
  const [showFrequent, setShowFrequent] = useState(true);
  const [paidByBank, setPaidByBank] = useState(false);
  const [addToInventory, setAddToInventory] = useState(false);
  const [inventoryQty, setInventoryQty] = useState("1");
  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [scannedItems, setScannedItems] = useState<ScannedItem[] | null>(null);
  const [editingCategoryItemId, setEditingCategoryItemId] = useState<
    string | null
  >(null);
  const [receiptTotal, setReceiptTotal] = useState<number | null>(null);
  const [detectedPaymentGroup, setDetectedPaymentGroup] = useState<
    string | null
  >(null);
  const [aiProvider, setAiProvider] = useState<string>(
    () => localStorage.getItem("ai_provider") || "gemini"
  );

  const [selectedMultiItems, setSelectedMultiItems] = useState<
    { name: string; price: number; category: string }[]
  >([]);

  React.useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setLabel(initialLabel || "");
      setAmount(initialAmount ? initialAmount.toString() : "");
      setSelectedCategory(initialCategory || "Autres");
      setShowFrequent(true);
      setPaidByBank(false);
      setAddToInventory(false);
      setInventoryQty("1");
      setScannedItems(null);
      setReceiptTotal(null);
      setDetectedPaymentGroup(null);
      setIsListening(false);
      setSelectedMultiItems([]);
    }
  }, [isOpen, initialType]);

  const audioInputRef = useRef<HTMLInputElement>(null);

  const stopListening = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const startListening = async () => {
    if (isListening) {
      stopListening();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const actualMimeType = mediaRecorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, {
          type: actualMimeType,
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          processVoiceRecording(base64Audio, actualMimeType);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.debug("Microphone not available, using fallback", err);
      audioInputRef.current?.click();
    }
  };

  const processVoiceRecording = async (
    base64Audio: string,
    mimeType: string
  ) => {
    setIsScanning(true);
    let data: any = null;
    const apiKeyValue =
      window.localStorage.getItem("gemini_api_key") ||
      window.localStorage.getItem("userGeminiApiKey");
    const openRouterKeyValue = localStorage.getItem("openrouter_api_key");

    try {
      const actualBase64 = base64Audio.includes(",")
        ? base64Audio.split(",")[1]
        : base64Audio;
      const predefinedText = predefinedItems
        ? `\n\nPREDEFINED ITEMS LIST (JSON):\n${JSON.stringify(
            predefinedItems
          )}\n\nIMPORTANT: If the user says an item that matches one in this list, output its EXACT name. For its 'amount', output its EXACT json price. DO NOT multiply by quantity.`
        : "";

      const parts = [
        {
          inlineData: {
            data: actualBase64,
            mimeType: mimeType || "audio/webm",
          },
        },
        {
          text: `Listen to this voice recording (probably Moroccan Arabic/French) describing bought articles. Extract:\n1. 'items': an array of UNIQUE items mentioned. Group identical items and sum their prices. For each item, give 'amount' (number), 'category' (strictly from ['Nourriture', 'Logement', 'Transport', 'Sanitaire', 'Shopping', 'Loisirs', 'Devoir', 'Autres']), 'title' (string), and 'isStorable' (boolean).\n2. 'totalReceiptAmount': sum of the items (number).\nRespond purely in JSON format like: {"totalReceiptAmount": 100.50, "items": [{"title": "Cafe", "amount": 10, "category": "Nourriture", "isStorable": true}]}. Return ONLY valid JSON.${predefinedText}`,
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
      const cleanText = match ? match[0] : textResult;
      data = JSON.parse(cleanText);
    } catch (error: any) {
      console.debug("Voice scanning error", error);
      alert(`Erreur lors de la reconnaissance vocale: ${error.message}`);
    }

    if (data && data.items) {
      const deduplicatedItems = deduplicateItems(data.items);
      setScannedItems(deduplicatedItems);
      setReceiptTotal(data.totalReceiptAmount || null);
      setDetectedPaymentGroup("cash"); // Default payment method for voice
      setShowFrequent(false);
    }
    setIsScanning(false);
  };

  const handleVoiceFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      await processVoiceRecording(base64Audio, file.type);
    };
    reader.readAsDataURL(file);

    // reset
    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }
  };

  const deduplicateItems = (items: any[]) => {
    const groupedItemsSet: Record<string, any> = {};
    items.forEach((item: any) => {
      const tempTitle = (item.title || "Achat").toLowerCase();
      if (groupedItemsSet[tempTitle]) {
        groupedItemsSet[tempTitle].amount =
          (groupedItemsSet[tempTitle].amount || 0) + (item.amount || 0);
        groupedItemsSet[tempTitle].originalCount =
          (groupedItemsSet[tempTitle].originalCount || 1) + 1;
      } else {
        groupedItemsSet[tempTitle] = { ...item, originalCount: 1 };
      }
    });
    const deduplicatedItems = Object.values(groupedItemsSet);

    return deduplicatedItems.map((item: any, index: number) => {
      let amount = item.amount || 0;
      let title = item.title || "Achat";
      let category = item.category || "Autres";
      let mappedCatId = "other";
      const matchedCat = CATEGORIES.find(
        (c) => c.id === category || c.label === category
      );
      if (matchedCat) {
        category = matchedCat.id;
        mappedCatId = matchedCat.id;
      }

      const matchedPredefined = predefinedItems.find(
        (p) => p.name.toLowerCase() === title.toLowerCase()
      );
      if (matchedPredefined) {
        amount = matchedPredefined.price;
        title = matchedPredefined.name;
        category = matchedPredefined.category;
        mappedCatId = matchedPredefined.category;
      }

      return {
        ...item,
        amount,
        title,
        id: index.toString() + Math.random().toString(36).substring(2, 9),
        categoryId: mappedCatId,
        category,
      };
    });
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setShowFrequent(false);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFallbackImageSelection = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setIsScanning(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      if (result) {
        try {
          const apiKeyValue =
            window.localStorage.getItem("gemini_api_key") ||
            window.localStorage.getItem("userGeminiApiKey");
          const openRouterKeyValue = localStorage.getItem("openrouter_api_key");
          let data: any = null;
          const response = await fetch("/api/scan-items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageBase64: result,
              predefinedItems: predefinedItems,
              apiKey: apiKeyValue,
              openRouterApiKey: openRouterKeyValue,
              aiProvider,
            }),
          });

          if (response.ok) {
            data = await response.json();
            if (data.items) {
              setScannedItems(deduplicateItems(data.items));
              setReceiptTotal(data.total || data.totalReceiptAmount || null);
              setDetectedPaymentGroup(
                data.paymentMethod === "CASH" ? "cash" : "bank"
              );
              setShowFrequent(false);
            } else {
              alert(
                "L'IA n'a détecté aucun article. Veuillez réessayer avec une image plus claire."
              );
            }
          } else {
            alert(
              "Erreur serveur lors de la numérisation. L'IA a peut-être rencontré un problème."
            );
          }
        } catch (error: any) {
          console.debug("Scanning error", error);
          alert(`Erreur de connexion: ${error.message}`);
        }
      } else {
        alert("Erreur lors de la lecture de l'image.");
      }
      setIsScanning(false);
    };
    reader.onerror = () => {
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
    // Reset file input
    event.target.value = "";
  };

  const [showImageSourceModal, setShowImageSourceModal] = useState(false);

  const handleScanReceipt = async (
    sourceType: CameraSource = CameraSource.Prompt
  ) => {
    setShowImageSourceModal(false);
    try {
      setIsScanning(true);
      if (Capacitor.isNativePlatform()) {
        try {
          await Filesystem.mkdir({
            path: "Pictures",
            directory: Directory.External,
            recursive: true,
          });
        } catch (e) {
          // ignore if it exists
        }
      }
      await Camera.requestPermissions();

      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: sourceType,
        saveToGallery: true,
        width: 1024,
      });

      if (!image.base64String) {
        setIsScanning(false);
        return;
      }

      let data: any = null;
      let usedFallback = false;
      const apiKeyValue =
        window.localStorage.getItem("gemini_api_key") ||
        window.localStorage.getItem("userGeminiApiKey");
      const openRouterKeyValue = localStorage.getItem("openrouter_api_key");

      try {
        const parts = [
          {
            inlineData: {
              data: image.base64String,
              mimeType: "image/jpeg",
            },
          },
          {
            text: `Analyze this receipt or image of purchased goods from Morocco (prices use Dirham, labels might be French/Arabic). Extract:\n1. 'items': an array of UNIQUE items purchased. Try to map item titles strictly to these predefined articles if they match: ${predefinedItems
              .map((p) => p.name)
              .join(
                ", "
              )}. If they match, use their EXACT price from the predefined items list as 'amount'. Do NOT multiply by quantity. For each item, give 'amount' (number), 'category' (strictly from ['Nourriture', 'Logement', 'Transport', 'Sanitaire', 'Shopping', 'Loisirs', 'Devoir', 'Autres']), 'title' (string, use predefined names where possible), and 'isStorable' (boolean, false by default).\n2. 'totalReceiptAmount': sum of the receipt (number).\n3. 'paymentMethod': strictly 'CARD', 'CASH', or 'UNKNOWN' if undetermined.\nRespond purely in JSON format like: {"totalReceiptAmount": 100.50, "paymentMethod": "CARD", "items": [{"title": "Danone", "amount": 18, "category": "Nourriture", "isStorable": false}]}. Return ONLY valid JSON.`,
          },
        ];

        const textResult = await generateAIContent(
          aiProvider,
          apiKeyValue,
          openRouterKeyValue,
          parts,
          2500,
          true
        );
        const match = textResult.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        const cleanText = match ? match[0] : textResult;
        data = JSON.parse(cleanText);
      } catch (err: any) {
        console.debug("Camera OCR scan error:", err);
        alert(`Erreur avec l'IA: ${err.message}`);
        return;
      }

      if (data) {
        let itemsToSet: any[] = [];
        if (Array.isArray(data)) {
          itemsToSet = data;
        } else if (data.items && Array.isArray(data.items)) {
          itemsToSet = data.items;
          if (data.totalReceiptAmount) setReceiptTotal(data.totalReceiptAmount);
          if (data.paymentMethod === "CARD") setPaidByBank(true);
          if (data.paymentMethod === "CASH") setPaidByBank(false);
          setDetectedPaymentGroup(data.paymentMethod);
        } else {
          itemsToSet = [data]; // Fallback for single object
        }

        if (itemsToSet.length > 0) {
          setScannedItems(deduplicateItems(itemsToSet));
        } else {
          alert("Aucun article n'a été détecté dans l'image.");
        }
      }
    } catch (e: any) {
      console.log("Camera error / OCR failed:", e);
      if (
        e.message &&
        (e.message.toLowerCase().includes("user cancelled") ||
          e.message.toLowerCase().includes("canceled"))
      ) {
        return; // silently ignore
      }
      console.log("Triggering fallback file input due to error...");
      if (sourceType === CameraSource.Photos && galleryInputRef.current) {
        galleryInputRef.current.click();
      } else if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        alert("Erreur lors de la numérisation : " + e.message);
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleItemSelect = (name: string, price: number, category: string) => {
    setSelectedMultiItems((prev) => {
      const exists = prev.find((p) => p.name === name);
      if (exists) {
        return prev.filter((p) => p.name !== name);
      } else {
        return [...prev, { name, price, category }];
      }
    });
  };

  React.useEffect(() => {
    if (selectedMultiItems.length === 1) {
      setLabel(selectedMultiItems[0].name);
      setAmount(selectedMultiItems[0].price.toString());
      setSelectedCategory(selectedMultiItems[0].category);
    } else if (selectedMultiItems.length === 0) {
      setLabel("");
      setAmount("");
    }
  }, [selectedMultiItems]);

  const handleScanItemChange = (
    id: string,
    field: keyof ScannedItem,
    value: any
  ) => {
    setScannedItems((prev) =>
      prev
        ? prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
        : null
    );
  };

  const handleConfirmAllScannedItems = () => {
    if (!scannedItems) return;

    scannedItems.forEach((item) => {
      if (!item.amount || item.amount <= 0) return;

      let invReq = undefined;
      const cat =
        CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[7];
      if (addToInventory || item.addToInventory) {
        const articleInfo = INITIAL_PREDEFINED_ITEMS.find(
          (p) => p.name.toLowerCase() === (item.title || "").toLowerCase()
        );
        const iconName =
          articleInfo && articleInfo.iconName ? articleInfo.iconName : "Box";

        invReq = {
          quantity: 1, // Defaulting scan items quantities to 1
          color: cat.color,
          bg: cat.bgColor,
          iconName,
        };
      }

      onAdd(
        item.title || "Achat",
        item.amount,
        "EXPENSE",
        item.category,
        paidByBank,
        !(addToInventory || item.addToInventory),
        invReq
      );
    });

    setScannedItems(null);
    setTimeout(onClose, 300);
  };

  const handleRejectScannedItem = (id: string) => {
    setScannedItems((prev) => {
      const remaining = prev ? prev.filter((i) => i.id !== id) : null;
      if (remaining && remaining.length === 0) {
        setTimeout(onClose, 300);
        return null;
      }
      return remaining;
    });
  };

  const filteredItems = useMemo(() => {
    if (showFrequent) {
      return predefinedItems.filter((item) => item.frequent);
    }
    return predefinedItems.filter((item) => item.category === selectedCategory);
  }, [showFrequent, selectedCategory, predefinedItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount || selectedMultiItems.length > 0 || isShoppingMode) {
      if (selectedMultiItems.length >= 2) {
        selectedMultiItems.forEach((mItem) => {
          let invReq = undefined;
          if (type === "EXPENSE" && (addToInventory || isShoppingMode)) {
            const cat =
              CATEGORIES.find((c) => c.id === mItem.category) || CATEGORIES[4];
            const matchedItem = predefinedItems.find(
              (p) => p.name.toLowerCase() === mItem.name.toLowerCase()
            );

            let iconName = "Box";
            let iconSvg: string | undefined = undefined;
            if (matchedItem) {
              iconName = matchedItem.iconName || "Box";
              iconSvg = matchedItem.iconSvg;
            } else {
              if (cat.id === "Nourriture") iconName = "Utensils";
              else if (cat.id === "Shopping") iconName = "ShoppingBag";
              else if (cat.id === "Transport") iconName = "Car";
              else if (cat.id === "Loisirs") iconName = "Gamepad2";
              else if (cat.id === "Autres") iconName = "MoreHorizontal";
            }

            invReq = {
              quantity: parseInt(inventoryQty) || 1,
              color: cat.color,
              bg: cat.bgColor,
              iconName,
              iconSvg,
            };
          }

          onAdd(
            mItem.name,
            mItem.price,
            type,
            type === "EXPENSE" ? mItem.category : undefined,
            paidByBank,
            false,
            invReq
          );
        });
      } else if (amount) {
        const finalLabel =
          type === "INCOME" ? "Retrait Banque" : label.trim() || "Achat";
        const finalAmount = parseFloat(amount);
        if (finalAmount > 0) {
          let invReq = undefined;
          if (type === "EXPENSE" && (addToInventory || isShoppingMode)) {
            const cat =
              CATEGORIES.find((c) => c.id === selectedCategory) ||
              CATEGORIES[4];
            const matchedItem = predefinedItems.find(
              (p) => p.name.toLowerCase() === finalLabel.toLowerCase()
            );

            let iconName = "Box";
            let iconSvg: string | undefined = undefined;
            if (matchedItem) {
              iconName = matchedItem.iconName || "Box";
              iconSvg = matchedItem.iconSvg;
            } else {
              if (cat.id === "Nourriture") iconName = "Utensils";
              else if (cat.id === "Shopping") iconName = "ShoppingBag";
              else if (cat.id === "Transport") iconName = "Car";
              else if (cat.id === "Loisirs") iconName = "Gamepad2";
              else if (cat.id === "Autres") iconName = "MoreHorizontal";
            }

            invReq = {
              quantity: parseInt(inventoryQty) || 1,
              color: cat.color,
              bg: cat.bgColor,
              iconName,
              iconSvg,
            };
          }

          onAdd(
            finalLabel,
            finalAmount,
            type,
            type === "EXPENSE" ? selectedCategory : undefined,
            paidByBank,
            false,
            invReq
          );
        }
      } else if (isShoppingMode) {
        // Fallback for shopping mode if no amount and no selected items
        const finalLabel = label.trim() || "Achat";
        onAdd(
          finalLabel,
          0,
          type,
          type === "EXPENSE" ? selectedCategory : undefined,
          paidByBank,
          false,
          undefined
        );
      }

      onClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] max-w-md mx-auto"
            />
            <motion.div
              key="modal-content"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[120] bg-white rounded-t-[40px] p-8 max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight whitespace-nowrap">
                    {isShoppingMode
                      ? "Programmer Achat"
                      : scannedItems !== null
                      ? "Articles Scannés"
                      : type === "INCOME"
                      ? "Retrait Banque"
                      : "Nouvel Achat"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors ml-auto"
                  >
                    <X size={20} />
                  </button>
                </div>

                {type === "EXPENSE" &&
                  scannedItems === null &&
                  !isShoppingMode && (
                    <div className="flex items-center gap-2">
                      <div className="flex bg-slate-100 rounded-full p-1 h-10 items-center overflow-hidden shrink-0">
                        <button
                          onClick={() => {
                            setAiProvider("gemini");
                            localStorage.setItem("ai_provider", "gemini");
                          }}
                          className={`h-full px-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all ${
                            aiProvider === "gemini"
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          <Sparkles size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setAiProvider("openrouter");
                            localStorage.setItem("ai_provider", "openrouter");
                          }}
                          className={`h-full px-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all ${
                            aiProvider === "openrouter"
                              ? "bg-white text-blue-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          <Cpu size={14} />
                        </button>
                      </div>

                      <button
                        onClick={startListening}
                        disabled={isScanning}
                        className={`shrink-0 h-10 w-10 ${
                          isListening
                            ? "bg-red-50 text-red-600 animate-pulse"
                            : "bg-slate-100 text-slate-500"
                        } rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors`}
                      >
                        {isListening ? (
                          <Mic size={16} className="animate-pulse" />
                        ) : (
                          <Mic size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => setShowImageSourceModal(true)}
                        disabled={isScanning || isListening}
                        className="shrink-0 h-10 w-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center hover:bg-teal-100 transition-colors"
                      >
                        {isScanning ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <ScanText size={16} />
                        )}
                      </button>
                    </div>
                  )}
              </div>

              {scannedItems !== null ? (
                <div className="space-y-4">
                  {scannedItems.length === 0 ? (
                    <div className="text-center py-10 opacity-60">
                      <p className="text-slate-600 font-bold mb-4">
                        Aucun article détecté.
                      </p>
                      <button
                        onClick={() => setScannedItems(null)}
                        className="h-12 px-6 bg-slate-200 rounded-full font-black text-slate-700"
                      >
                        Retour
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {detectedPaymentGroup &&
                        !["UNKNOWN", "INCONNU"].includes(
                          detectedPaymentGroup.toUpperCase()
                        ) && (
                          <div className="flex justify-center -mb-2 z-20 relative">
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200 shadow-sm">
                              Paiement Détecté:{" "}
                              {["CARD", "BANK"].includes(
                                detectedPaymentGroup.toUpperCase()
                              )
                                ? "Carte Bancaire"
                                : "Espèces"}
                            </span>
                          </div>
                        )}

                      <div
                        className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl cursor-pointer mb-2"
                        onClick={() => setPaidByBank(!paidByBank)}
                      >
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                            paidByBank
                              ? "bg-teal-500 text-white"
                              : "bg-slate-200 text-transparent"
                          }`}
                        >
                          <Check size={16} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 tracking-tight">
                            Payer par solde bancaire
                          </span>
                          <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                            S'applique à tous les articles valides
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        {scannedItems.map((item, index) => {
                          const info = getArticleInfo(
                            item.title || "",
                            item.category,
                            predefinedItems
                          );
                          const IconComp = info.iconName
                            ? ICON_MAP[info.iconName]
                            : ICON_MAP["MoreHorizontal"];

                          const cat =
                            CATEGORIES.find((c) => c.id === item.category) ||
                            CATEGORIES[7];
                          const cardBg = cat.lightBg || "bg-slate-50/60";

                          return (
                            <div
                              key={`${item.id}-${index}`}
                              className={`flex items-center p-3 rounded-[32px] ${cardBg} border border-white/60 backdrop-blur-sm relative overflow-hidden group shadow-sm transition-all hover:bg-white`}
                            >
                              <ShoppingCart className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-900/5 rotate-12 pointer-events-none" />

                              <div
                                className={`shrink-0 w-[52px] h-[52px] rounded-[20px] flex items-center justify-center shadow-sm z-10 bg-opacity-70 ${info.bgColor} ${info.color}`}
                              >
                                {info.iconSvg ? (
                                  <div dangerouslySetInnerHTML={{ __html: info.iconSvg }} className="w-[22px] h-[22px] text-current flex items-center justify-center svg-container" />
                                ) : (
                                  IconComp && <IconComp size={22} />
                                )}
                              </div>

                              <div className="flex-1 min-w-0 ml-4 z-10 flex flex-col justify-center">
                                <input
                                  value={item.title}
                                  onChange={(e) =>
                                    handleScanItemChange(
                                      item.id,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="font-black text-slate-800 text-[15px] capitalize bg-white/40 focus:bg-white outline-none w-full placeholder:text-slate-400 px-2 py-0.5 rounded-lg border border-transparent focus:border-slate-200 transition-all"
                                  placeholder="Nom article"
                                />

                                <div className="flex flex-col gap-1.5 mt-1">
                                  <div className="flex items-center justify-between ml-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setEditingCategoryItemId(item.id)
                                      }
                                      className={`text-[9px] font-bold uppercase tracking-widest bg-white/60 hover:bg-white px-2 py-0.5 rounded shadow-sm cursor-pointer w-fit transition-colors truncate border border-slate-100 ${cat.color}`}
                                    >
                                      {cat.label} ▾
                                    </button>
                                  </div>
                                  <label className="flex items-center gap-2 cursor-pointer ml-1 mt-1">
                                    <input
                                      type="checkbox"
                                      checked={!!item.addToInventory}
                                      onChange={(e) =>
                                        handleScanItemChange(
                                          item.id,
                                          "addToInventory",
                                          e.target.checked
                                        )
                                      }
                                      className="w-4 h-4 bg-white border-2 border-slate-300 text-violet-500 focus:ring-violet-500/20 rounded cursor-pointer accent-violet-500"
                                    />
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                      Ajouter au stock
                                    </span>
                                  </label>
                                </div>
                              </div>

                              <div className="shrink-0 flex flex-col items-center ml-2 z-10">
                                <div className="flex items-center justify-end w-24 bg-white/40 focus-within:bg-white rounded-lg px-2 py-0.5 border border-transparent focus-within:border-slate-200 transition-all">
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={item.amount || ""}
                                    onChange={(e) =>
                                      handleScanItemChange(
                                        item.id,
                                        "amount",
                                        parseFloat(e.target.value)
                                      )
                                    }
                                    className="font-black text-slate-800 text-[15px] bg-transparent outline-none w-full text-right p-0 m-0"
                                  />
                                  <span className="font-black text-slate-800 text-[15px] ml-1">
                                    {currency}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    handleRejectScannedItem(item.id)
                                  }
                                  className="w-8 h-8 rounded-full bg-slate-200/50 hover:bg-slate-300 flex items-center justify-center mt-2 text-slate-500 transition-colors shadow-sm"
                                >
                                  <X size={14} strokeWidth={3} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={handleConfirmAllScannedItems}
                        className="w-full mt-4 bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-2xl text-sm transition-all shadow-lg active:scale-[0.98]"
                      >
                        Valider {scannedItems.length} article
                        {scannedItems.length > 1 ? "s" : ""} •{" "}
                        {scannedItems
                          .reduce((acc, item) => acc + (item.amount || 0), 0)
                          .toFixed(2)}{" "}
                        {currency}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-5">
                    {type === "EXPENSE" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">
                            Catégorie
                          </label>
                          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`flex flex-col items-center gap-1.5 p-2 px-1 rounded-2xl border transition-all ${
                                  selectedCategory === cat.id && !showFrequent
                                    ? `bg-white shadow-md scale-105 border-transparent ring-2 ${
                                        cat.id === "Nourriture"
                                          ? "ring-teal-500/20"
                                          : cat.id === "Shopping"
                                          ? "ring-rose-500/20"
                                          : cat.id === "Transport"
                                          ? "ring-sky-500/20"
                                          : cat.id === "Loisirs"
                                          ? "ring-purple-500/20"
                                          : "ring-slate-400/20"
                                      }`
                                    : "border-slate-100 bg-slate-50 opacity-60"
                                }`}
                              >
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                    cat.bgColor
                                  } ${cat.color} ${
                                    selectedCategory === cat.id && !showFrequent
                                      ? "scale-110"
                                      : ""
                                  } transition-transform`}
                                >
                                  {(() => {
                                    const CatIcon =
                                      ICON_MAP[cat.iconName] ||
                                      ICON_MAP["MoreHorizontal"];
                                    return <CatIcon size={18} />;
                                  })()}
                                </div>
                                <span
                                  className={`text-[8px] font-black uppercase tracking-tight text-center truncate w-full ${
                                    selectedCategory === cat.id && !showFrequent
                                      ? cat.id === "Nourriture"
                                        ? "text-teal-600"
                                        : cat.id === "Shopping"
                                        ? "text-rose-600"
                                        : cat.id === "Transport"
                                        ? "text-sky-600"
                                        : cat.id === "Loisirs"
                                        ? "text-purple-600"
                                        : "text-slate-800"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {cat.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Predefined Items Quick Select */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                              {showFrequent
                                ? "Achats Fréquents"
                                : `Articles: ${selectedCategory}`}
                            </label>
                            {!showFrequent && (
                              <button
                                type="button"
                                onClick={() => setShowFrequent(true)}
                                className="text-[9px] font-black text-teal-600 uppercase tracking-widest hover:underline"
                              >
                                Voir Fréquents
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 w-full">
                            <AnimatePresence mode="popLayout">
                              {filteredItems.map((item, index) => {
                                const info = getArticleInfo(
                                  item.name,
                                  item.category,
                                  predefinedItems
                                );
                                const IconComponent = (ICON_MAP[
                                  info.iconName
                                ] || ICON_MAP["Box"]) as React.ElementType;
                                return (
                                  <motion.button
                                    key={`${item.id}-${index}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    type="button"
                                    onClick={() =>
                                      handleItemSelect(
                                        item.name,
                                        item.price,
                                        item.category
                                      )
                                    }
                                    className={`flex items-center gap-2 pr-3 pl-1 py-1 rounded-full border border-slate-100 shadow-sm transition-all active:scale-95 bg-white hover:border-teal-500/30 ${
                                      selectedMultiItems.some(
                                        (m) => m.name === item.name
                                      )
                                        ? "ring-2 ring-teal-500/20 border-teal-500/50 bg-teal-50"
                                        : ""
                                    }`}
                                  >
                                    <div
                                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${info.bgColor} ${info.color}`}
                                    >
                                      {info.iconSvg ? (
                                        <div dangerouslySetInnerHTML={{ __html: info.iconSvg }} className="w-3.5 h-3.5 flex items-center justify-center text-current svg-container" />
                                      ) : (
                                        <IconComponent size={14} />
                                      )}
                                    </div>
                                    <div className="flex flex-col items-start justify-center overflow-hidden">
                                      <span className="text-[10px] font-black text-slate-700 leading-tight truncate w-full flex-1 text-left">
                                        {item.name}
                                      </span>
                                      <span className="text-[9px] font-bold text-slate-400 leading-none">
                                        {item.price} {currency}
                                      </span>
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </AnimatePresence>
                            {filteredItems.length === 0 && (
                              <p className="text-[10px] text-slate-400 italic px-1 py-1">
                                Mode manuel activé pour cette catégorie
                              </p>
                            )}
                          </div>
                        </div>

                        {selectedMultiItems.length < 2 && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">
                              Libellé (Optionnel)
                            </label>
                            <input
                              type="text"
                              placeholder="Qu'avez-vous acheté ?"
                              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all font-mono"
                              value={label}
                              onChange={(e) => setLabel(e.target.value)}
                            />
                          </div>
                        )}
                      </>
                    )}

                    {selectedMultiItems.length >= 2 && (
                      <div className="space-y-1.5 mt-2">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">
                          Facture
                        </label>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 font-mono">
                          {selectedMultiItems.map((item, idx) => {
                            const catColor =
                              CATEGORIES.find((c) => c.id === item.category)
                                ?.color || "text-slate-800";
                            return (
                              <div
                                key={idx}
                                className="flex justify-between items-center py-1.5 border-b border-slate-200/50 last:border-0"
                              >
                                <span
                                  className={`font-bold text-sm ${catColor}`}
                                >
                                  {item.name}
                                </span>
                                <span className={`font-black ${catColor}`}>
                                  {item.price.toFixed(2)} {currency}
                                </span>
                              </div>
                            );
                          })}
                          <div className="flex justify-between items-center pt-3 mt-1 border-t-2 border-slate-200">
                            <span className="font-black text-slate-800 uppercase text-xs">
                              Total
                            </span>
                            <span className="font-black text-slate-800 text-lg">
                              {selectedMultiItems
                                .reduce((acc, curr) => acc + curr.price, 0)
                                .toFixed(2)}{" "}
                              {currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {!isShoppingMode && selectedMultiItems.length < 2 && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">
                          Montant ({currency})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          required={selectedMultiItems.length === 0}
                          autoFocus={type === "INCOME"}
                          placeholder="0.0"
                          className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-5 font-black text-slate-800 text-3xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-center font-mono"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    )}

                    {type === "EXPENSE" && !isShoppingMode && (
                      <>
                        <div
                          className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl cursor-pointer"
                          onClick={() => setPaidByBank(!paidByBank)}
                        >
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                              paidByBank
                                ? "bg-teal-500 text-white"
                                : "bg-slate-200 text-transparent"
                            }`}
                          >
                            <Check size={16} strokeWidth={3} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800 tracking-tight">
                              Payé par solde bancaire
                            </span>
                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                              Ne pas déduire de la poche
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div
                            className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl cursor-pointer"
                            onClick={() => setAddToInventory(!addToInventory)}
                          >
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                                addToInventory
                                  ? "bg-violet-500 text-white"
                                  : "bg-slate-200 text-transparent"
                              }`}
                            >
                              <Check size={16} strokeWidth={3} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-800 tracking-tight">
                                Ajouter au stockage
                              </span>
                              <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                                Enregistrer dans l'inventaire
                              </span>
                            </div>
                          </div>

                          <AnimatePresence>
                            {addToInventory && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  height: 0,
                                  marginTop: -12,
                                }}
                                animate={{
                                  opacity: 1,
                                  height: "auto",
                                  marginTop: 0,
                                }}
                                exit={{ opacity: 0, height: 0, marginTop: -12 }}
                                className="space-y-1.5 overflow-hidden"
                              >
                                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">
                                  Quantité (Articles)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  placeholder="1"
                                  className="w-full h-14 bg-violet-50/50 border border-violet-100 rounded-2xl px-5 font-black text-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-mono"
                                  value={inventoryQty}
                                  onChange={(e) =>
                                    setInventoryQty(e.target.value)
                                  }
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`w-full h-16 rounded-3xl flex items-center justify-center gap-3 font-black text-white text-lg shadow-lg transform transition-all active:scale-[0.98] ${
                      type === "EXPENSE"
                        ? "bg-slate-800 shadow-slate-800/20"
                        : "bg-teal-brand shadow-teal-brand/20"
                    }`}
                  >
                    <Check size={24} strokeWidth={3} />
                    <span>
                      Confirmer{" "}
                      {selectedMultiItems.length >= 2 ||
                      (amount && parseFloat(amount) > 0) ? (
                        <span className="opacity-90 tracking-wide font-mono ml-1">
                          (
                          {(selectedMultiItems.length >= 2
                            ? selectedMultiItems.reduce(
                                (acc, curr) => acc + curr.price,
                                0
                              )
                            : parseFloat(amount) || 0
                          ).toFixed(2)}{" "}
                          {currency})
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        capture="environment"
        onChange={handleFallbackImageSelection}
      />
      <input
        type="file"
        ref={galleryInputRef}
        hidden
        accept="image/*"
        onChange={handleFallbackImageSelection}
      />
      <input
        type="file"
        ref={audioInputRef}
        hidden
        accept="audio/*"
        capture
        onChange={handleVoiceFileSelection}
      />

      <AnimatePresence>
        {editingCategoryItemId && (
          <div
            className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
            onClick={() => setEditingCategoryItemId(null)}
          >
            <motion.div
              key="category-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] p-6 w-full max-w-xs shadow-2xl relative"
            >
              <h3 className="font-black text-slate-800 text-lg mb-4 text-center">
                Choisir une catégorie
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      handleScanItemChange(
                        editingCategoryItemId,
                        "category",
                        cat.id
                      );
                      setEditingCategoryItemId(null);
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all hover:scale-[1.03] active:scale-95 ${cat.bgColor} border-transparent shadow-sm`}
                  >
                    <div className={`${cat.color}`}>
                      {(() => {
                        const CatIcon =
                          ICON_MAP[cat.iconName] || ICON_MAP["MoreHorizontal"];
                        return <CatIcon size={24} />;
                      })()}
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-tight text-center ${cat.color}`}
                    >
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setEditingCategoryItemId(null)}
                className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors"
              >
                Annuler
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImageSourceModal && (
          <div
            className="fixed inset-0 z-[140] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4"
            onClick={() => setShowImageSourceModal(false)}
          >
            <motion.div
              key="image-source-modal"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800 text-lg">
                  Scanner un article
                </h3>
                <button
                  type="button"
                  onClick={() => setShowImageSourceModal(false)}
                  className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleScanReceipt(CameraSource.Camera)}
                  className="flex-1 flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl p-6 transition-colors font-bold text-sm"
                >
                  <CameraLucideIcon size={32} className="mb-3" />
                  Prendre une photo
                </button>
                <button
                  onClick={() => handleScanReceipt(CameraSource.Photos)}
                  className="flex-1 flex flex-col items-center justify-center bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-2xl p-6 transition-colors font-bold text-sm"
                >
                  <ImageIcon size={32} className="mb-3" />
                  Choisir depuis la galerie
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

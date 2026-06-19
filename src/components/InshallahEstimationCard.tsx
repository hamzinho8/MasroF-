import React, { useState, useMemo } from "react";
import { Loader2, RefreshCw, Sparkles, Info } from "lucide-react";
import { Transaction } from "../types";
import { generateAIContent } from "../utils/ai";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";

interface InshallahEstimationCardProps {
  transactions: Transaction[];
  currency: string;
  language: string;
  balance: number;
  bankBalance: number;
}

export default function InshallahEstimationCard({
  transactions,
  currency,
  language,
  balance,
  bankBalance,
}: InshallahEstimationCardProps) {
  const [dailyEstimate, setDailyEstimate] = useLocalStorage<number | null>("inshallah_daily", null);
  const [remainingEstimate, setRemainingEstimate] = useLocalStorage<number | null>("inshallah_remaining", null);
  const [sevenDayTrend, setSevenDayTrend] = useLocalStorage<number[] | null>("inshallah_trend", null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to get number of days in the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const today = now.getDate();
      const totalDays = getDaysInMonth(currentYear, currentMonth);
      const daysRemaining = Math.max(totalDays - today + 1, 1);

      // Filter expenses for current month
      const currentMonthExpenses = transactions.filter((tx) => {
        const txDate = new Date(tx.date);
        return (
          tx.type === "EXPENSE" &&
          txDate.getMonth() === currentMonth &&
          txDate.getFullYear() === currentYear
        );
      });

      const totalSpent = currentMonthExpenses.reduce(
        (sum, tx) => sum + tx.amount,
        0
      );

      const geminiKey = localStorage.getItem("gemini_api_key");

      const promptText = `On est le ${today}/${currentMonth + 1}/${currentYear}.
Il reste ${daysRemaining} jours dans ce mois.
Dépense totale ce mois-ci : ${totalSpent} ${currency}.
Basé sur ce comportement, estime ma dépense journalière et le total que je vais dépenser pendant les jours qui restent de ce mois.
Fournis également une prévision ("trend") de mes dépenses réelles pour les 7 prochains jours (en variant légèrement chaque jour pour être réaliste, ex: plus le week-end).
Ne retourne QUE un format JSON exact comme celui-ci, aucun autre texte ni balise Markdown :
{"dailyEstimate": 150, "remainingEstimate": 4500, "trend": [150, 160, 140, 130, 180, 200, 150]}`;

      const response = await generateAIContent(
        "gemini",
        geminiKey,
        "",
        [{ text: promptText }],
        500,
        true
      );

      // clean json
      const cleanedReturn = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanedReturn);
      if (
        typeof parsed.dailyEstimate === "number" &&
        typeof parsed.remainingEstimate === "number"
      ) {
        setDailyEstimate(parsed.dailyEstimate);
        setRemainingEstimate(parsed.remainingEstimate);
        if (Array.isArray(parsed.trend)) {
          setSevenDayTrend(parsed.trend);
        } else {
          // fallback if AI didn't provide array
          setSevenDayTrend([parsed.dailyEstimate, parsed.dailyEstimate, parsed.dailyEstimate, parsed.dailyEstimate, parsed.dailyEstimate, parsed.dailyEstimate, parsed.dailyEstimate]);
        }
      } else {
        throw new Error("Format de réponse invalide");
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const chartData = useMemo(() => {
    if (!sevenDayTrend || sevenDayTrend.length === 0) return [];
    
    return sevenDayTrend.map((value, index) => {
      const d = new Date();
      d.setDate(d.getDate() + index);
      const dayLabel = d.toLocaleDateString(language === "Français" ? "fr-FR" : "en-US", { weekday: "short" });
      return {
        name: dayLabel,
        value: Math.round(value)
      };
    }).slice(0, 7);
  }, [sevenDayTrend, language]);

  return (
    <div className="mt-8 mb-2 overflow-visible -mx-1 px-1">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        .inshallah-title {
          font-family: 'Aref Ruqaa', 'Amiri', serif;
          line-height: normal;
        }
        
        /* Recharts tooltip adjustments */
        .recharts-tooltip-wrapper {
          z-index: 50 !important;
        }
      `}</style>
      
      <div className="relative flex justify-center items-center mb-5 px-1 py-4">
        <h3 className="inshallah-title font-bold text-center absolute -mt-2 flex flex-col items-center select-none" dir="rtl">
          <span className="text-[#0b143a] drop-shadow-sm relative z-10" style={{ fontSize: "2.8rem", wordSpacing: "6px" }}>
            إِنْ شَاءَ اللَّهُ
          </span>
        </h3>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="ml-auto w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 relative z-10"
        >
          <RefreshCw size={16} className={isGenerating ? "animate-spin text-[#1B7C86]" : ""} />
        </button>
      </div>

      <div className="mx-1 mb-8 relative">
        <div 
          className="relative min-h-[10rem] h-auto rounded-[24px] shadow-lg transition-all hover:scale-[1.01] cursor-default z-10"
          style={{ background: "linear-gradient(135deg, #1B7C86 0%, #135A62 100%)" }}
        >
          {/* Background Decorators wrapped in overflow-hidden to respect border-radius */}
          <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[24px] pointer-events-none">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black/20 blur-xl" />
          </div>

          <div className="relative z-20 py-6 px-6 h-full w-full flex flex-col justify-center text-white">
            <div className={`grid grid-cols-2 gap-4 divide-x divide-white/20 ${chartData.length > 0 ? "mb-6" : ""}`}>
              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center gap-2 mb-2 group relative">
                  <div className="w-2 h-2 rounded-full bg-orange-300 animate-pulse" />
                  <h2 className="text-white/70 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1">
                    {language === "Français" ? "Journée" : "Daily"}
                    <Info size={10} className="text-white/50 cursor-help" />
                  </h2>
                  <div className="absolute left-0 -top-10 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-xl border border-slate-700">
                    {language === "Français" ? "Estimation basée sur vos dépenses récurrentes vs solde disponible dans la poche" : "Forecast based on your recurring expenses vs pocket balance"}
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <span className={`text-3xl font-black tracking-tighter ${dailyEstimate !== null ? (dailyEstimate > balance ? "text-rose-400" : "text-emerald-400") : "text-white"}`}>
                    {dailyEstimate !== null ? Math.round(dailyEstimate).toLocaleString("fr-FR") : "--"}
                  </span>
                  <span className="text-sm font-bold text-white/70 mb-1 ml-1">{currency}</span>
                </div>
              </div>

              <div className="flex flex-col items-start justify-center pl-4">
                <div className="flex items-center gap-2 mb-2 group relative">
                  <div className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
                  <h2 className="text-white/70 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1">
                    {language === "Français" ? "Reste mois" : "Rest of month"}
                    <Info size={10} className="text-white/50 cursor-help" />
                  </h2>
                  <div className="absolute left-0 -top-10 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none shadow-xl border border-slate-700">
                    {language === "Français" ? "Estimation de la dépense globale d'ici la fin du mois vs solde bancaire" : "Estimated holistic spend until month end vs bank balance"}
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <span className={`text-3xl font-black tracking-tighter ${remainingEstimate !== null ? (remainingEstimate > bankBalance ? "text-rose-400" : "text-emerald-400") : "text-white"}`}>
                    {remainingEstimate !== null ? Math.round(remainingEstimate).toLocaleString("fr-FR") : "--"}
                  </span>
                  <span className="text-sm font-bold text-white/70 mb-1 ml-1">{currency}</span>
                </div>
              </div>
            </div>

            {chartData.length > 0 && dailyEstimate !== null && !isGenerating && (
              <div className="w-full h-24 mt-2 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="rgba(255,255,255,0.7)" 
                      strokeWidth={2} 
                      activeDot={{ r: 6, fill: '#fff', stroke: '#1B7C86', strokeWidth: 2 }}
                      dot={(props: any) => {
                        const { cx, cy, payload, value } = props;
                        return (
                          <circle 
                            key={`dot-${payload.name}`}
                            cx={cx} 
                            cy={cy} 
                            r={4} 
                            fill="#1B7C86" 
                            stroke="#fff" 
                            strokeWidth={1.5}
                            className="transition-transform hover:scale-150 cursor-pointer"
                          >
                            <title>{`${payload.name}: ${value} ${currency}`}</title>
                          </circle>
                        );
                      }}
                    />
                    <Tooltip 
                      contentStyle={{ background: '#0a363b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                      itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.7)', marginBottom: '4px', textTransform: 'capitalize' }}
                      cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                      formatter={(value: any) => [`${value} ${currency}`, language === "Français" ? "Prévu" : "Expected"]}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* Very simple hint underneath if we never generated */}
            {dailyEstimate === null && !isGenerating && (
              <div className="w-full text-center mt-6">
                <span className="text-white/70 font-medium text-xs flex items-center justify-center gap-1">
                  <Sparkles size={12} />
                  Cliquez sur actualiser
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
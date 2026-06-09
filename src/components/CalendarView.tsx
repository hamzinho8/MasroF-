import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Transaction } from '../types';

interface CalendarViewProps {
  transactions: Transaction[];
  currency: string;
}

export default function CalendarView({ transactions, currency }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  // Adjust starting day to make Monday = 0, Sunday = 6
  const normalizedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const dailyTotals = useMemo(() => {
    const totals: Record<number, { expense: number, income: number }> = {};
    for (let i = 1; i <= daysInMonth; i++) {
        totals[i] = { expense: 0, income: 0 };
    }

    transactions.forEach(tx => {
      const txDate = new Date(tx.timestamp);
      if (txDate.getFullYear() === year && txDate.getMonth() === month) {
        const day = txDate.getDate();
        const isCredit = (tx.category && ["on me doit","je dois","مستحقات لي","ديون علي","owed to me","i owe","loans","debts","crédit +","crédit --"].includes(tx.category.toLowerCase()));
        
        if (!isCredit) {
            if (tx.type === "EXPENSE") {
                totals[day].expense += tx.amount;
            } else if (tx.type === "INCOME") {
                totals[day].income += tx.amount;
            }
        }
      }
    });

    return totals;
  }, [transactions, year, month, daysInMonth]);

  const renderDays = () => {
    const days = [];
    
    // Empty slots before the first day
    for (let i = 0; i < normalizedStartDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 opacity-0"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const { expense, income } = dailyTotals[d] || { expense: 0, income: 0 };
      const isToday = 
        new Date().getDate() === d && 
        new Date().getMonth() === month && 
        new Date().getFullYear() === year;

      days.push(
        <div 
          key={d} 
          className={`relative p-1 border border-slate-100 rounded-xl min-h-[60px] flex flex-col justify-between transition-colors hover:bg-slate-50 ${isToday ? 'bg-teal-50/50 border-teal-200' : 'bg-white'}`}
        >
          <span className={`text-[10px] font-bold ${isToday ? 'text-teal-600' : 'text-slate-400'}`}>
            {d}
          </span>
          <div className="flex flex-col gap-0.5 mt-auto pb-1">
             {income > 0 && <span className="text-[8px] font-black leading-none text-bank-blue/80 truncate">+{Math.round(income)}</span>}
             {expense > 0 && <span className="text-[8px] font-black leading-none text-danger-red/80 truncate">-{Math.round(expense)}</span>}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="mb-8">
       <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black tracking-tight text-slate-800 capitalize flex items-center gap-2">
                 {monthNames[month]} {year}
              </h3>
              <div className="flex items-center gap-2">
                 <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100">
                     <ChevronLeft size={16} />
                 </button>
                 <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100">
                     <ChevronRight size={16} />
                 </button>
              </div>
           </div>
           
           <div className="grid grid-cols-7 gap-1 mb-2">
             {dayNames.map(day => (
                 <div key={day} className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">
                     {day}
                 </div>
             ))}
           </div>
           
           <div className="grid grid-cols-7 gap-1">
              {renderDays()}
           </div>
       </div>
    </div>
  );
}

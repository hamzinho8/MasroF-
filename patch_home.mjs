import fs from 'fs';

let content = fs.readFileSync('src/components/Home.tsx', 'utf-8');

// The `extraUI` we want to add
const extraUI = `
                {totalWithdrawal > 0 && (
                  <div className="mt-4 flex items-center justify-between w-full bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Banknote size={18} strokeWidth={2.5} />
                      <span className="text-xs font-black uppercase tracking-wider">Retrait à prévoir</span>
                    </div>
                    <div className="text-sm font-black text-emerald-700">
                      {totalWithdrawal} {currency}
                    </div>
                  </div>
                )}
`;

// Insert after the first "bankBalance" div
const targetStr = `                  </div>
                </div>
              </div>
            )}`;

// Wait, that string exists twice because there's a "bank" view and a "cash" view that shows bank balance too?
// Let's replace the first instance
const idx1 = content.indexOf(targetStr);
if (idx1 !== -1) {
  const before = content.substring(0, idx1);
  const after = content.substring(idx1);
  content = before + extraUI + after;
}

// And also replace the second instance if it's there
const targetStr2 = `                    </div>
                  </div>
                </div>
                {/* Cash Balance Display */}`;

const idx2 = content.indexOf(targetStr2);
if (idx2 !== -1) {
  const before2 = content.substring(0, idx2);
  const after2 = content.substring(idx2);
  content = before2 + extraUI + after2;
}

// Add totalWithdrawal calculation
const calcCode = `
  const selectedForWithdrawal = shoppingList.filter(item => item.isSelectedForWithdrawal);
  const totalWithdrawal = selectedForWithdrawal.reduce((sum, item) => sum + (item.expectedPrice || 0), 0);
`;
const returnIdx = content.indexOf('  return (');
if (returnIdx !== -1 && !content.includes('const totalWithdrawal =')) {
  const before = content.substring(0, returnIdx);
  const after = content.substring(returnIdx);
  content = before + calcCode + '\n' + after;
}

// Ensure Banknote is imported
if (!content.includes('Banknote')) {
  content = content.replace("import { Eye, EyeOff, Plus, ChevronRight, TrendingUp, TrendingDown, Clock, Search, Send, FileText, CheckCircle2 } from 'lucide-react';", "import { Eye, EyeOff, Plus, ChevronRight, TrendingUp, TrendingDown, Clock, Search, Send, FileText, CheckCircle2, Banknote } from 'lucide-react';");
}


fs.writeFileSync('src/components/Home.tsx', content);


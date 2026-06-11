export interface PredefinedItem {
  id: string;
  name: string;
  price: number;
  category: string;
  iconName: string;
  frequent: boolean;
  colorHex?: string;
  categoryColorHex?: string;
}

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category?: string;
  date: string;
  timestamp: number;
  paidByBank?: boolean;
  isPureInflow?: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  date?: string;
  frequency?: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  enabled: boolean;
  type: 'ACHAT' | 'RETRAIT' | 'AUTRE';
}

export interface CreditEntry {
  id: string;
  name: string;
  amount: number;
  type: 'OWE_ME' | 'I_OWE';
  date: string;
  source?: 'poche' | 'compte' | 'rien';
  settled?: boolean;
  settledDate?: string;
}

export interface InventoryDecreaseAction {
  id: string;
  timestamp: number;
  dateStr: string; // e.g. "2023-10-25 14:30"
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  addedAt: number;
  history: InventoryDecreaseAction[];
  iconName?: string;
  color?: string;
  bg?: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  expectedPrice?: number;
  category: string;
  iconName?: string;
  addedAt: number;
}

export interface CategoryBudget {
  category: string;
  limit: number;
}

export interface AlertConfig {
  bankLimit: number | null;
  cashLimit: number | null;
  inventoryLimit: number | null;
  categoryBudgetPercent: number | null;
  backupReminderEnabled: boolean;
}

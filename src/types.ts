export interface PredefinedItem {
  id: string;
  name: string;
  price: number;
  category: string;
  iconName: string;
  frequent: boolean;
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
}

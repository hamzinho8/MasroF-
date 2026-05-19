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

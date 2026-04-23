export type Category =
  | 'university'
  | 'personal'
  | 'travel'
  | 'food'
  | 'loan'
  | 'borrowed'
  | 'salary'
  | 'other';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  currency: string;
  level: number;
  xp: number;
  streak: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  category: Category;
  description: string;
  date: string;
  receipt_url?: string;
  is_recurring: boolean;
  tags: string[];
}

export interface Budget {
  id: string;
  user_id: string;
  category: Category;
  limit_amount: number;
  spent_amount: number;
  period: 'monthly' | 'weekly';
  currency: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  currency: string;
  deadline?: string;
  tree_stage: 0 | 1 | 2 | 3 | 4 | 5;
}

export interface Debt {
  id: string;
  user_id: string;
  counterparty_name: string;
  amount: number;
  currency: string;
  type: 'owed_to_me' | 'i_owe';
  description?: string;
  is_settled: boolean;
  due_date?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
}

export interface Split {
  member_id: string;
  amount: number;
  is_settled: boolean;
}

export interface GroupExpense {
  id: string;
  title: string;
  total_amount: number;
  currency: string;
  members: GroupMember[];
  splits: Split[];
  created_by: string;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked_at?: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  message: string;
  type: 'tip' | 'warning' | 'encouragement' | 'achievement';
  created_at: string;
}

export interface FinancialHealthScore {
  score: number;
  breakdown: {
    savings: number;
    debt: number;
    consistency: number;
  };
}

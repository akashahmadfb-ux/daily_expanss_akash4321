import type { Category } from './types';

export const CATEGORIES: { id: Category; label: string; icon: string; color: string }[] = [
  { id: 'university', label: 'University', icon: '🎓', color: '#C5A065' },
  { id: 'personal', label: 'Personal', icon: '🌿', color: '#C9ADA7' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: '#1A1A2E' },
  { id: 'food', label: 'Food', icon: '🍵', color: '#C5A065' },
  { id: 'loan', label: 'Loan', icon: '📜', color: '#C9ADA7' },
  { id: 'borrowed', label: 'Borrowed', icon: '🤝', color: '#F2E9E4' },
  { id: 'salary', label: 'Salary', icon: '💰', color: '#C5A065' },
  { id: 'other', label: 'Other', icon: '🌙', color: '#0B0C10' },
];

export const CURRENCIES: { code: string; symbol: string; name: string }[] = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export const HEALING_MESSAGES: string[] = [
  "It's okay to break the budget sometimes. Tomorrow is a fresh page.",
  'Every small step toward saving is an act of self-love. You are doing enough.',
  "Money is a tool, not a measure of your worth. You're more than your balance.",
  'Even a single taka saved is a seed planted. Growth takes time — be patient with yourself.',
  "Today was hard financially. That's okay. Rest, breathe, and begin again.",
];

export const BADGE_DEFINITIONS: {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpRequired: number;
}[] = [
  {
    id: 'first_transaction',
    name: 'First Step',
    description: 'Logged your very first transaction',
    icon: '🌱',
    xpRequired: 0,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7-day logging streak',
    icon: '🔥',
    xpRequired: 70,
  },
  {
    id: 'streak_30',
    name: 'Consistent Soul',
    description: '30-day logging streak',
    icon: '🌟',
    xpRequired: 300,
  },
  {
    id: 'savings_goal_1',
    name: 'Dream Planter',
    description: 'Created your first savings goal',
    icon: '🌳',
    xpRequired: 50,
  },
  {
    id: 'savings_complete_1',
    name: 'Goal Keeper',
    description: 'Completed your first savings goal',
    icon: '🏆',
    xpRequired: 200,
  },
  {
    id: 'budget_keeper',
    name: 'Budget Guardian',
    description: 'Stayed within budget for a full month',
    icon: '🛡️',
    xpRequired: 150,
  },
  {
    id: 'debt_free',
    name: 'Free Spirit',
    description: 'Cleared all your debts',
    icon: '🕊️',
    xpRequired: 500,
  },
  {
    id: 'insight_reader',
    name: 'Mindful Spender',
    description: 'Read 10 AI insights',
    icon: '🧠',
    xpRequired: 100,
  },
];

export const LEVEL_THRESHOLDS: { level: number; xp: number; title: string }[] = [
  { level: 1, xp: 0, title: 'Seedling' },
  { level: 2, xp: 100, title: 'Sprout' },
  { level: 3, xp: 250, title: 'Sapling' },
  { level: 4, xp: 500, title: 'Young Tree' },
  { level: 5, xp: 900, title: 'Blossoming Tree' },
  { level: 6, xp: 1400, title: 'Forest Guardian' },
  { level: 7, xp: 2000, title: 'Ancient Oak' },
  { level: 8, xp: 3000, title: 'Wise Elder' },
  { level: 9, xp: 4500, title: 'Enlightened Soul' },
  { level: 10, xp: 6500, title: 'Financial Mystic' },
];

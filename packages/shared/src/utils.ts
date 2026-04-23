import type { Transaction, Budget, SavingsGoal, Category, FinancialHealthScore } from './types';
import { CURRENCIES } from './constants';

export function formatCurrency(amount: number, currency: string): string {
  const currencyInfo = CURRENCIES.find((c) => c.code === currency);
  const symbol = currencyInfo?.symbol ?? currency;
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calculateBalance(transactions: Transaction[]): {
  income: number;
  expenses: number;
  balance: number;
} {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}

export function calculateHealthScore(
  transactions: Transaction[],
  budgets: Budget[],
  goals: SavingsGoal[]
): FinancialHealthScore {
  // Savings score: ratio of current savings to goals
  let savingsScore = 50;
  if (goals.length > 0) {
    const totalProgress = goals.reduce(
      (sum, g) => sum + Math.min(g.current_amount / g.target_amount, 1),
      0
    );
    savingsScore = Math.round((totalProgress / goals.length) * 100);
  }

  // Debt score: penalize over-budget spending
  let debtScore = 100;
  if (budgets.length > 0) {
    const overBudgetRatio =
      budgets.filter((b) => b.spent_amount > b.limit_amount).length / budgets.length;
    debtScore = Math.round((1 - overBudgetRatio) * 100);
  }

  // Consistency score: based on transaction frequency in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentTxCount = transactions.filter((t) => new Date(t.date) >= thirtyDaysAgo).length;
  const consistencyScore = Math.min(Math.round((recentTxCount / 30) * 100), 100);

  const score = Math.round((savingsScore + debtScore + consistencyScore) / 3);

  return {
    score,
    breakdown: { savings: savingsScore, debt: debtScore, consistency: consistencyScore },
  };
}

export function getTreeStage(
  currentAmount: number,
  targetAmount: number
): 0 | 1 | 2 | 3 | 4 | 5 {
  if (targetAmount <= 0) return 0;
  const ratio = currentAmount / targetAmount;
  if (ratio >= 1) return 5;
  if (ratio >= 0.8) return 4;
  if (ratio >= 0.6) return 3;
  if (ratio >= 0.4) return 2;
  if (ratio >= 0.1) return 1;
  return 0;
}

export function detectRecurringExpenses(transactions: Transaction[]): Transaction[] {
  const descriptionMap: Record<string, Transaction[]> = {};

  for (const t of transactions) {
    const key = t.description.toLowerCase().trim();
    if (!descriptionMap[key]) descriptionMap[key] = [];
    descriptionMap[key].push(t);
  }

  const recurring: Transaction[] = [];
  for (const [, txs] of Object.entries(descriptionMap)) {
    if (txs.length >= 2) {
      // Check if amounts are similar (within 10%)
      const avgAmount = txs.reduce((sum, t) => sum + t.amount, 0) / txs.length;
      const allSimilar = txs.every((t) => Math.abs(t.amount - avgAmount) / avgAmount < 0.1);
      if (allSimilar) {
        recurring.push(...txs);
      }
    }
  }

  return recurring;
}

export function groupByCategory(transactions: Transaction[]): Record<Category, Transaction[]> {
  const groups: Partial<Record<Category, Transaction[]>> = {};

  for (const t of transactions) {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category]!.push(t);
  }

  return groups as Record<Category, Transaction[]>;
}

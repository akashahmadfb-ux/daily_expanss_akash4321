import OpenAI from 'openai';
import type { Transaction, Budget, AIInsight, Category } from '@daily-expanss/shared';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a gentle, empathetic financial wellness companion for a personal finance tracker app inspired by "It's Okay to Not Be Okay". Your tone is warm, healing, and non-judgmental — like a trusted friend who happens to be good with money.

When providing financial insights:
- Never shame or criticize spending habits
- Acknowledge that life is hard and finances can be overwhelming
- Frame advice as gentle suggestions, not demands
- Include encouraging affirmations
- Be culturally sensitive (users may be students in Bangladesh or elsewhere)
- Keep messages concise, warm, and actionable`;

export async function generateSpendingInsights(
  transactions: Transaction[],
  budgets: Budget[]
): Promise<AIInsight[]> {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categorySpending: Record<string, number> = {};
  for (const t of transactions.filter((t) => t.type === 'expense')) {
    categorySpending[t.category] = (categorySpending[t.category] ?? 0) + t.amount;
  }

  const overBudgetCategories = budgets
    .filter((b) => b.spent_amount > b.limit_amount)
    .map((b) => b.category);

  const prompt = `
Analyze this spending data and provide 3-4 personalized insights:

Total Income: ${totalIncome}
Total Expenses: ${totalExpenses}
Savings Rate: ${totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0}%
Category Spending: ${JSON.stringify(categorySpending)}
Over-budget Categories: ${overBudgetCategories.join(', ') || 'None'}

Return a JSON array of insights with this structure:
[{ "message": "...", "type": "tip|warning|encouragement|achievement" }]

Provide 3-4 insights. Be gentle and healing in tone.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content ?? '{"insights":[]}';
  let parsed: { insights?: Array<{ message: string; type: AIInsight['type'] }> };
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { insights: [] };
  }

  const insights = parsed.insights ?? [];
  return insights.map((insight, i) => ({
    id: `insight-${Date.now()}-${i}`,
    user_id: '',
    message: insight.message,
    type: insight.type ?? 'tip',
    created_at: new Date().toISOString(),
  }));
}

export interface ParsedTransaction {
  description: string;
  amount: number;
  currency: string;
  category: Category;
}

export async function parseVoiceInput(text: string): Promise<ParsedTransaction> {
  // Try regex first: "Tea 30 taka" or "Lunch 150 BDT"
  const regexMatch = text.match(/^(.+?)\s+(\d+\.?\d*)\s*(\w+)?$/i);

  if (regexMatch) {
    const description = regexMatch[1].trim();
    const amount = parseFloat(regexMatch[2]);
    const currency = regexMatch[3]?.toUpperCase() === 'TAKA' ? 'BDT' : regexMatch[3] ?? 'BDT';

    // Simple category detection
    const lowerDesc = description.toLowerCase();
    let category: Category = 'other';
    if (/food|lunch|dinner|breakfast|tea|coffee|snack|meal|restaurant/.test(lowerDesc))
      category = 'food';
    else if (/travel|bus|rickshaw|uber|transport|ride/.test(lowerDesc)) category = 'travel';
    else if (/university|tuition|book|class|exam|fee/.test(lowerDesc)) category = 'university';
    else if (/salary|income|payment|freelance|earn/.test(lowerDesc)) category = 'salary';
    else if (/loan|borrow/.test(lowerDesc)) category = 'loan';

    return { description, amount, currency, category };
  }

  // Fall back to GPT for complex inputs
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Parse this voice input into a transaction: "${text}"
        
Return JSON: { "description": "...", "amount": number, "currency": "BDT|USD|...", "category": "food|travel|university|personal|loan|borrowed|salary|other" }`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  try {
    return JSON.parse(content) as ParsedTransaction;
  } catch {
    return { description: text, amount: 0, currency: 'BDT', category: 'other' };
  }
}

export async function generateWeeklyTip(): Promise<string> {
  const tips = [
    "Try the 50/30/20 rule — 50% needs, 30% wants, 20% savings. Even small steps count. 🌱",
    "Review your subscriptions this week. Cancelling just one unused service can free up money for something meaningful. 💙",
    "Before a non-essential purchase, wait 24 hours. Your future self might thank you — or might still want it, and that's okay too. ✨",
    "Track every expense this week, no matter how small. Awareness is the first step to change, not perfection. 🌿",
    "Set a tiny savings goal — even saving 50 taka a day adds up to 1,500 taka a month. You're capable of more than you know. 💫",
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Generate a single, warm weekly financial tip for a student. Keep it under 100 words, healing tone, practical advice. Return just the tip text, no JSON.`,
      },
    ],
  });

  return response.choices[0]?.message?.content ?? tips[Math.floor(Math.random() * tips.length)];
}

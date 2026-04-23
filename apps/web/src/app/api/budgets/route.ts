import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]/route';

const budgetSchema = z.object({
  category: z.enum(['university', 'personal', 'travel', 'food', 'loan', 'borrowed', 'salary', 'other']),
  limit_amount: z.number().positive(),
  period: z.enum(['monthly', 'weekly']).default('monthly'),
  currency: z.string().default('BDT'),
});

const budgets: any[] = [];

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(budgets.filter((b) => b.user_id === (session.user as any).id));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validated = budgetSchema.parse(body);
    const budget = { id: crypto.randomUUID(), user_id: (session.user as any).id, spent_amount: 0, ...validated };
    budgets.push(budget);
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

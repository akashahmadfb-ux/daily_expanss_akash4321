import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]/route';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive(),
  currency: z.string().default('BDT'),
  category: z.enum(['university', 'personal', 'travel', 'food', 'loan', 'borrowed', 'salary', 'other']),
  description: z.string().min(1),
  date: z.string(),
  receipt_url: z.string().optional(),
  is_recurring: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

// In-memory store for demo (replace with Prisma in production)
const transactions: any[] = [];

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const search = searchParams.get('search');

  let filtered = transactions.filter((t) => t.user_id === (session.user as any).id);
  if (category) filtered = filtered.filter((t) => t.category === category);
  if (type) filtered = filtered.filter((t) => t.type === type);
  if (search) filtered = filtered.filter((t) => t.description.toLowerCase().includes(search.toLowerCase()));

  return NextResponse.json(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validated = transactionSchema.parse(body);
    const transaction = {
      id: crypto.randomUUID(),
      user_id: (session.user as any).id,
      ...validated,
      created_at: new Date().toISOString(),
    };
    transactions.push(transaction);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

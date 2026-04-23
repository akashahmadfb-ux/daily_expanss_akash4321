import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]/route';

const debtSchema = z.object({
  counterparty_name: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().default('BDT'),
  type: z.enum(['owed_to_me', 'i_owe']),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

const debts: any[] = [];

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(debts.filter((d) => d.user_id === (session.user as any).id));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validated = debtSchema.parse(body);
    const debt = { id: crypto.randomUUID(), user_id: (session.user as any).id, is_settled: false, created_at: new Date().toISOString(), ...validated };
    debts.push(debt);
    return NextResponse.json(debt, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

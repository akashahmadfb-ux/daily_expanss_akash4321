import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]/route';

const goalSchema = z.object({
  title: z.string().min(1),
  target_amount: z.number().positive(),
  currency: z.string().default('BDT'),
  deadline: z.string().optional(),
});

const goals: any[] = [];

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(goals.filter((g) => g.user_id === (session.user as any).id));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validated = goalSchema.parse(body);
    const goal = { id: crypto.randomUUID(), user_id: (session.user as any).id, current_amount: 0, tree_stage: 0, created_at: new Date().toISOString(), ...validated };
    goals.push(goal);
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

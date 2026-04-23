import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '../../auth/[...nextauth]/route';

const transactions: any[] = [];

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const tx = transactions.find((t) => t.id === params.id && t.user_id === (session.user as any).id);
  if (!tx) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(tx);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const idx = transactions.findIndex((t) => t.id === params.id && t.user_id === (session.user as any).id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json();
  transactions[idx] = { ...transactions[idx], ...body, updated_at: new Date().toISOString() };
  return NextResponse.json(transactions[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const idx = transactions.findIndex((t) => t.id === params.id && t.user_id === (session.user as any).id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  transactions.splice(idx, 1);
  return NextResponse.json({ success: true });
}

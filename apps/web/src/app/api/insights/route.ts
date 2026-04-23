import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { generateSpendingInsights, generateWeeklyTip } from '@daily-expanss/ai';
import { HEALING_MESSAGES } from '@daily-expanss/shared';

export async function POST(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const insights = await generateSpendingInsights([], []);
    return NextResponse.json(insights);
  } catch {
    // Return healing messages as fallback
    return NextResponse.json(
      HEALING_MESSAGES.slice(0, 3).map((msg, i) => ({
        id: `fallback-${i}`,
        user_id: (session.user as any).id,
        message: msg,
        type: 'encouragement' as const,
        created_at: new Date().toISOString(),
      }))
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  if (searchParams.get('type') === 'tip') {
    try {
      const tip = await generateWeeklyTip();
      return NextResponse.json({ tip });
    } catch {
      return NextResponse.json({ tip: HEALING_MESSAGES[Math.floor(Math.random() * HEALING_MESSAGES.length)] });
    }
  }

  return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
}

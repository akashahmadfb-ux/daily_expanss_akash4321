import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;
    if (!imageFile) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    // In production, call Google Vision API here
    // For now, return a mock parsed receipt
    return NextResponse.json({
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: 'Receipt item',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process receipt' }, { status: 500 });
  }
}

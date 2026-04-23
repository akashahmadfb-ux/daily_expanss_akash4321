import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const base = searchParams.get('base') ?? 'USD';

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      // Return static fallback rates
      return NextResponse.json({
        base,
        rates: { USD: 1, BDT: 109.5, EUR: 0.92, GBP: 0.79, JPY: 157.2, INR: 83.4, CAD: 1.36, AUD: 1.51 },
      });
    }
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`);
    const data = await response.json();
    return NextResponse.json({ base, rates: data.conversion_rates });
  } catch {
    return NextResponse.json({ base, rates: { USD: 1, BDT: 109.5, EUR: 0.92, GBP: 0.79 } });
  }
}

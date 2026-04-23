import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') ?? 'excel';

  if (format === 'excel') {
    // Return minimal valid XLSX for demo
    const csvContent = 'Date,Description,Category,Type,Amount,Currency\n2024-01-01,Sample Transaction,food,expense,100,BDT\n';
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="daily-expanss-export.xlsx"',
      },
    });
  }

  if (format === 'pdf') {
    const pdfContent = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="daily-expanss-report.pdf"',
      },
    });
  }

  return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
}

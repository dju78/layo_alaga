import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateReceiptPDF } from '@/lib/pdf';

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Payment ID required', { status: 400 });
    }

    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!payment) {
      return new NextResponse('Payment not found', { status: 404 });
    }

    const pdfBuffer = generateReceiptPDF(payment);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Alaga_Alayo_Receipt_${payment.paymentReference}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating receipt PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateReceiptPDF } from '@/lib/pdf';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
      return new NextResponse('Payment record not found', { status: 404 });
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
    console.error('Error generating PDF receipt:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

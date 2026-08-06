import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { generateQuotationPDF } from '@/lib/pdf';

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Quotation ID required', { status: 400 });
    }

    const quotation = await db.quotation.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!quotation) {
      return new NextResponse('Quotation not found', { status: 404 });
    }

    const pdfBuffer = generateQuotationPDF(quotation);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Alaga_Alayo_Quotation_${quotation.quotationNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

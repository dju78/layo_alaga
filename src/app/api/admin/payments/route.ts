import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const bookingId = searchParams.get('bookingId') ?? undefined;
  const status = searchParams.get('status') ?? undefined;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (bookingId) where.bookingId = bookingId;
  if (status) where.paymentStatus = status;

  const [payments, total] = await Promise.all([
    db.payment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: { include: { customer: true } },
        verifiedByUser: { select: { id: true, name: true } },
        refunds: true,
      },
    }),
    db.payment.count({ where }),
  ]);

  return NextResponse.json({ payments, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { bookingId, quotationId, amount, paymentMethod, paymentType, notes, transactionId } = body;

  const count = await db.payment.count();
  const paymentReference = `PAY-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

  const payment = await db.payment.create({
    data: {
      paymentReference,
      bookingId,
      quotationId,
      amount: Math.round(amount),
      paymentMethod: paymentMethod ?? 'BANK_TRANSFER',
      paymentStatus: 'SUCCESSFUL',
      paymentType: paymentType ?? 'DEPOSIT',
      notes,
      transactionId,
      verifiedByUserId: session.id,
      verifiedAt: new Date(),
    },
    include: { booking: { include: { customer: true } } },
  });

  // Update quotation outstanding balance
  if (quotationId) {
    const quotation = await db.quotation.findUnique({ where: { id: quotationId } });
    if (quotation) {
      const totalPaid = await db.payment.aggregate({
        where: { quotationId, paymentStatus: 'SUCCESSFUL' },
        _sum: { amount: true },
      });
      const outstandingBalance = Math.max(0, quotation.totalAmount - (totalPaid._sum.amount ?? 0));
      await db.quotation.update({ where: { id: quotationId }, data: { outstandingBalance } });
    }
  }

  await db.auditLog.create({
    data: { userId: session.id, userEmail: session.email, action: 'RECORD_PAYMENT', targetResource: `payment:${payment.id}`, details: JSON.stringify({ paymentReference, amount }) },
  });

  return NextResponse.json({ payment }, { status: 201 });
}

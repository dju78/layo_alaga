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
  if (status) where.status = status;

  const [quotations, total] = await Promise.all([
    db.quotation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: { include: { customer: true } },
        payments: true,
      },
    }),
    db.quotation.count({ where }),
  ]);

  return NextResponse.json({ quotations, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const {
    bookingId,
    serviceCharges = 0,
    equipmentCharges = 0,
    deliveryCharges = 0,
    setupCharges = 0,
    transportCosts = 0,
    discounts = 0,
    tax = 0,
    depositRequired,
    paymentDeadline,
    expiryDate,
    termsAndConditions,
    adminNotes,
    customerNotes,
  } = body;

  // Get next version for this booking
  const existing = await db.quotation.findMany({ where: { bookingId }, orderBy: { version: 'desc' } });
  const version = existing.length > 0 ? existing[0].version + 1 : 1;

  // Generate quotation number
  const count = await db.quotation.count();
  const quotationNumber = `QUO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

  const subtotal = serviceCharges + equipmentCharges + deliveryCharges + setupCharges + transportCosts - discounts;
  const taxAmount = Math.round(subtotal * (tax / 100));
  const totalAmount = subtotal + taxAmount;
  const deposit = depositRequired ?? Math.round(totalAmount * 0.5);

  const quotation = await db.quotation.create({
    data: {
      quotationNumber,
      bookingId,
      version,
      status: 'DRAFT',
      serviceCharges,
      equipmentCharges,
      deliveryCharges,
      setupCharges,
      transportCosts,
      discounts,
      tax: taxAmount,
      subtotal,
      totalAmount,
      depositRequired: deposit,
      outstandingBalance: totalAmount,
      paymentDeadline: paymentDeadline ? new Date(paymentDeadline) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      termsAndConditions,
      adminNotes,
      customerNotes,
    },
    include: { booking: { include: { customer: true } } },
  });

  // Save a snapshot version
  await db.quotationVersion.create({
    data: { quotationId: quotation.id, versionNumber: version, snapshotData: JSON.stringify(quotation) },
  });

  await db.auditLog.create({
    data: { userId: session.id, userEmail: session.email, action: 'CREATE_QUOTATION', targetResource: `quotation:${quotation.id}`, details: JSON.stringify({ quotationNumber }) },
  });

  return NextResponse.json({ quotation }, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;

  const quotation = await db.quotation.findUnique({
    where: { id },
    include: {
      booking: { include: { customer: true, services: { include: { service: true } }, reservations: { include: { items: { include: { rentalItem: true } } } } } },
      versions: true,
      decisions: true,
      payments: true,
    },
  });

  if (!quotation) return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
  return NextResponse.json({ quotation });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();

  const existing = await db.quotation.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Recalculate if financial fields changed
  let totalAmount = existing.totalAmount;
  let subtotal = existing.subtotal;

  if (body.serviceCharges !== undefined || body.equipmentCharges !== undefined || body.deliveryCharges !== undefined) {
    const svc = body.serviceCharges ?? existing.serviceCharges;
    const eqp = body.equipmentCharges ?? existing.equipmentCharges;
    const del = body.deliveryCharges ?? existing.deliveryCharges;
    const stp = body.setupCharges ?? existing.setupCharges;
    const trn = body.transportCosts ?? existing.transportCosts;
    const dis = body.discounts ?? existing.discounts;
    const taxRate = body.tax ?? 0;
    subtotal = svc + eqp + del + stp + trn - dis;
    const taxAmount = Math.round(subtotal * (taxRate / 100));
    totalAmount = subtotal + taxAmount;
    body.subtotal = subtotal;
    body.totalAmount = totalAmount;
    body.tax = taxAmount;
  }

  const quotation = await db.quotation.update({
    where: { id },
    data: {
      ...body,
      paymentDeadline: body.paymentDeadline ? new Date(body.paymentDeadline) : undefined,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
    },
    include: { booking: { include: { customer: true } } },
  });

  await db.auditLog.create({
    data: { userId: session.id, userEmail: session.email, action: 'UPDATE_QUOTATION', targetResource: `quotation:${id}`, details: JSON.stringify(body) },
  });

  return NextResponse.json({ quotation });
}

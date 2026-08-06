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

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      services: { include: { service: true } },
      reservations: { include: { items: { include: { rentalItem: { include: { category: true } } } } } },
      quotations: { orderBy: { version: 'desc' }, include: { versions: true, decisions: true, payments: true } },
      payments: { include: { verifiedByUser: true, refunds: true } },
      statusHistory: { orderBy: { createdAt: 'desc' }, include: { changedByUser: true } },
      documents: true,
      staffAssignments: { include: { staffProfile: true } },
    },
  });

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  return NextResponse.json({ booking });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // Handle status transitions
  if (body.status) {
    const existing = await db.booking.findUnique({ where: { id }, select: { status: true } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await db.bookingStatusHistory.create({
      data: {
        bookingId: id,
        previousStatus: existing.status,
        newStatus: body.status,
        changedByUserId: session.id,
        reason: body.statusReason ?? 'Status updated by admin',
        internalNote: body.internalNote,
      },
    });
  }

  const { statusReason, internalNote, ...updateData } = body;

  const booking = await db.booking.update({
    where: { id },
    data: {
      ...updateData,
      eventDate: updateData.eventDate ? new Date(updateData.eventDate) : undefined,
      updatedAt: new Date(),
    },
    include: { customer: true, services: { include: { service: true } } },
  });

  await db.auditLog.create({
    data: { userId: session.id, userEmail: session.email, action: 'UPDATE_BOOKING', targetResource: `booking:${id}`, details: JSON.stringify(body) },
  });

  return NextResponse.json({ booking });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['PLATFORM_ADMIN', 'BUSINESS_OWNER'].includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  await db.booking.delete({ where: { id } });

  await db.auditLog.create({
    data: { userId: session.id, userEmail: session.email, action: 'DELETE_BOOKING', targetResource: `booking:${id}`, details: '{}' },
  });

  return NextResponse.json({ ok: true });
}

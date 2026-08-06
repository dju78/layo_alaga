import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const status = searchParams.get('status') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { reference: { contains: search } },
      { customer: { name: { contains: search } } },
      { customer: { email: { contains: search } } },
      { customer: { phone: { contains: search } } },
    ];
  }

  const [bookings, total] = await Promise.all([
    db.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        services: { include: { service: true } },
        quotations: { orderBy: { version: 'desc' }, take: 1 },
        payments: true,
        staffAssignments: { include: { staffProfile: true } },
      },
    }),
    db.booking.count({ where }),
  ]);

  return NextResponse.json({ bookings, total, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const {
      customer,
      eventType, eventDate, startTime, endTime,
      venueName, venueAddress, city, state,
      expectedGuestCount, isOutdoor, preferredLanguage,
      eventColorTheme, notes, specialRequests,
      serviceIds, referralSource,
    } = body;

    // Upsert customer
    const existingCustomer = await db.customer.findFirst({ where: { email: customer.email } });
    const customerRecord = existingCustomer
      ? await db.customer.update({ where: { id: existingCustomer.id }, data: { ...customer } })
      : await db.customer.create({ data: customer });

    // Generate reference
    const count = await db.booking.count();
    const reference = `AAE-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const booking = await db.booking.create({
      data: {
        reference,
        customerId: customerRecord.id,
        eventType,
        eventDate: new Date(eventDate),
        startTime,
        endTime,
        venueName,
        venueAddress,
        city,
        state: state ?? 'Lagos',
        expectedGuestCount: expectedGuestCount ?? 100,
        isOutdoor: isOutdoor ?? false,
        preferredLanguage: preferredLanguage ?? 'English & Yoruba',
        eventColorTheme,
        notes,
        specialRequests,
        referralSource,
        services: serviceIds?.length
          ? { create: serviceIds.map((serviceId: string) => ({ serviceId })) }
          : undefined,
      },
      include: { customer: true, services: { include: { service: true } } },
    });

    // Status history
    await db.bookingStatusHistory.create({
      data: {
        bookingId: booking.id,
        previousStatus: 'ENQUIRY_RECEIVED',
        newStatus: 'AWAITING_REVIEW',
        changedByUserId: session.id,
        reason: 'Booking created by admin',
      },
    });

    await db.auditLog.create({
      data: { userId: session.id, userEmail: session.email, action: 'CREATE_BOOKING', targetResource: `booking:${booking.id}`, details: JSON.stringify({ reference }) },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    console.error('Create booking error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

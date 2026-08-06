import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const active = searchParams.get('active');

  const staff = await db.staffProfile.findMany({
    where: active === 'true' ? { active: true } : undefined,
    orderBy: { fullName: 'asc' },
    include: {
      user: { select: { id: true, email: true, role: true } },
      assignments: {
        where: { booking: { status: { in: ['BOOKING_CONFIRMED', 'PREPARATION_IN_PROGRESS'] } } },
        include: { booking: { select: { reference: true, eventDate: true, eventType: true } } },
      },
    },
  });

  return NextResponse.json({ staff });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { fullName, roleTitle, phone, email, active = true } = body;

  const staff = await db.staffProfile.create({
    data: { fullName, roleTitle, phone, email, active },
  });

  return NextResponse.json({ staff }, { status: 201 });
}

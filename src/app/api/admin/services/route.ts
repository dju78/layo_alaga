import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

// Services CRUD
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const admin = searchParams.get('admin') === 'true';

  if (admin) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const services = await db.service.findMany({
    where: admin ? undefined : { active: true },
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  });

  return NextResponse.json({ services });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const service = await db.service.create({ data: body });

  return NextResponse.json({ service }, { status: 201 });
}

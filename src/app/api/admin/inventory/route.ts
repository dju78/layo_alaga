import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const active = searchParams.get('active');
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '50');
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (active === 'true') where.active = true;
  if (active === 'false') where.active = false;
  if (category) where.categoryId = category;

  const [items, total, categories] = await Promise.all([
    db.rentalItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: { category: true },
    }),
    db.rentalItem.count({ where }),
    db.rentalCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return NextResponse.json({ items, total, categories, page, limit, pages: Math.ceil(total / limit) });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const {
    categoryId, name, slug, description,
    totalQuantity, rentalPrice, pricingUnit,
    refundableDeposit, deliveryCharge, setupCharge,
    minimumOrder, condition, active = true, featured = false,
  } = body;

  const item = await db.rentalItem.create({
    data: {
      categoryId, name, slug, description,
      totalQuantity: totalQuantity ?? 1,
      availableQuantity: totalQuantity ?? 1,
      rentalPrice: rentalPrice ?? 0,
      pricingUnit: pricingUnit ?? 'per day',
      refundableDeposit: refundableDeposit ?? 0,
      deliveryCharge: deliveryCharge ?? 0,
      setupCharge: setupCharge ?? 0,
      minimumOrder: minimumOrder ?? 1,
      condition: condition ?? 'Excellent',
      active,
      featured,
    },
    include: { category: true },
  });

  return NextResponse.json({ item }, { status: 201 });
}

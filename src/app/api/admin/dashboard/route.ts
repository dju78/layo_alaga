import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

// Dashboard stats
export async function GET(_req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    totalBookings,
    bookingsThisMonth,
    activeBookings,
    upcomingEvents,
    totalRevenue,
    revenueThisMonth,
    totalCustomers,
    pendingEnquiries,
    bookingsByStatus,
    recentBookings,
    revenueByMonth,
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.booking.count({ where: { status: { in: ['BOOKING_CONFIRMED', 'PREPARATION_IN_PROGRESS'] } } }),
    db.booking.count({ where: { eventDate: { gte: now, lte: next30Days }, status: { not: 'CANCELLED' } } }),
    db.payment.aggregate({ where: { paymentStatus: 'SUCCESSFUL' }, _sum: { amount: true } }),
    db.payment.aggregate({ where: { paymentStatus: 'SUCCESSFUL', createdAt: { gte: startOfMonth } }, _sum: { amount: true } }),
    db.customer.count(),
    db.booking.count({ where: { status: { in: ['ENQUIRY_RECEIVED', 'AWAITING_REVIEW'] } } }),
    db.booking.groupBy({ by: ['status'], _count: { status: true } }),
    db.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
      where: { status: { not: 'ARCHIVED' } },
    }),
    // Revenue by month for current year
    db.payment.findMany({
      where: { paymentStatus: 'SUCCESSFUL', createdAt: { gte: startOfYear } },
      select: { amount: true, createdAt: true },
    }),
  ]);

  // Process revenue by month
  const monthlyRevenue: Record<number, number> = {};
  for (const p of revenueByMonth) {
    const month = p.createdAt.getMonth();
    monthlyRevenue[month] = (monthlyRevenue[month] ?? 0) + p.amount;
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueChart = monthNames.map((name, idx) => ({
    month: name,
    revenue: monthlyRevenue[idx] ?? 0,
  }));

  const statusCounts: Record<string, number> = {};
  for (const s of bookingsByStatus) {
    statusCounts[s.status] = s._count.status;
  }

  return NextResponse.json({
    stats: {
      totalBookings,
      bookingsThisMonth,
      activeBookings,
      upcomingEvents,
      totalRevenue: totalRevenue._sum.amount ?? 0,
      revenueThisMonth: revenueThisMonth._sum.amount ?? 0,
      totalCustomers,
      pendingEnquiries,
    },
    bookingsByStatus: statusCounts,
    recentBookings,
    revenueChart,
  });
}

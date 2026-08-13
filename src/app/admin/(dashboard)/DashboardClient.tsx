'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalBookings: number;
  bookingsThisMonth: number;
  activeBookings: number;
  upcomingEvents: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalCustomers: number;
  pendingEnquiries: number;
}

interface DashboardData {
  stats: DashboardStats;
  bookingsByStatus: Record<string, number>;
  recentBookings: Array<{
    id: string;
    reference: string;
    status: string;
    eventDate: string;
    eventType: string;
    customer: { name: string; phone: string };
  }>;
  revenueChart: Array<{ month: string; revenue: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  ENQUIRY_RECEIVED: '#3765A3',
  AWAITING_REVIEW: '#A66514',
  AWAITING_QUOTATION: '#C99A3D',
  QUOTATION_SENT: '#652278',
  AWAITING_DEPOSIT: '#B84C73',
  BOOKING_CONFIRMED: '#247A52',
  PREPARATION_IN_PROGRESS: '#4A175B',
  EVENT_COMPLETED: '#32113C',
  CANCELLED: '#B83B42',
  ARCHIVED: '#7E7781',
};

const STATUS_LABELS: Record<string, string> = {
  ENQUIRY_RECEIVED: 'New Enquiry',
  AWAITING_REVIEW: 'Awaiting Review',
  AWAITING_QUOTATION: 'Needs Quote',
  QUOTATION_SENT: 'Quote Sent',
  AWAITING_DEPOSIT: 'Awaiting Deposit',
  BOOKING_CONFIRMED: 'Confirmed',
  PREPARATION_IN_PROGRESS: 'In Preparation',
  EVENT_COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  ARCHIVED: 'Archived',
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string | number; sub?: string; icon: string; accent: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E8E4E9] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#7E7781] uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-bold mt-1.5 ${accent}`}>{value}</p>
          {sub && <p className="text-xs text-[#7E7781] mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl`} style={{ background: `${accent.replace('text-', '')}15` }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#652278] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#7E7781] text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#B83B42]">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { stats, bookingsByStatus, recentBookings, revenueChart } = data;

  // Pie chart data
  const pieData = Object.entries(bookingsByStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status] ?? status,
      value: count,
      color: STATUS_COLORS[status] ?? '#7E7781',
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#32113C] font-serif">Dashboard</h1>
          <p className="text-sm text-[#7E7781] mt-0.5">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/bookings/new"
            className="px-4 py-2 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            + New Booking
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={stats.totalBookings} sub={`${stats.bookingsThisMonth} this month`} icon="📅" accent="text-[#32113C]" />
        <StatCard label="Active Bookings" value={stats.activeBookings} sub={`${stats.upcomingEvents} in next 30 days`} icon="⚡" accent="text-[#247A52]" />
        <StatCard label="Total Revenue" value={formatNaira(stats.totalRevenue)} sub={`${formatNaira(stats.revenueThisMonth)} this month`} icon="💰" accent="text-[#652278]" />
        <StatCard label="Pending Enquiries" value={stats.pendingEnquiries} sub={`${stats.totalCustomers} customers total`} icon="📬" accent="text-[#A66514]" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#E8E4E9] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#32113C] font-serif">Revenue This Year</h2>
            <span className="text-xs text-[#7E7781] bg-[#F4F2F5] px-2 py-1 rounded-lg">{new Date().getFullYear()}</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChart} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#652278" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#652278" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F2F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7E7781' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#7E7781' }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `₦${(v / 1000).toFixed(0)}k` : `₦${v}`} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #E8E4E9', fontSize: '12px' }}
                formatter={(v: any) => [formatNaira(Number(v) || 0), 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#652278" strokeWidth={2.5} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings by status pie */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4E9] shadow-sm">
          <h2 className="font-semibold text-[#32113C] font-serif mb-4">Bookings by Status</h2>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E8E4E9', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {pieData.slice(0, 5).map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: d.color }} />
                      <span className="text-[#514B54]">{d.name}</span>
                    </span>
                    <span className="font-semibold text-[#32113C]">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-[#7E7781] text-sm">No bookings yet</div>
          )}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8E4E9] flex items-center justify-between">
          <h2 className="font-semibold text-[#32113C] font-serif">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs text-[#652278] hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7FB]">
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Reference</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Event</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2F5]">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-[#7E7781]">No bookings yet</td>
                </tr>
              ) : (
                recentBookings.map(b => (
                  <tr key={b.id} className="hover:bg-[#FAF7FB] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-[#652278] font-semibold">{b.reference}</td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-[#17131A]">{b.customer.name}</p>
                        <p className="text-xs text-[#7E7781]">{b.customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#514B54]">{b.eventType}</td>
                    <td className="px-5 py-3.5 text-[#514B54] text-xs">
                      {new Date(b.eventDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: `${STATUS_COLORS[b.status] ?? '#7E7781'}18`, color: STATUS_COLORS[b.status] ?? '#7E7781' }}
                      >
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="text-xs text-[#652278] hover:underline font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

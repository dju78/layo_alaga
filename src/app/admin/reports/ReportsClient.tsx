'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ReportsClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#652278] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, revenueChart } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#32113C] font-serif">Reports &amp; Analytics</h1>
        <p className="text-sm text-[#7E7781]">Financial performance, booking volume, and business metrics</p>
      </div>

      {/* Summary KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4E9] shadow-sm">
          <p className="text-xs font-semibold text-[#7E7781] uppercase">Total Business Revenue</p>
          <p className="text-2xl font-bold text-[#652278] mt-2">₦{stats.totalRevenue.toLocaleString('en-NG')}</p>
          <p className="text-xs text-[#247A52] mt-1">✓ Verified Payments</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4E9] shadow-sm">
          <p className="text-xs font-semibold text-[#7E7781] uppercase">Total Completed Events</p>
          <p className="text-2xl font-bold text-[#32113C] mt-2">{stats.totalBookings}</p>
          <p className="text-xs text-[#7E7781] mt-1">{stats.activeBookings} active events</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4E9] shadow-sm">
          <p className="text-xs font-semibold text-[#7E7781] uppercase">Active Customer Base</p>
          <p className="text-2xl font-bold text-[#B84C73] mt-2">{stats.totalCustomers}</p>
          <p className="text-xs text-[#7E7781] mt-1">Unique clients served</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly Revenue Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4E9] shadow-sm">
          <h2 className="font-semibold text-[#32113C] font-serif mb-4">Monthly Financial Revenue (₦)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F2F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [`₦${(Number(v) || 0).toLocaleString('en-NG')}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#652278" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Growth Trend */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E4E9] shadow-sm">
          <h2 className="font-semibold text-[#32113C] font-serif mb-4">Revenue Growth Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F4F2F5" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => [`₦${(Number(v) || 0).toLocaleString('en-NG')}`, 'Trend']} />
              <Line type="monotone" dataKey="revenue" stroke="#C99A3D" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

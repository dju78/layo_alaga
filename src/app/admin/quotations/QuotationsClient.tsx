'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface Quotation {
  id: string;
  quotationNumber: string;
  version: number;
  status: string;
  totalAmount: number;
  depositRequired: number;
  outstandingBalance: number;
  createdAt: string;
  expiryDate: string | null;
  booking: {
    reference: string;
    eventType: string;
    eventDate: string;
    customer: { name: string; phone: string };
  };
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#A66514', SENT: '#3765A3', ACCEPTED: '#247A52', REJECTED: '#B83B42', EXPIRED: '#7E7781', REVISED: '#652278',
};

export default function QuotationsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const status = searchParams.get('status') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    qs.set('page', String(page));
    const res = await fetch(`/api/admin/quotations?${qs}`);
    const data = await res.json();
    setQuotations(data.quotations ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, [status, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    router.push(`/admin/quotations?${params}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#32113C] font-serif">Quotations</h1>
          <p className="text-sm text-[#7E7781]">{total} quotation{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/quotations/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm"
        >
          + New Quotation
        </Link>
      </div>

      {/* Status filter */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] p-4 flex gap-2 flex-wrap">
        {[['', 'All'], ['DRAFT', 'Draft'], ['SENT', 'Sent'], ['ACCEPTED', 'Accepted'], ['REJECTED', 'Rejected'], ['EXPIRED', 'Expired']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => updateParam('status', val)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${status === val ? 'bg-[#652278] text-white' : 'bg-[#F4F2F5] text-[#514B54] hover:bg-[#E8E4E9]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7FB] border-b border-[#E8E4E9]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Quotation #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Booking</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2F5]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((_, j) => (<td key={j} className="px-4 py-4"><div className="h-3 bg-[#F4F2F5] rounded animate-pulse" /></td>))}</tr>
                ))
              ) : quotations.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-[#7E7781]"><div className="text-3xl mb-2">📋</div><p>No quotations found</p></td></tr>
              ) : (
                quotations.map(q => (
                  <tr key={q.id} className="hover:bg-[#FAF7FB] transition-colors group">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-[#652278]">{q.quotationNumber}</td>
                    <td className="px-4 py-3.5">
                      <p className="font-mono text-xs text-[#514B54]">{q.booking.reference}</p>
                      <p className="text-xs text-[#7E7781]">{q.booking.eventType}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-[#17131A]">{q.booking.customer.name}</p>
                      <p className="text-xs text-[#7E7781]">{q.booking.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#32113C]">₦{q.totalAmount.toLocaleString('en-NG')}</td>
                    <td className="px-4 py-3.5">
                      <span className={`font-semibold text-sm ${q.outstandingBalance > 0 ? 'text-[#B83B42]' : 'text-[#247A52]'}`}>
                        ₦{q.outstandingBalance.toLocaleString('en-NG')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${STATUS_COLORS[q.status] ?? '#7E7781'}18`, color: STATUS_COLORS[q.status] ?? '#7E7781' }}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#7E7781]">{new Date(q.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</td>
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/quotations/${q.id}`} className="text-xs text-white bg-[#652278] px-3 py-1.5 rounded-lg hover:bg-[#4A175B] transition-colors opacity-0 group-hover:opacity-100">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="px-4 py-3 border-t border-[#E8E4E9] flex items-center justify-between">
            <p className="text-xs text-[#7E7781]">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => updateParam('page', String(page - 1))} className="px-3 py-1.5 text-xs rounded-lg border border-[#D8D3DA] disabled:opacity-40 hover:bg-[#F4F2F5]">← Prev</button>
              <button disabled={page >= pages} onClick={() => updateParam('page', String(page + 1))} className="px-3 py-1.5 text-xs rounded-lg border border-[#D8D3DA] disabled:opacity-40 hover:bg-[#F4F2F5]">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

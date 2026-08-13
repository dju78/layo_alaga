'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface PaymentItem {
  id: string;
  paymentReference: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentType: string;
  notes: string | null;
  transactionId: string | null;
  createdAt: string;
  booking: {
    id: string;
    reference: string;
    customer: { name: string; email: string; phone: string };
  };
  verifiedByUser: { name: string } | null;
}

interface BookingOption {
  id: string;
  reference: string;
  customer: { name: string };
  quotations: Array<{ id: string; quotationNumber: string; outstandingBalance: number }>;
}

export default function PaymentsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showRecordModal, setShowRecordModal] = useState(false);
  const [bookings, setBookings] = useState<BookingOption[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [selectedQuotationId, setSelectedQuotationId] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [paymentType, setPaymentType] = useState('DEPOSIT');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [recording, setRecording] = useState(false);

  const status = searchParams.get('status') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1');

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    qs.set('page', String(page));
    const res = await fetch(`/api/admin/payments?${qs}`);
    const data = await res.json();
    setPayments(data.payments ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, [status, page]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  useEffect(() => {
    if (showRecordModal) {
      fetch('/api/admin/bookings?limit=100')
        .then(r => r.json())
        .then(d => setBookings(d.bookings ?? []));
    }
  }, [showRecordModal]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    router.push(`/admin/payments?${params}`);
  }

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  async function handleRecordPayment(e: FormEvent) {
    e.preventDefault();
    if (!selectedBookingId || amount <= 0) {
      toast.error('Please select a booking and enter a valid amount');
      return;
    }

    setRecording(true);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBookingId,
          quotationId: selectedQuotationId || undefined,
          amount,
          paymentMethod,
          paymentType,
          transactionId: transactionId || undefined,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Payment ${data.payment.paymentReference} recorded!`);
        setShowRecordModal(false);
        setAmount(0);
        setTransactionId('');
        setNotes('');
        fetchPayments();
      } else {
        toast.error(data.error ?? 'Failed to record payment');
      }
    } finally {
      setRecording(false);
    }
  }

  function downloadReceipt(paymentId: string, ref: string) {
    toast.info('Generating receipt PDF…');
    fetch(`/api/pdf/receipt?id=${paymentId}`)
      .then(res => {
        if (!res.ok) throw new Error('Receipt generation failed');
        return res.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt-${ref}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => toast.error('Could not download receipt'));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#32113C] font-serif">Payments</h1>
          <p className="text-sm text-[#7E7781]">{total} transaction{total !== 1 ? 's' : ''} recorded</p>
        </div>
        <button
          onClick={() => setShowRecordModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm"
        >
          + Record Payment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] p-4 flex gap-2 flex-wrap">
        {[
          ['', 'All Payments'],
          ['SUCCESSFUL', 'Successful'],
          ['PENDING', 'Pending Verification'],
          ['FAILED', 'Failed / Cancelled'],
        ].map(([val, label]) => (
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Payment Ref</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Booking</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Method / Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2F5]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-3 bg-[#F4F2F5] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[#7E7781]">
                    <div className="text-3xl mb-2">💰</div>
                    <p>No payments recorded yet</p>
                  </td>
                </tr>
              ) : (
                payments.map(p => (
                  <tr key={p.id} className="hover:bg-[#FAF7FB] transition-colors group">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-[#652278]">{p.paymentReference}</td>
                    <td className="px-4 py-3.5">
                      <Link href={`/admin/bookings/${p.booking.id}`} className="font-mono text-xs font-medium text-[#32113C] hover:underline">
                        {p.booking.reference}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-[#17131A]">{p.booking.customer.name}</p>
                      <p className="text-xs text-[#7E7781]">{p.booking.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#514B54]">
                      <span className="font-semibold block text-[#32113C]">{p.paymentMethod.replace('_', ' ')}</span>
                      <span className="text-[#7E7781]">{p.paymentType}</span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#247A52]">₦{p.amount.toLocaleString('en-NG')}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: p.paymentStatus === 'SUCCESSFUL' ? '#E7F5EE' : '#FDEBEC',
                          color: p.paymentStatus === 'SUCCESSFUL' ? '#247A52' : '#B83B42',
                        }}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#7E7781]">
                      {new Date(p.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => downloadReceipt(p.id, p.paymentReference)}
                        className="text-xs text-[#652278] border border-[#652278] hover:bg-[#652278] hover:text-white px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Receipt
                      </button>
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

      {/* Record Payment Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-[#32113C] font-serif mb-4">Record New Payment</h3>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Select Booking</label>
                <select
                  value={selectedBookingId}
                  onChange={e => {
                    setSelectedBookingId(e.target.value);
                    setSelectedQuotationId('');
                  }}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                >
                  <option value="">— Select a booking —</option>
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.reference} — {b.customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBooking && selectedBooking.quotations.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Link to Quotation (Optional)</label>
                  <select
                    value={selectedQuotationId}
                    onChange={e => setSelectedQuotationId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  >
                    <option value="">— Select quotation —</option>
                    {selectedBooking.quotations.map(q => (
                      <option key={q.id} value={q.id}>
                        {q.quotationNumber} (Balance: ₦{q.outstandingBalance.toLocaleString('en-NG')})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={e => setAmount(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CARD">Card Payment</option>
                    <option value="CASH">Cash</option>
                    <option value="DEMO">Demo / Test</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Payment Type</label>
                  <select
                    value={paymentType}
                    onChange={e => setPaymentType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  >
                    <option value="DEPOSIT">Deposit (50%)</option>
                    <option value="PART_PAYMENT">Part Payment</option>
                    <option value="FULL_PAYMENT">Full Payment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Transaction Ref / ID</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    placeholder="e.g. TR-98242-NUBAN"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Additional payment verification notes…"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="flex-1 py-2.5 border border-[#D8D3DA] text-[#514B54] rounded-xl text-sm hover:bg-[#F4F2F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recording}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  {recording ? 'Saving…' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

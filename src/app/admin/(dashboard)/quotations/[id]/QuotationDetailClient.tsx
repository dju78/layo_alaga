'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

interface QuotationFull {
  id: string;
  quotationNumber: string;
  version: number;
  status: string;
  serviceCharges: number;
  equipmentCharges: number;
  deliveryCharges: number;
  setupCharges: number;
  transportCosts: number;
  discounts: number;
  tax: number;
  subtotal: number;
  totalAmount: number;
  depositRequired: number;
  outstandingBalance: number;
  paymentDeadline: string | null;
  expiryDate: string | null;
  termsAndConditions: string | null;
  adminNotes: string | null;
  customerNotes: string | null;
  createdAt: string;
  updatedAt: string;
  booking: {
    id: string;
    reference: string;
    eventType: string;
    eventDate: string;
    city: string;
    venueName: string;
    customer: { id: string; name: string; email: string; phone: string; whatsapp: string };
  };
  payments: Array<{ id: string; paymentReference: string; amount: number; paymentStatus: string; paymentType: string; createdAt: string }>;
  decisions: Array<{ id: string; decision: string; customerName: string; comment: string; createdAt: string }>;
}

const STATUSES = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'REVISED'];
const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#A66514', SENT: '#3765A3', ACCEPTED: '#247A52', REJECTED: '#B83B42', EXPIRED: '#7E7781', REVISED: '#652278',
};

export default function QuotationDetailClient({ quotationId }: { quotationId: string }) {
  const [q, setQ] = useState<QuotationFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchQ = useCallback(async () => {
    const res = await fetch(`/api/admin/quotations/${quotationId}`);
    const data = await res.json();
    setQ(data.quotation);
    setSelectedStatus(data.quotation?.status ?? '');
    setLoading(false);
  }, [quotationId]);

  useEffect(() => { fetchQ(); }, [fetchQ]);

  async function updateStatus() {
    if (!selectedStatus || !q) return;
    setUpdating(true);
    const res = await fetch(`/api/admin/quotations/${quotationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: selectedStatus }),
    });
    if (res.ok) { toast.success('Status updated'); fetchQ(); }
    else toast.error('Update failed');
    setUpdating(false);
  }

  async function downloadPDF() {
    toast.info('Generating PDF…');
    const res = await fetch(`/api/pdf/quotation?id=${quotationId}`);
    if (!res.ok) { toast.error('PDF generation failed'); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${q?.quotationNumber ?? 'quotation'}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#652278] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!q) return <div className="text-center py-16 text-[#B83B42]">Quotation not found.</div>;

  const totalPaid = q.payments.filter(p => p.paymentStatus === 'SUCCESSFUL').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/quotations" className="p-2 rounded-xl hover:bg-[#F4F2F5] text-[#514B54] text-sm">← Back</Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[#32113C] font-mono">{q.quotationNumber}</h1>
              <span className="text-xs text-[#7E7781]">v{q.version}</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${STATUS_COLORS[q.status]}18`, color: STATUS_COLORS[q.status] }}>
                {q.status}
              </span>
            </div>
            <p className="text-sm text-[#7E7781]">{q.booking.reference} · {q.booking.customer.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadPDF} className="px-4 py-2 border border-[#652278] text-[#652278] rounded-xl text-sm font-semibold hover:bg-[#F1E8F4] transition-colors">
            ↓ Download PDF
          </button>
          <Link
            href={`/admin/payments`}
            className="px-4 py-2 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm"
          >
            + Record Payment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Financial breakdown */}
          <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5">
            <h2 className="font-semibold text-[#32113C] font-serif mb-4">Financial Breakdown</h2>
            <div className="space-y-2 text-sm">
              {([
                ['Service Charges', q.serviceCharges],
                ['Equipment Charges', q.equipmentCharges],
                ['Delivery Charges', q.deliveryCharges],
                ['Setup Charges', q.setupCharges],
                ['Transport Costs', q.transportCosts],
              ] as Array<[string, number]>).map(([label, val]) => val > 0 && (
                <div key={label as string} className="flex justify-between py-1.5 border-b border-[#F4F2F5]">
                  <span className="text-[#514B54]">{label}</span>
                  <span className="font-medium text-[#17131A]">₦{(val as number).toLocaleString('en-NG')}</span>
                </div>
              ))}
              {q.discounts > 0 && (
                <div className="flex justify-between py-1.5 border-b border-[#F4F2F5]">
                  <span className="text-[#247A52]">Discounts</span>
                  <span className="font-medium text-[#247A52]">-₦{q.discounts.toLocaleString('en-NG')}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-[#F4F2F5]">
                <span className="text-[#514B54]">Subtotal</span>
                <span className="font-medium text-[#17131A]">₦{q.subtotal.toLocaleString('en-NG')}</span>
              </div>
              {q.tax > 0 && (
                <div className="flex justify-between py-1.5 border-b border-[#F4F2F5]">
                  <span className="text-[#514B54]">Tax</span>
                  <span className="font-medium text-[#17131A]">₦{q.tax.toLocaleString('en-NG')}</span>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold text-[#32113C]">Total</span>
                <span className="text-lg font-bold text-[#652278]">₦{q.totalAmount.toLocaleString('en-NG')}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#FFF4DF] rounded-xl text-center">
                <p className="text-xs text-[#A66514] font-medium">Deposit Due</p>
                <p className="text-sm font-bold text-[#A66514] mt-1">₦{q.depositRequired.toLocaleString('en-NG')}</p>
              </div>
              <div className="p-3 bg-[#E7F5EE] rounded-xl text-center">
                <p className="text-xs text-[#247A52] font-medium">Total Paid</p>
                <p className="text-sm font-bold text-[#247A52] mt-1">₦{totalPaid.toLocaleString('en-NG')}</p>
              </div>
              <div className="p-3 bg-[#FDEBEC] rounded-xl text-center">
                <p className="text-xs text-[#B83B42] font-medium">Outstanding</p>
                <p className="text-sm font-bold text-[#B83B42] mt-1">₦{q.outstandingBalance.toLocaleString('en-NG')}</p>
              </div>
            </div>
          </div>

          {/* Terms */}
          {q.termsAndConditions && (
            <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5">
              <h2 className="font-semibold text-[#32113C] font-serif mb-3">Terms & Conditions</h2>
              <pre className="text-xs text-[#514B54] font-sans whitespace-pre-wrap leading-relaxed">{q.termsAndConditions}</pre>
            </div>
          )}

          {/* Payments */}
          {q.payments.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#E8E4E9] bg-[#FAF7FB]">
                <h2 className="font-semibold text-[#32113C] font-serif">Payment History</h2>
              </div>
              <div className="divide-y divide-[#F4F2F5]">
                {q.payments.map(p => (
                  <div key={p.id} className="px-5 py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono font-semibold text-[#652278]">{p.paymentReference}</p>
                      <p className="text-xs text-[#7E7781]">{p.paymentType} · {new Date(p.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#32113C]">₦{p.amount.toLocaleString('en-NG')}</p>
                      <span className={`text-xs font-medium ${p.paymentStatus === 'SUCCESSFUL' ? 'text-[#247A52]' : 'text-[#B83B42]'}`}>{p.paymentStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Update status */}
          <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5">
            <h2 className="font-semibold text-[#32113C] font-serif mb-3">Update Status</h2>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB] mb-3"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={updateStatus}
              disabled={updating || selectedStatus === q.status}
              className="w-full py-2.5 bg-[#652278] text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {updating ? 'Saving…' : 'Update Status'}
            </button>
          </div>

          {/* Booking / event info */}
          <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5 space-y-3">
            <h2 className="font-semibold text-[#32113C] font-serif">Booking Details</h2>
            <Link href={`/admin/bookings/${q.booking.id}`} className="font-mono text-xs font-semibold text-[#652278] hover:underline">{q.booking.reference}</Link>
            <p className="text-sm text-[#514B54]">{q.booking.eventType}</p>
            <p className="text-xs text-[#7E7781]">{new Date(q.booking.eventDate).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-xs text-[#7E7781]">{q.booking.venueName}, {q.booking.city}</p>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5 space-y-2">
            <h2 className="font-semibold text-[#32113C] font-serif">Customer</h2>
            <p className="font-medium text-[#17131A]">{q.booking.customer.name}</p>
            <a href={`tel:${q.booking.customer.phone}`} className="block text-sm text-[#514B54] hover:text-[#652278]">📞 {q.booking.customer.phone}</a>
            <a href={`mailto:${q.booking.customer.email}`} className="block text-sm text-[#514B54] hover:text-[#652278]">✉️ {q.booking.customer.email}</a>
            {q.booking.customer.whatsapp && (
              <a href={`https://wa.me/${q.booking.customer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-[#247A52] hover:underline">
                💬 WhatsApp
              </a>
            )}
          </div>

          {/* Notes */}
          {q.customerNotes && (
            <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5">
              <h2 className="font-semibold text-[#32113C] font-serif mb-2">Customer Notes</h2>
              <p className="text-sm text-[#514B54]">{q.customerNotes}</p>
            </div>
          )}
          {q.adminNotes && (
            <div className="bg-[#FFF4DF] rounded-2xl border border-[#F8EFD9] p-5">
              <h2 className="font-semibold text-[#A66514] font-serif mb-2 text-sm">🔒 Admin Notes</h2>
              <p className="text-sm text-[#514B54]">{q.adminNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

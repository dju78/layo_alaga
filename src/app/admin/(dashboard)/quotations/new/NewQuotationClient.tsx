'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

interface Booking {
  id: string;
  reference: string;
  eventType: string;
  customer: { name: string };
}

const DEFAULT_TERMS = `1. A 50% deposit is required to confirm your booking.
2. The remaining balance is due 7 days before the event date.
3. Cancellations made more than 30 days before the event will receive a 50% refund of the deposit.
4. Cancellations made within 14 days of the event are non-refundable.
5. All rental equipment remains the property of Alaga Alayo Events & Rentals.
6. The client is responsible for any loss or damage to rental items during the event.
7. Quotation is valid for 14 days from issue date.`;

export default function NewQuotationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillBookingId = searchParams.get('bookingId') ?? '';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingId, setBookingId] = useState(prefillBookingId);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [equipmentCharges, setEquipmentCharges] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [setupCharges, setSetupCharges] = useState(0);
  const [transportCosts, setTransportCosts] = useState(0);
  const [discounts, setDiscounts] = useState(0);
  const [tax, setTax] = useState(0);
  const [depositPercent, setDepositPercent] = useState(50);
  const [paymentDeadline, setPaymentDeadline] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState(DEFAULT_TERMS);
  const [customerNotes, setCustomerNotes] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/bookings?limit=100')
      .then(r => r.json())
      .then(d => setBookings(d.bookings ?? []));
  }, []);

  // Calculations
  const subtotal = serviceCharges + equipmentCharges + deliveryCharges + setupCharges + transportCosts - discounts;
  const taxAmount = Math.round(subtotal * (tax / 100));
  const total = subtotal + taxAmount;
  const deposit = Math.round(total * (depositPercent / 100));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!bookingId) { toast.error('Please select a booking'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId, serviceCharges, equipmentCharges, deliveryCharges,
          setupCharges, transportCosts, discounts, tax,
          depositRequired: deposit, paymentDeadline, expiryDate,
          termsAndConditions, customerNotes, adminNotes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Quotation ${data.quotation.quotationNumber} created!`);
        router.push(`/admin/quotations/${data.quotation.id}`);
      } else {
        toast.error(data.error ?? 'Failed to create quotation');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function LineItem({ label, value, className = '' }: { label: string; value: number; className?: string }) {
    return (
      <div className={`flex justify-between text-sm ${className}`}>
        <span className="text-[#514B54]">{label}</span>
        <span className="font-medium text-[#17131A]">₦{value.toLocaleString('en-NG')}</span>
      </div>
    );
  }

  function MoneyField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    return (
      <div>
        <label className="block text-xs font-medium text-[#514B54] mb-1">{label}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7E7781]">₦</span>
          <input
            type="number"
            min={0}
            value={value}
            onChange={e => onChange(parseInt(e.target.value) || 0)}
            className="w-full pl-7 pr-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB] text-[#17131A]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/quotations" className="p-2 rounded-xl hover:bg-[#F4F2F5] text-[#514B54] text-sm">← Back</Link>
        <h1 className="text-2xl font-bold text-[#32113C] font-serif">Create Quotation</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Booking selection */}
            <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5">
              <h2 className="font-semibold text-[#32113C] font-serif mb-4">Select Booking</h2>
              <select
                value={bookingId}
                onChange={e => setBookingId(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB] text-[#17131A]"
              >
                <option value="">— Select a booking —</option>
                {bookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.reference} — {b.customer.name} ({b.eventType})
                  </option>
                ))}
              </select>
            </div>

            {/* Charges */}
            <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5">
              <h2 className="font-semibold text-[#32113C] font-serif mb-4">Service & Equipment Charges</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MoneyField label="Service Charges (Alaga, MC, etc.)" value={serviceCharges} onChange={setServiceCharges} />
                <MoneyField label="Equipment / Rental Charges" value={equipmentCharges} onChange={setEquipmentCharges} />
                <MoneyField label="Delivery Charges" value={deliveryCharges} onChange={setDeliveryCharges} />
                <MoneyField label="Setup & Dismantling Charges" value={setupCharges} onChange={setSetupCharges} />
                <MoneyField label="Transport / Logistics Costs" value={transportCosts} onChange={setTransportCosts} />
                <MoneyField label="Discounts" value={discounts} onChange={setDiscounts} />
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={tax}
                    onChange={e => setTax(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB] text-[#17131A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Deposit Required (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={depositPercent}
                    onChange={e => setDepositPercent(parseFloat(e.target.value) || 50)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB] text-[#17131A]"
                  />
                </div>
              </div>
            </div>

            {/* Terms & notes */}
            <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5 space-y-4">
              <h2 className="font-semibold text-[#32113C] font-serif">Terms & Notes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Payment Deadline</label>
                  <input type="date" value={paymentDeadline} onChange={e => setPaymentDeadline(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Quotation Expiry Date</label>
                  <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Notes to Customer</label>
                <textarea value={customerNotes} onChange={e => setCustomerNotes(e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] resize-none bg-[#FAF7FB]" placeholder="Personalised note for the client…" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Internal Admin Notes</label>
                <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] resize-none bg-[#FAF7FB]" placeholder="Private notes (not shown to customer)…" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Terms & Conditions</label>
                <textarea value={termsAndConditions} onChange={e => setTermsAndConditions(e.target.value)} rows={8} className="w-full px-3 py-2.5 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] resize-none bg-[#FAF7FB] font-mono" />
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5 sticky top-20">
              <h2 className="font-semibold text-[#32113C] font-serif mb-4">Quotation Summary</h2>

              <div className="space-y-2.5">
                <LineItem label="Service Charges" value={serviceCharges} />
                <LineItem label="Equipment Charges" value={equipmentCharges} />
                <LineItem label="Delivery Charges" value={deliveryCharges} />
                <LineItem label="Setup Charges" value={setupCharges} />
                <LineItem label="Transport Costs" value={transportCosts} />
                {discounts > 0 && <LineItem label="Discounts" value={-discounts} className="text-[#247A52]" />}
                <div className="border-t border-[#E8E4E9] pt-2">
                  <LineItem label="Subtotal" value={subtotal} />
                  {tax > 0 && <LineItem label={`Tax (${tax}%)`} value={taxAmount} />}
                </div>
                <div className="border-t border-[#32113C] pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#32113C]">Total</span>
                    <span className="font-bold text-xl text-[#652278]">₦{total.toLocaleString('en-NG')}</span>
                  </div>
                </div>
                <div className="p-3 bg-[#FFF4DF] rounded-xl border border-[#F8EFD9]">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#A66514] font-medium">Deposit Required ({depositPercent}%)</span>
                    <span className="font-bold text-[#A66514]">₦{deposit.toLocaleString('en-NG')}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-5 py-3 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity shadow-lg shadow-[#32113C]/20"
              >
                {submitting ? 'Creating…' : 'Create Quotation'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

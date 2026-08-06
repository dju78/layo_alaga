'use client';

import { useState } from 'react';
import { recordQuotationDecision, submitDepositPayment } from '@/app/actions/quotation';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { CheckCircle2, XCircle, AlertCircle, Download, CreditCard, Building2, Sparkles, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  booking: any;
  quotation: any;
}

export default function QuotationViewClient({ booking, quotation }: Props) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CARD' | 'DEMO'>('DEMO');
  const [proofNote, setProofNote] = useState('');

  if (!quotation) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E8E4E9] text-center space-y-4 shadow-sm">
        <AlertCircle className="w-12 h-12 text-[#A66514] mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#32113C]">Quotation Under Preparation</h2>
        <p className="text-sm text-[#514B54]">
          Our administrator is currently preparing an official itemized quotation for booking reference <span className="font-mono font-bold">{booking.reference}</span>. You will be notified as soon as it is published.
        </p>
      </div>
    );
  }

  const handleDecision = async (decision: 'ACCEPTED' | 'REJECTED' | 'CHANGES_REQUESTED') => {
    setIsSubmitting(true);
    try {
      const res = await recordQuotationDecision(
        quotation.id,
        decision,
        booking.customer.name,
        comment
      );

      if (res.success) {
        toast.success(`Quotation ${decision.toLowerCase().replace('_', ' ')} successfully!`);
        if (decision === 'ACCEPTED') {
          setShowPaymentModal(true);
        } else {
          window.location.reload();
        }
      } else {
        toast.error(res.error || 'Failed to submit decision');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitDepositPayment(
        booking.id,
        quotation.id,
        quotation.depositRequired,
        paymentMethod,
        proofNote
      );

      if (res.success) {
        toast.success('Payment recorded successfully!');
        setShowPaymentModal(false);
        window.location.href = `/track/${booking.reference}`;
      } else {
        toast.error(res.error || 'Failed to record payment');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Quotation Document Header */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E4E9] shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-[#E8E4E9]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#652278] text-[#C99A3D] flex items-center justify-center font-serif font-bold text-sm">
                AA
              </div>
              <span className="font-serif text-2xl font-bold text-[#32113C]">ALAGA ALAYO</span>
            </div>
            <p className="text-xs text-[#7E7781] mt-1">Official Event Quotation • Version {quotation.version}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="font-mono text-xl font-bold text-[#652278]">{quotation.quotationNumber}</span>
            <p className="text-xs text-[#7E7781] mt-1">Date: {formatDate(quotation.createdAt)}</p>
          </div>
        </div>

        {/* Customer & Event Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm bg-[#FAF7FB] p-6 rounded-2xl border border-[#E8E4E9]">
          <div>
            <span className="text-xs text-[#7E7781] block font-semibold">PREPARED FOR</span>
            <p className="font-bold text-[#32113C] text-base mt-1">{booking.customer.name}</p>
            <p className="text-xs text-[#514B54]">{booking.customer.email}</p>
            <p className="text-xs text-[#514B54]">{booking.customer.phone}</p>
          </div>

          <div>
            <span className="text-xs text-[#7E7781] block font-semibold">EVENT SPECIFICATIONS</span>
            <p className="font-bold text-[#32113C] text-base mt-1">{booking.eventType}</p>
            <p className="text-xs text-[#514B54]">Date: {formatDate(booking.eventDate)}</p>
            <p className="text-xs text-[#514B54]">Venue: {booking.venueName}, {booking.city}</p>
          </div>
        </div>

        {/* Itemized Line Items */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#32113C]">Itemized Cost Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-[#E8E4E9] text-sm">
              <span className="font-medium text-[#17131A]">Professional Event Services (Alaga & MC)</span>
              <span className="font-bold text-[#32113C]">{formatCurrency(quotation.serviceCharges)}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-[#E8E4E9] text-sm">
              <span className="font-medium text-[#17131A]">Rental Equipment & Accessories</span>
              <span className="font-bold text-[#32113C]">{formatCurrency(quotation.equipmentCharges)}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-[#E8E4E9] text-sm">
              <span className="font-medium text-[#17131A]">Delivery, Logistics & Transport</span>
              <span className="font-bold text-[#32113C]">{formatCurrency(quotation.deliveryCharges + quotation.transportCosts)}</span>
            </div>

            <div className="flex justify-between py-3 border-b border-[#E8E4E9] text-sm">
              <span className="font-medium text-[#17131A]">On-Site Setup & Technical Handling</span>
              <span className="font-bold text-[#32113C]">{formatCurrency(quotation.setupCharges)}</span>
            </div>

            {quotation.discounts > 0 && (
              <div className="flex justify-between py-3 border-b border-[#E8E4E9] text-sm text-[#247A52]">
                <span className="font-medium">Special Package Discount</span>
                <span className="font-bold">-{formatCurrency(quotation.discounts)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary Box */}
        <div className="bg-[#FAF7FB] p-6 rounded-2xl border border-[#E8E4E9] space-y-3 text-right">
          <div className="flex justify-between text-base">
            <span className="font-bold text-[#32113C]">Total Quotation Amount:</span>
            <span className="font-serif text-2xl font-bold text-[#652278]">{formatCurrency(quotation.totalAmount)}</span>
          </div>

          <div className="flex justify-between text-sm text-[#247A52]">
            <span className="font-semibold">Required Deposit (50% to confirm date):</span>
            <span className="font-bold text-base">{formatCurrency(quotation.depositRequired)}</span>
          </div>

          <div className="flex justify-between text-sm text-[#A66514]">
            <span className="font-semibold">Outstanding Balance:</span>
            <span className="font-bold text-base">{formatCurrency(quotation.outstandingBalance)}</span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="pt-6 border-t border-[#E8E4E9] space-y-6">
          {quotation.status === 'SENT' || quotation.status === 'DRAFT' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Optional Comment / Request Changes Note:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter any comments or requested timeline modifications..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-[#D8D3DA] text-sm outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleDecision('ACCEPTED')}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex justify-center items-center gap-2 bg-[#247A52] hover:bg-[#1e6644] text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Accept Quotation & Pay Deposit
                </button>

                <button
                  onClick={() => handleDecision('CHANGES_REQUESTED')}
                  disabled={isSubmitting}
                  className="inline-flex justify-center items-center gap-2 bg-[#FFF4DF] text-[#A66514] hover:bg-[#A66514] hover:text-white px-5 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  Request Revision
                </button>

                <button
                  onClick={() => handleDecision('REJECTED')}
                  disabled={isSubmitting}
                  className="inline-flex justify-center items-center gap-2 bg-[#FDEBEC] text-[#B83B42] hover:bg-[#B83B42] hover:text-white px-5 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#E7F5EE] text-[#247A52] rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> This quotation has been accepted!
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <a
              href={`/api/pdf/quotation/${quotation.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#652278] hover:underline"
            >
              <Download className="w-4 h-4" /> Download Printable PDF Quotation
            </a>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex items-center gap-2 bg-[#652278] text-white text-xs font-semibold px-4 py-2 rounded-xl"
            >
              <CreditCard className="w-3.5 h-3.5" /> Pay Deposit Now
            </button>
          </div>
        </div>
      </div>

      {/* Deposit Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#32113C]">Deposit Payment Portal</h3>
            <p className="text-xs text-[#514B54]">
              Required 50% deposit amount: <span className="font-bold text-[#247A52] text-base">{formatCurrency(quotation.depositRequired)}</span>
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#514B54]">Select Payment Method:</label>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('DEMO')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 ${
                    paymentMethod === 'DEMO' ? 'border-[#652278] bg-[#F1E8F4] text-[#652278]' : 'border-[#D8D3DA]'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-[#C99A3D]" /> Demo / Instant
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('BANK_TRANSFER')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 ${
                    paymentMethod === 'BANK_TRANSFER' ? 'border-[#652278] bg-[#F1E8F4] text-[#652278]' : 'border-[#D8D3DA]'
                  }`}
                >
                  <Building2 className="w-5 h-5" /> Bank Transfer
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 ${
                    paymentMethod === 'CARD' ? 'border-[#652278] bg-[#F1E8F4] text-[#652278]' : 'border-[#D8D3DA]'
                  }`}
                >
                  <CreditCard className="w-5 h-5" /> Paystack / Card
                </button>
              </div>
            </div>

            {paymentMethod === 'BANK_TRANSFER' && (
              <div className="p-4 bg-[#FAF7FB] rounded-xl border border-[#E8E4E9] text-xs space-y-1">
                <p className="font-bold text-[#32113C]">Guaranty Trust Bank (GTBank)</p>
                <p>Account Name: Alaga Alayo Events Limited</p>
                <p className="font-mono font-bold text-[#652278]">Account #: 0123456789</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#514B54] mb-1">Transfer Reference / Notes:</label>
              <input
                type="text"
                placeholder="e.g. GTBank transfer from Temitope Adeleke"
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#D8D3DA] text-xs outline-none"
              />
            </div>

            <button
              onClick={handlePayment}
              disabled={isSubmitting}
              className="w-full bg-[#247A52] hover:bg-[#1e6644] text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md"
            >
              {isSubmitting ? 'Processing Payment...' : 'Confirm Deposit Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

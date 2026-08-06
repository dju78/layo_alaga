'use server';

import db from '@/lib/db';
import { BookingStatus, QuotationStatus, PaymentMethod, PaymentStatus, PaymentType } from '@prisma/client';
import { generatePaymentReference } from '@/lib/formatters';
import { sendNotification } from '@/lib/notifications';

export async function recordQuotationDecision(
  quotationId: string,
  decision: 'ACCEPTED' | 'REJECTED' | 'CHANGES_REQUESTED',
  customerName: string,
  comment?: string
) {
  try {
    const quotation = await db.quotation.findUnique({
      where: { id: quotationId },
      include: { booking: true },
    });

    if (!quotation) {
      return { success: false, error: 'Quotation not found' };
    }

    // 1. Record Decision
    await db.quotationDecision.create({
      data: {
        quotationId,
        decision,
        customerName,
        comment: comment || '',
        quotationVersion: quotation.version,
      },
    });

    // 2. Update Quotation Status
    let nextStatus: QuotationStatus = quotation.status;
    let nextBookingStatus: BookingStatus = quotation.booking.status;

    if (decision === 'ACCEPTED') {
      nextStatus = QuotationStatus.ACCEPTED;
      nextBookingStatus = BookingStatus.AWAITING_DEPOSIT;
    } else if (decision === 'REJECTED') {
      nextStatus = QuotationStatus.REJECTED;
      nextBookingStatus = BookingStatus.CANCELLED;
    } else if (decision === 'CHANGES_REQUESTED') {
      nextStatus = QuotationStatus.REVISED;
      nextBookingStatus = BookingStatus.CUSTOMER_REQUESTED_CHANGES;
    }

    await db.quotation.update({
      where: { id: quotationId },
      data: { status: nextStatus },
    });

    await db.booking.update({
      where: { id: quotation.bookingId },
      data: { status: nextBookingStatus },
    });

    await db.bookingStatusHistory.create({
      data: {
        bookingId: quotation.bookingId,
        previousStatus: quotation.booking.status,
        newStatus: nextBookingStatus,
        reason: `Customer ${decision.toLowerCase()} quotation. Comment: ${comment || 'None'}`,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error recording quotation decision:', error);
    return { success: false, error: error.message || 'Failed to submit decision' };
  }
}

export async function submitDepositPayment(
  bookingId: string,
  quotationId: string,
  amount: number,
  paymentMethod: 'BANK_TRANSFER' | 'CARD' | 'DEMO',
  proofNote?: string
) {
  try {
    const paymentRef = generatePaymentReference();

    const payment = await db.payment.create({
      data: {
        paymentReference: paymentRef,
        bookingId,
        quotationId,
        amount,
        paymentMethod: paymentMethod === 'CARD' ? PaymentMethod.CARD : paymentMethod === 'DEMO' ? PaymentMethod.DEMO : PaymentMethod.BANK_TRANSFER,
        paymentStatus: paymentMethod === 'DEMO' ? PaymentStatus.SUCCESSFUL : PaymentStatus.PENDING,
        paymentType: PaymentType.DEPOSIT,
        notes: proofNote || 'Customer deposit payment submitted online.',
      },
    });

    if (paymentMethod === 'DEMO') {
      // In demo mode, immediately confirm deposit & booking
      await db.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.BOOKING_CONFIRMED },
      });

      await db.quotation.update({
        where: { id: quotationId },
        data: { outstandingBalance: { decrement: amount } },
      });

      await db.bookingStatusHistory.create({
        data: {
          bookingId,
          previousStatus: BookingStatus.AWAITING_DEPOSIT,
          newStatus: BookingStatus.BOOKING_CONFIRMED,
          reason: 'Demo deposit payment completed and verified automatically.',
        },
      });
    } else {
      await db.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.AWAITING_DEPOSIT },
      });
    }

    return { success: true, paymentReference: paymentRef };
  } catch (error: any) {
    console.error('Error submitting payment:', error);
    return { success: false, error: error.message || 'Failed to process payment' };
  }
}

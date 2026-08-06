'use server';

import db from '@/lib/db';
import { generateBookingReference } from '@/lib/formatters';
import { sendNotification } from '@/lib/notifications';
import { BookingStatus } from '@prisma/client';

export interface BookingSubmissionData {
  // Step 1: Customer Details
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp?: string;
  preferredContact: string;

  // Step 2: Event Information
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  city: string;
  state: string;
  country?: string;
  expectedGuestCount: number;
  isOutdoor: boolean;
  preferredLanguage: string;
  eventColorTheme?: string;

  // Step 3: Selected Services
  serviceIds: string[];

  // Step 4: Selected Rentals & Logistics
  rentalQuantities: { [rentalItemId: string]: number };
  deliveryRequired: boolean;
  setupRequired: boolean;

  // Step 5: Additional Requirements
  notes?: string;
  specialRequests?: string;
  accessibilityRequirements?: string;
  referralSource?: string;
}

export async function submitBookingEnquiry(data: BookingSubmissionData) {
  try {
    // 1. Create or find customer by email
    let customer = await db.customer.findFirst({
      where: { email: data.customerEmail },
    });

    if (!customer) {
      customer = await db.customer.create({
        data: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
          whatsapp: data.customerWhatsapp || data.customerPhone,
          preferredContact: data.preferredContact || 'WhatsApp',
        },
      });
    }

    // 2. Generate unique booking reference & access token
    const reference = generateBookingReference();
    const eventDateObj = new Date(data.eventDate);

    // 3. Create Booking record
    const booking = await db.booking.create({
      data: {
        reference,
        customerId: customer.id,
        status: BookingStatus.ENQUIRY_RECEIVED,
        eventType: data.eventType,
        eventDate: eventDateObj,
        startTime: data.startTime || '10:00 AM',
        endTime: data.endTime || '04:00 PM',
        venueName: data.venueName,
        venueAddress: data.venueAddress,
        city: data.city,
        state: data.state,
        country: data.country || 'Nigeria',
        expectedGuestCount: Number(data.expectedGuestCount) || 100,
        isOutdoor: data.isOutdoor || false,
        preferredLanguage: data.preferredLanguage || 'English & Yoruba',
        eventColorTheme: data.eventColorTheme || '',
        notes: data.notes || '',
        specialRequests: data.specialRequests || '',
        accessibilityRequirements: data.accessibilityRequirements || '',
        referralSource: data.referralSource || 'Direct Web',
      },
    });

    // 4. Attach Selected Services
    if (data.serviceIds && data.serviceIds.length > 0) {
      for (const serviceId of data.serviceIds) {
        await db.bookingService.create({
          data: {
            bookingId: booking.id,
            serviceId,
          },
        });
      }
    }

    // 5. Create Rental Reservation & Reservation Items if rentals selected
    const rentalEntries = Object.entries(data.rentalQuantities || {}).filter(
      ([_, qty]) => qty > 0
    );

    if (rentalEntries.length > 0) {
      const reservation = await db.rentalReservation.create({
        data: {
          bookingId: booking.id,
          status: 'PENDING',
          startDate: eventDateObj,
          endDate: eventDateObj,
          deliveryRequired: data.deliveryRequired,
          setupRequired: data.setupRequired,
          deliveryAddress: `${data.venueName}, ${data.venueAddress}, ${data.city}`,
        },
      });

      for (const [rentalItemId, qty] of rentalEntries) {
        const item = await db.rentalItem.findUnique({ where: { id: rentalItemId } });
        if (item) {
          await db.rentalReservationItem.create({
            data: {
              reservationId: reservation.id,
              rentalItemId,
              quantity: qty,
              unitPrice: item.rentalPrice,
              refundableDeposit: item.refundableDeposit,
              subtotal: item.rentalPrice * qty,
            },
          });

          // Reserve quantity
          await db.rentalItem.update({
            where: { id: rentalItemId },
            data: {
              reservedQuantity: { increment: qty },
            },
          });
        }
      }
    }

    // 6. Record Status History
    await db.bookingStatusHistory.create({
      data: {
        bookingId: booking.id,
        previousStatus: BookingStatus.ENQUIRY_RECEIVED,
        newStatus: BookingStatus.ENQUIRY_RECEIVED,
        reason: 'Customer submitted booking enquiry online.',
        internalNote: 'Automated web booking enquiry.',
      },
    });

    // 7. Send/Log Notifications
    await sendNotification({
      recipientEmail: customer.email,
      type: 'BOOKING_ENQUIRY_RECEIVED',
      title: `Booking Enquiry Received - Ref ${reference}`,
      message: `Dear ${customer.name}, thank you for choosing Alaga Alayo Events & Rentals. Your booking enquiry (Ref: ${reference}) for ${data.eventType} on ${eventDateObj.toDateString()} has been received. We are preparing your quotation.`,
      channel: 'Email',
    });

    return {
      success: true,
      bookingReference: booking.reference,
      accessToken: booking.accessToken,
    };
  } catch (error: any) {
    console.error('Error submitting booking:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit booking enquiry',
    };
  }
}

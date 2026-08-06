const DEFAULT_WHATSAPP_NUMBER = '2348073021840';

export function getWhatsAppLink(message: string, phoneNumber: string = DEFAULT_WHATSAPP_NUMBER): string {
  // Strip non-numeric characters from phone
  let cleanPhone = phoneNumber.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '234' + cleanPhone.substring(1);
  }
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function getServiceEnquiryWhatsAppLink(serviceName: string): string {
  const text = `Hello Alaga Alayo, I am interested in your ${serviceName} service for my upcoming event. Please share more details and availability!`;
  return getWhatsAppLink(text);
}

export function getRentalEnquiryWhatsAppLink(itemName: string): string {
  const text = `Hello Alaga Alayo, I would like to enquire about renting the ${itemName} for my event.`;
  return getWhatsAppLink(text);
}

export function getBookingTrackerWhatsAppLink(reference: string): string {
  const text = `Hello Alaga Alayo, I am contacting you regarding my Booking Reference: ${reference}.`;
  return getWhatsAppLink(text);
}

export function getGeneralWhatsAppLink(): string {
  const text = `Hello Alaga Alayo, I would like to enquire about booking your services for my event.`;
  return getWhatsAppLink(text);
}

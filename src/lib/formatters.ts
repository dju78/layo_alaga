import { format } from 'date-fns';

export function formatCurrency(amount: number, currencyCode: string = 'NGN', currencySymbol: string = '₦'): string {
  // Format standard integer amount or minor units cleanly
  return `${currencySymbol}${amount.toLocaleString('en-NG')}`;
}

export function formatDate(date: Date | string | number, formatStr: string = 'PPP'): string {
  if (!date) return '';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(d, formatStr);
}

export function formatDateTime(date: Date | string | number): string {
  if (!date) return '';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

export function generateBookingReference(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `AA-${year}-${randomNum}`;
}

export function generateQuotationNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `QT-${year}-${randomNum}`;
}

export function generatePaymentReference(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `PAY-${year}-${randomNum}`;
}

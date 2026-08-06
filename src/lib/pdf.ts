import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate } from './formatters';

export function generateQuotationPDF(quotation: any): Buffer {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(50, 17, 60); // Deep Plum #32113C
  doc.rect(0, 0, 210, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ALAGA ALAYO EVENTS & RENTALS', 15, 20);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text('Your Event. My Passion.', 15, 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('OFFICIAL QUOTATION', 145, 20);

  // Business & Quotation Info
  doc.setTextColor(23, 19, 26);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Quotation #: ${quotation.quotationNumber}`, 145, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(quotation.createdAt)}`, 145, 54);
  doc.text(`Booking Ref: ${quotation.booking?.reference || 'N/A'}`, 145, 60);
  doc.text(`Status: ${quotation.status}`, 145, 66);

  // Customer Info
  doc.setFont('helvetica', 'bold');
  doc.text('PREPARED FOR:', 15, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(quotation.booking?.customer?.name || 'Valued Customer', 15, 54);
  doc.text(`Email: ${quotation.booking?.customer?.email || 'N/A'}`, 15, 60);
  doc.text(`Phone: ${quotation.booking?.customer?.phone || 'N/A'}`, 15, 66);
  doc.text(`Event Date: ${formatDate(quotation.booking?.eventDate)}`, 15, 72);
  doc.text(`Venue: ${quotation.booking?.venueName || 'N/A'}, ${quotation.booking?.city || ''}`, 15, 78);

  // Table Divider
  doc.setDrawColor(216, 211, 218);
  doc.line(15, 85, 195, 85);

  // Table Headers
  let y = 94;
  doc.setFillColor(241, 232, 244); // Soft Lavender
  doc.rect(15, y - 6, 180, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 17, 60);
  doc.text('Description', 20, y);
  doc.text('Amount (NGN)', 160, y, { align: 'right' });

  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(23, 19, 26);

  const lineItems = [
    { label: 'Professional Event Services', amount: quotation.serviceCharges },
    { label: 'Event Rental Equipment', amount: quotation.equipmentCharges },
    { label: 'Delivery & Transport Charges', amount: quotation.deliveryCharges + quotation.transportCosts },
    { label: 'Setup & Logistics', amount: quotation.setupCharges },
  ];

  if (quotation.discounts > 0) {
    lineItems.push({ label: 'Package Discount Applied', amount: -quotation.discounts });
  }

  lineItems.forEach((item) => {
    doc.text(item.label, 20, y);
    doc.text(formatCurrency(item.amount), 160, y, { align: 'right' });
    y += 8;
  });

  doc.line(15, y, 195, y);
  y += 10;

  // Summary Totals
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total Quotation Amount:', 110, y);
  doc.text(formatCurrency(quotation.totalAmount), 195, y, { align: 'right' });

  y += 8;
  doc.setTextColor(36, 122, 82); // Green
  doc.text('Required Deposit (50%):', 110, y);
  doc.text(formatCurrency(quotation.depositRequired), 195, y, { align: 'right' });

  y += 8;
  doc.setTextColor(166, 101, 20); // Amber
  doc.text('Outstanding Balance:', 110, y);
  doc.text(formatCurrency(quotation.outstandingBalance), 195, y, { align: 'right' });

  // Bank & Payment Instructions
  y += 20;
  doc.setFillColor(250, 247, 251);
  doc.rect(15, y, 180, 40, 'F');
  doc.setTextColor(50, 17, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT INSTRUCTIONS & BANK DETAILS', 20, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(23, 19, 26);
  doc.text('Bank Name: Guaranty Trust Bank (GTBank)', 20, y + 16);
  doc.text('Account Name: Alaga Alayo Events Limited', 20, y + 22);
  doc.text('Account Number: 0123456789', 20, y + 28);
  doc.text(`Reference Note: Please use quote reference ${quotation.quotationNumber} for transfers.`, 20, y + 34);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(126, 119, 129);
  doc.text('Alaga Alayo Events & Rentals • Tel: 0807 302 1840 / 0806 099 8745 • WhatsApp: 0807 302 1840', 105, 285, { align: 'center' });

  const pdfArrayBuffer = doc.output('arraybuffer');
  return Buffer.from(pdfArrayBuffer);
}

export function generateReceiptPDF(payment: any): Buffer {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(50, 17, 60);
  doc.rect(0, 0, 210, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ALAGA ALAYO EVENTS & RENTALS', 15, 20);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text('Your Event. My Passion.', 15, 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PAYMENT RECEIPT', 145, 20);

  // Receipt Info
  doc.setTextColor(23, 19, 26);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt #: ${payment.paymentReference}`, 145, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${formatDate(payment.createdAt)}`, 145, 54);
  doc.text(`Booking Ref: ${payment.booking?.reference || 'N/A'}`, 145, 60);

  // Customer Info
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIVED FROM:', 15, 48);
  doc.setFont('helvetica', 'normal');
  doc.text(payment.booking?.customer?.name || 'Valued Customer', 15, 54);
  doc.text(`Email: ${payment.booking?.customer?.email || 'N/A'}`, 15, 60);
  doc.text(`Phone: ${payment.booking?.customer?.phone || 'N/A'}`, 15, 66);

  // Receipt Details Card
  doc.setFillColor(231, 245, 238); // Soft Green
  doc.rect(15, 80, 180, 45, 'F');
  doc.setTextColor(36, 122, 82);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT CONFIRMED', 20, 92);

  doc.setTextColor(23, 19, 26);
  doc.setFontSize(11);
  doc.text(`Amount Paid: ${formatCurrency(payment.amount)}`, 20, 102);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Method: ${payment.paymentMethod}`, 20, 110);
  doc.text(`Payment Type: ${payment.paymentType}`, 20, 117);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(126, 119, 129);
  doc.text('Thank you for choosing Alaga Alayo Events & Rentals!', 105, 275, { align: 'center' });
  doc.text('Alaga Alayo Events & Rentals • Tel: 0807 302 1840 / 0806 099 8745 • WhatsApp: 0807 302 1840', 105, 285, { align: 'center' });

  const pdfArrayBuffer = doc.output('arraybuffer');
  return Buffer.from(pdfArrayBuffer);
}

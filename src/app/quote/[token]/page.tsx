import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import QuotationViewClient from './QuotationViewClient';

export const revalidate = 10;

export default async function SecureQuotationPage(
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const booking = await db.booking.findUnique({
    where: { accessToken: token },
    include: {
      customer: true,
      services: { include: { service: true } },
      reservations: { include: { items: { include: { rentalItem: true } } } },
      quotations: {
        orderBy: { version: 'desc' },
        take: 1,
        include: { decisions: true },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const latestQuotation = booking.quotations[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FB]">
      <Navbar />

      <main className="py-12 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuotationViewClient booking={booking} quotation={latestQuotation} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

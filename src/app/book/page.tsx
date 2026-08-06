import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import BookingFormClient from './BookingFormClient';

export const revalidate = 60;

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; step?: string }>;
}) {
  const { service, step } = await searchParams;

  const services = await db.service.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  });

  const rentalItems = await db.rentalItem.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FB]">
      <Navbar />

      <main className="py-12 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#652278]">
              Seamless Reservation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#32113C]">
              Book Your Event & Rentals
            </h1>
            <p className="text-sm text-[#514B54]">
              Complete this quick 6-step enquiry form to receive a formal quotation and lock in your date.
            </p>
          </div>

          <BookingFormClient
            services={services}
            rentalItems={rentalItems}
            preselectedServiceSlug={service}
            initialStep={step ? parseInt(step, 10) : 1}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

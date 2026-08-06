import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import RentalsCatalogueClient from './RentalsCatalogueClient';

export const revalidate = 60;

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;

  const categories = await db.rentalCategory.findMany({
    orderBy: { name: 'asc' },
  });

  const rentalItems = await db.rentalItem.findMany({
    where: {
      active: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    },
    include: {
      category: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header */}
      <section className="bg-[#32113C] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F8EFD9]">Pristine Event Gear</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">Equipment Rentals Catalogue</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Gold Chiavari chairs, Dior banquet seating, marquees, silent power generators, catering pots, and royal thrones.
          </p>
        </div>
      </section>

      {/* Interactive Catalogue Client Component */}
      <main className="py-12 bg-[#FAF7FB] flex-1">
        <RentalsCatalogueClient
          categories={categories}
          rentalItems={rentalItems}
          initialCategory={category}
          initialSearch={search}
        />
      </main>

      <Footer />
    </div>
  );
}

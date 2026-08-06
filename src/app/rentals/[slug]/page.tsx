import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import { formatCurrency } from '@/lib/formatters';
import { getRentalEnquiryWhatsAppLink } from '@/lib/whatsapp';
import { ArrowLeft, CheckCircle2, ShoppingBag, Shield, MessageCircle } from 'lucide-react';

export const revalidate = 60;

export default async function RentalDetailPage(
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const item = await db.rentalItem.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!item || !item.active) {
    notFound();
  }

  const imageArray = JSON.parse(item.images || '[]');
  const heroImg = imageArray[0] || 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="bg-[#FAF7FB] py-4 border-b border-[#E8E4E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/rentals" className="inline-flex items-center gap-2 text-sm text-[#652278] hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Rentals Catalogue
          </Link>
        </div>
      </div>

      <main className="py-12 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#652278] bg-[#F1E8F4] px-3 py-1 rounded-full">
                  {item.category.name}
                </span>
                <h1 className="font-serif text-4xl font-bold text-[#32113C] mt-3">
                  {item.name}
                </h1>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E8E4E9] bg-gray-50 h-80 sm:h-96">
                <img src={heroImg} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#32113C]">Equipment Description</h3>
                <p className="text-[#17131A] leading-relaxed text-base">
                  {item.description}
                </p>
              </div>

              {/* Specifications Card */}
              <div className="bg-[#FAF7FB] p-6 rounded-2xl border border-[#E8E4E9] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <span className="text-xs text-[#7E7781] block">Total Stock</span>
                  <span className="font-serif text-xl font-bold text-[#32113C]">{item.totalQuantity}</span>
                </div>
                <div>
                  <span className="text-xs text-[#7E7781] block">Available Now</span>
                  <span className="font-serif text-xl font-bold text-[#247A52]">{item.availableQuantity}</span>
                </div>
                <div>
                  <span className="text-xs text-[#7E7781] block">Condition</span>
                  <span className="font-serif text-lg font-bold text-[#32113C]">{item.condition}</span>
                </div>
                <div>
                  <span className="text-xs text-[#7E7781] block">Min Order</span>
                  <span className="font-serif text-xl font-bold text-[#32113C]">{item.minimumOrder}</span>
                </div>
              </div>
            </div>

            {/* Right Rental Booking Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-[#FAF7FB] p-8 rounded-2xl border border-[#E8E4E9] shadow-sm space-y-6">
                <div>
                  <span className="text-xs text-[#7E7781] block">Rental Rate</span>
                  <p className="font-serif text-3xl font-bold text-[#652278] mt-1">
                    {formatCurrency(item.rentalPrice)}
                  </p>
                  <span className="text-xs text-[#7E7781] block mt-1">{item.pricingUnit}</span>
                </div>

                <div className="space-y-2 text-xs text-[#514B54] pt-4 border-t border-[#E8E4E9]">
                  <div className="flex justify-between">
                    <span>Refundable Caution Deposit:</span>
                    <span className="font-bold text-[#32113C]">{formatCurrency(item.refundableDeposit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span className="font-bold text-[#32113C]">{formatCurrency(item.deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup Charge:</span>
                    <span className="font-bold text-[#32113C]">{formatCurrency(item.setupCharge)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#E8E4E9]">
                  <Link
                    href="/book?step=4"
                    className="w-full inline-flex justify-center items-center gap-2 bg-[#652278] hover:bg-[#7B328F] text-white py-4 rounded-xl font-bold text-base transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C99A3D]" /> Include in Booking Request
                  </Link>

                  <a
                    href={getRentalEnquiryWhatsAppLink(item.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center gap-2 bg-[#E7F5EE] text-[#247A52] hover:bg-[#247A52] hover:text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Enquire on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

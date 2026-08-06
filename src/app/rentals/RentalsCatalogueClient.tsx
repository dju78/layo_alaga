'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/formatters';
import { getRentalEnquiryWhatsAppLink } from '@/lib/whatsapp';
import { Search, ShoppingBag, Plus, Minus, Check, MessageCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface RentalItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string;
  totalQuantity: number;
  availableQuantity: number;
  rentalPrice: number;
  pricingUnit: string;
  refundableDeposit: number;
  minimumOrder: number;
  condition: string;
  category: {
    name: string;
    slug: string;
  };
}

interface Props {
  categories: Category[];
  rentalItems: RentalItem[];
  initialCategory?: string;
  initialSearch?: string;
}

export default function RentalsCatalogueClient({
  categories,
  rentalItems,
  initialCategory,
  initialSearch,
}: Props) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch || '');
  const [basket, setBasket] = useState<{ [itemId: string]: number }>({});

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    if (searchTerm) params.set('search', searchTerm);
    router.push(`/rentals?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    router.push(`/rentals?${params.toString()}`);
  };

  const updateQuantity = (item: RentalItem, delta: number) => {
    const current = basket[item.id] || 0;
    const nextQty = current + delta;

    if (nextQty > item.availableQuantity) {
      toast.error(`Cannot exceed maximum available quantity (${item.availableQuantity} units)`);
      return;
    }

    if (nextQty < 0) return;

    if (nextQty === 0) {
      const nextBasket = { ...basket };
      delete nextBasket[item.id];
      setBasket(nextBasket);
    } else {
      setBasket({ ...basket, [item.id]: nextQty });
    }
  };

  const basketItemCount = Object.keys(basket).length;
  const basketTotal = Object.entries(basket).reduce((sum, [itemId, qty]) => {
    const item = rentalItems.find((r) => r.id === itemId);
    return sum + (item ? item.rentalPrice * qty : 0);
  }, 0);

  const handleProceedToBooking = () => {
    if (basketItemCount === 0) {
      toast.error('Your rental basket is empty');
      return;
    }
    // Store selected rentals in localStorage for the booking form
    localStorage.setItem('alaga_rental_basket', JSON.stringify(basket));
    router.push('/book?step=4');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Search & Category Filter Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E4E9] shadow-sm space-y-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-[#7E7781]" />
            <input
              type="text"
              placeholder="Search equipment by name or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#D8D3DA] focus:border-[#652278] focus:ring-2 focus:ring-[#652278]/20 text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-[#652278] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#7B328F]"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === ''
                ? 'bg-[#652278] text-white'
                : 'bg-[#FAF7FB] text-[#514B54] hover:bg-[#F1E8F4]'
            }`}
          >
            All Equipment ({rentalItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-[#652278] text-white'
                  : 'bg-[#FAF7FB] text-[#514B54] hover:bg-[#F1E8F4]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Basket Drawer Bar if items selected */}
      {basketItemCount > 0 && (
        <div className="sticky top-24 z-40 bg-[#32113C] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C99A3D] text-[#32113C] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#F8EFD9]">
                {basketItemCount} Equipment {basketItemCount === 1 ? 'Item' : 'Items'} Selected
              </p>
              <p className="text-xs text-gray-300">
                Estimated Total: <span className="font-bold text-white">{formatCurrency(basketTotal)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleProceedToBooking}
            className="inline-flex items-center gap-2 bg-[#652278] hover:bg-[#7B328F] text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors shadow-sm"
          >
            Add to Event Booking <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Rental Grid */}
      {rentalItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E8E4E9] text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#7E7781] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#32113C]">No equipment matches your search</h3>
          <p className="text-sm text-[#514B54]">Try searching for standard items like chairs, tables, or generators.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalItems.map((item) => {
            const imageArray = JSON.parse(item.images || '[]');
            const itemImg = imageArray[0] || 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80';
            const selectedQty = basket[item.id] || 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E8E4E9] overflow-hidden shadow-sm card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 relative bg-gray-50">
                    <img src={itemImg} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-white/90 text-[#32113C] text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {item.category.name}
                    </span>
                    <span className="absolute bottom-3 left-3 bg-[#E7F5EE] text-[#247A52] text-xs font-semibold px-2.5 py-1 rounded-full">
                      {item.availableQuantity} In Stock
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-xl font-bold text-[#32113C]">{item.name}</h3>
                    <p className="text-xs text-[#514B54] line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-[#7E7781] pt-1">
                      <span>Condition: {item.condition}</span>
                      <span>Min order: {item.minimumOrder}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-4">
                  <div className="pt-3 border-t border-[#E8E4E9] flex items-center justify-between">
                    <div>
                      <span className="font-serif text-xl font-bold text-[#652278]">
                        {formatCurrency(item.rentalPrice)}
                      </span>
                      <span className="text-[11px] text-[#7E7781] block">{item.pricingUnit}</span>
                    </div>
                    <a
                      href={getRentalEnquiryWhatsAppLink(item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#E7F5EE] text-[#247A52] hover:bg-[#247A52] hover:text-white transition-colors"
                      title="Enquire on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Quantity Selector Controls */}
                  <div className="flex items-center justify-between bg-[#FAF7FB] p-2 rounded-xl border border-[#E8E4E9]">
                    <span className="text-xs font-semibold text-[#514B54] pl-2">Select Quantity:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item, -1)}
                        disabled={selectedQty === 0}
                        className="w-8 h-8 rounded-lg bg-white border border-[#D8D3DA] flex items-center justify-center text-[#32113C] hover:bg-[#F1E8F4] disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-sm text-[#32113C] w-6 text-center">
                        {selectedQty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item, 1)}
                        disabled={selectedQty >= item.availableQuantity}
                        className="w-8 h-8 rounded-lg bg-[#652278] text-white flex items-center justify-center hover:bg-[#7B328F] disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

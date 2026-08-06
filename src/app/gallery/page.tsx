import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';

export const revalidate = 60;

export default async function GalleryPage() {
  const galleryItems = await db.galleryItem.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-[#32113C] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F8EFD9]">Visual Portfolio</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">Event & Ceremony Gallery</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Moments of joy, traditional ceremony elegance, Eru Iyawo dowry displays, and banquet rental setups.
          </p>
        </div>
      </section>

      <main className="py-16 bg-[#FAF7FB] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E8E4E9] overflow-hidden shadow-sm card-hover flex flex-col">
                <div className="h-72 relative bg-gray-100 overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-white/95 text-[#32113C] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-serif text-xl font-bold text-[#32113C]">{item.title}</h3>
                  {item.caption && <p className="text-xs text-[#514B54]">{item.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

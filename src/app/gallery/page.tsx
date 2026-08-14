import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';

export const revalidate = 60;

const GALLERY_VIDEOS = [
  {
    src: '/videos/ayo-ayeni-ceremony-1.mp4',
    title: 'Traditional Engagement Ceremony',
    caption: 'A beautiful traditional engagement ceremony led by Alaga Alayo.',
  },
  {
    src: '/videos/ayo-ayeni-ceremony-2.mp4',
    title: 'Alaga Iduro Performance',
    caption: 'Omolayo Meseko performing the Alaga Iduro role with grace and authority.',
  },
  {
    src: '/videos/ayo-ayeni-ceremony-3.mp4',
    title: 'Cultural Celebration Highlights',
    caption: 'Vibrant moments from a Yoruba traditional wedding celebration.',
  },
  {
    src: '/videos/ayo-ayeni-ceremony-4.mp4',
    title: 'Event Day Highlights',
    caption: 'Behind the scenes and live moments from a premium event production.',
  },
];

export default async function GalleryPage() {
  let galleryItems: Array<{ id: string; title: string; caption: string | null; category: string; imageUrl: string }> = [];
  try {
    galleryItems = await db.galleryItem.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.warn('Database query failed for gallery items:', e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-[#32113C] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F8EFD9]">Visual Portfolio</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">Event &amp; Ceremony Gallery</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Moments of joy, traditional ceremony elegance, Eru Iyawo dowry displays, and banquet rental setups.
          </p>
        </div>
      </section>

      {/* ── Video Highlights ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C99A3D]">Watch &amp; Experience</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#32113C]">Video Highlights</h2>
            <p className="text-sm text-[#514B54] max-w-xl mx-auto">
              Watch real ceremony moments and event highlights captured on the day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GALLERY_VIDEOS.map((video, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8E4E9] overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="relative bg-black aspect-video">
                  <video
                    src={video.src}
                    controls
                    preload="metadata"
                    playsInline
                    className="w-full h-full object-contain"
                    poster=""
                  />
                  <span className="absolute top-3 left-3 bg-[#32113C]/80 text-[#F8EFD9] text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                    ▶ Video
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="font-serif text-xl font-bold text-[#32113C]">{video.title}</h3>
                  <p className="text-xs text-[#514B54]">{video.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Gallery ── */}
      <main className="py-16 bg-[#FAF7FB] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C99A3D]">Photo Gallery</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#32113C]">Event Photography</h2>
          </div>

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

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FAQPage() {
  const faqs = [
    {
      q: 'What is the difference between Alaga Iduro and Alaga Ijoko?',
      a: 'Alaga Iduro represents the Groom’s family (standing/presenting family), delivering the proposal letter and leading the groom’s entrance. Alaga Ijoko represents the Bride’s family (sitting/receiving family), managing the acceptance letter and unveiling the bride.',
    },
    {
      q: 'Can Alaga Alayo provide both Alaga Iduro and Alaga Ijoko for the same ceremony?',
      a: 'Yes! We offer a Combined Engagement Ceremony package where our synchronized team handles both Alaga roles seamlessly, ensuring perfect time management and entertaining family interactions.',
    },
    {
      q: 'How far in advance should I book my event date?',
      a: 'We recommend booking 2 to 6 months in advance, especially for peak wedding weekend dates in Lagos and surrounding states.',
    },
    {
      q: 'What is the deposit requirement to lock in a booking?',
      a: 'A 50% deposit is required upon accepting your official quotation. The remaining balance is due 48 hours prior to the event date.',
    },
    {
      q: 'How are rental equipment deliveries handled?',
      a: 'We manage full transport dispatch and setup at your venue. Our logistics team conducts pre-delivery inspections to ensure pristine condition.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-[#32113C] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F8EFD9]">Clear Guidance</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">Frequently Asked Questions</h1>
        </div>
      </section>

      <main className="py-16 bg-[#FAF7FB] flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E8E4E9] shadow-sm space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#32113C]">{faq.q}</h3>
              <p className="text-sm text-[#514B54] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

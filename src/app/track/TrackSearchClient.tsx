'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function TrackSearchClient() {
  const router = useRouter();
  const [reference, setReference] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) {
      toast.error('Please enter a booking reference number');
      return;
    }
    router.push(`/track/${reference.trim().toUpperCase()}`);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-3.5 text-[#7E7781]" />
        <input
          type="text"
          placeholder="e.g. AA-2026-1001"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-center font-mono font-bold text-base outline-none uppercase"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 bg-[#652278] hover:bg-[#7B328F] text-white py-3.5 rounded-xl font-bold text-sm transition-colors"
      >
        Track Booking <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

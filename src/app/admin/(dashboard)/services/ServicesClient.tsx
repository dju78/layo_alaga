'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import { toast } from 'sonner';

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  startingPrice: number;
  duration: string;
  active: boolean;
  featured: boolean;
}

export default function ServicesClient() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Traditional Wedding');
  const [startingPrice, setStartingPrice] = useState(0);
  const [duration, setDuration] = useState('Full Event Duration');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/services?admin=true');
    const data = await res.json();
    setServices(data.services ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  function openCreateModal() {
    setEditingService(null);
    setName('');
    setCategory('Traditional Wedding');
    setStartingPrice(100000);
    setDuration('Full Event Duration');
    setShortDescription('');
    setFullDescription('');
    setActive(true);
    setFeatured(false);
    setShowModal(true);
  }

  function openEditModal(s: ServiceItem) {
    setEditingService(s);
    setName(s.name);
    setCategory(s.category);
    setStartingPrice(s.startingPrice);
    setDuration(s.duration);
    setShortDescription(s.shortDescription);
    setFullDescription(s.fullDescription);
    setActive(s.active);
    setFeatured(s.featured);
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      name, slug, category, startingPrice, duration,
      shortDescription, fullDescription, active, featured
    };

    try {
      const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
      const method = editingService ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingService ? 'Service updated!' : 'Service created!');
        setShowModal(false);
        fetchServices();
      } else {
        toast.error('Failed to save service');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#32113C] font-serif">Services Catalogue</h1>
          <p className="text-sm text-[#7E7781]">{services.length} active and inactive services</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm"
        >
          + Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-2xl border border-[#E8E4E9] p-5 animate-pulse" />
          ))
        ) : services.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#7E7781] bg-white rounded-2xl border border-[#E8E4E9]">
            <p>No services added yet</p>
          </div>
        ) : (
          services.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5 flex flex-col justify-between hover:border-[#652278] transition-colors">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1E8F4] text-[#652278]">
                    {s.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {s.featured && <span className="text-xs bg-[#FFF4DF] text-[#A66514] font-semibold px-2 py-0.5 rounded-full">★ Featured</span>}
                    <span className={`w-2.5 h-2.5 rounded-full ${s.active ? 'bg-[#247A52]' : 'bg-[#7E7781]'}`} />
                  </div>
                </div>
                <h2 className="text-lg font-bold text-[#32113C] font-serif mt-1">{s.name}</h2>
                <p className="text-xs text-[#7E7781] mt-1 line-clamp-2">{s.shortDescription}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-[#F4F2F5] flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#7E7781]">Starting from</p>
                  <p className="text-lg font-bold text-[#652278]">₦{s.startingPrice.toLocaleString('en-NG')}</p>
                </div>
                <button
                  onClick={() => openEditModal(s)}
                  className="px-3 py-1.5 border border-[#652278] text-[#652278] hover:bg-[#652278] hover:text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#32113C] font-serif mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Service Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="e.g. Lead Alaga Iduro & Ijoko Duo"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  >
                    <option value="Traditional Wedding">Traditional Wedding</option>
                    <option value="Packaging & Props">Packaging & Props</option>
                    <option value="Master of Ceremony">Master of Ceremony</option>
                    <option value="Event Planning">Event Planning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Starting Price (₦)</label>
                  <input
                    type="number"
                    value={startingPrice}
                    onChange={e => setStartingPrice(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={e => setShortDescription(e.target.value)}
                  placeholder="Brief 1-sentence summary"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Full Description</label>
                <textarea
                  value={fullDescription}
                  onChange={e => setFullDescription(e.target.value)}
                  rows={3}
                  placeholder="Detailed breakdown of what this service covers…"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB] resize-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm text-[#514B54] cursor-pointer">
                  <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="rounded text-[#652278]" />
                  Active / Listed
                </label>
                <label className="flex items-center gap-2 text-sm text-[#514B54] cursor-pointer">
                  <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="rounded text-[#652278]" />
                  Featured Service
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-[#D8D3DA] text-[#514B54] rounded-xl text-sm hover:bg-[#F4F2F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

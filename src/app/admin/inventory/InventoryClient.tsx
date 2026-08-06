'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
}

interface RentalItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  category: Category;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  maintenanceQuantity: number;
  rentalPrice: number;
  pricingUnit: string;
  refundableDeposit: number;
  condition: string;
  active: boolean;
}

export default function InventoryClient() {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RentalItem | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(10);
  const [rentalPrice, setRentalPrice] = useState(1000);
  const [pricingUnit, setPricingUnit] = useState('per day');
  const [refundableDeposit, setRefundableDeposit] = useState(0);
  const [condition, setCondition] = useState('Excellent');
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (selectedCategory) qs.set('category', selectedCategory);
    const res = await fetch(`/api/admin/inventory?${qs}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setCategories(data.categories ?? []);
    setLoading(false);
  }, [selectedCategory]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  function openCreateModal() {
    setEditingItem(null);
    setName('');
    setCategoryId(categories[0]?.id ?? '');
    setDescription('');
    setTotalQuantity(50);
    setRentalPrice(1500);
    setPricingUnit('per day');
    setRefundableDeposit(500);
    setCondition('Excellent');
    setActive(true);
    setShowModal(true);
  }

  function openEditModal(item: RentalItem) {
    setEditingItem(item);
    setName(item.name);
    setCategoryId(item.categoryId);
    setDescription('');
    setTotalQuantity(item.totalQuantity);
    setRentalPrice(item.rentalPrice);
    setPricingUnit(item.pricingUnit);
    setRefundableDeposit(item.refundableDeposit);
    setCondition(item.condition);
    setActive(item.active);
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const payload = {
      name, slug, categoryId, description: description || name,
      totalQuantity, rentalPrice, pricingUnit, refundableDeposit,
      condition, active
    };

    try {
      const url = editingItem ? `/api/admin/inventory/${editingItem.id}` : '/api/admin/inventory';
      const method = editingItem ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingItem ? 'Item updated!' : 'Item added to inventory!');
        setShowModal(false);
        fetchInventory();
      } else {
        toast.error('Failed to save inventory item');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#32113C] font-serif">Rental Inventory</h1>
          <p className="text-sm text-[#7E7781]">{items.length} items in stock</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm"
        >
          + Add Inventory Item
        </button>
      </div>

      {/* Categories Filter */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] p-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!selectedCategory ? 'bg-[#652278] text-white' : 'bg-[#F4F2F5] text-[#514B54] hover:bg-[#E8E4E9]'}`}
        >
          All Categories
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === c.id ? 'bg-[#652278] text-white' : 'bg-[#F4F2F5] text-[#514B54] hover:bg-[#E8E4E9]'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7FB] border-b border-[#E8E4E9]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Item Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Stock (Total / Available)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Rental Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Condition</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2F5]">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-3 bg-[#F4F2F5] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#7E7781]">
                    <div className="text-3xl mb-2">📦</div>
                    <p>No inventory items found</p>
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="hover:bg-[#FAF7FB] transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-[#17131A]">{item.name}</td>
                    <td className="px-4 py-3.5 text-xs text-[#514B54]">
                      <span className="px-2 py-0.5 rounded bg-[#F1E8F4] text-[#652278] font-medium">{item.category.name}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-[#32113C]">{item.availableQuantity}</span> / <span className="text-[#7E7781]">{item.totalQuantity}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#652278]">
                      ₦{item.rentalPrice.toLocaleString('en-NG')} <span className="text-xs text-[#7E7781] font-normal">{item.pricingUnit}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#514B54]">{item.condition}</td>
                    <td className="px-4 py-3.5">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block ${item.active ? 'bg-[#247A52]' : 'bg-[#B83B42]'}`} />
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-xs text-[#652278] hover:underline font-semibold"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#32113C] font-serif mb-4">
              {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Item Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="e.g. Gold Chiavari Chair with Cushion"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Total Stock Quantity</label>
                  <input
                    type="number"
                    value={totalQuantity}
                    onChange={e => setTotalQuantity(parseInt(e.target.value) || 0)}
                    required
                    min={1}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Rental Price (₦)</label>
                  <input
                    type="number"
                    value={rentalPrice}
                    onChange={e => setRentalPrice(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Unit</label>
                  <input
                    type="text"
                    value={pricingUnit}
                    onChange={e => setPricingUnit(e.target.value)}
                    placeholder="per day"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#514B54] mb-1">Deposit (₦)</label>
                  <input
                    type="number"
                    value={refundableDeposit}
                    onChange={e => setRefundableDeposit(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-sm text-[#514B54] cursor-pointer">
                  <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="rounded text-[#652278]" />
                  Active in Inventory Catalogue
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
                  {submitting ? 'Saving…' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

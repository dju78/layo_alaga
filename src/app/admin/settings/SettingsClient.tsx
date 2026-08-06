'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsClient() {
  const [companyName, setCompanyName] = useState('Alaga Alayo Events & Rentals');
  const [phone, setPhone] = useState('+234 802 123 4567');
  const [whatsapp, setWhatsapp] = useState('+234 802 123 4567');
  const [email, setEmail] = useState('info@alagaalayo.com');
  const [address, setAddress] = useState('Lagos State, Nigeria');
  const [bankName, setBankName] = useState('Guaranty Trust Bank (GTBank)');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [accountName, setAccountName] = useState('Alaga Alayo Events Limited');

  const [saving, setSaving] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully!');
    }, 600);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-[#32113C] font-serif">Business Settings</h1>
        <p className="text-sm text-[#7E7781]">Configure brand profile, contact details, and payment bank account</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-[#32113C] font-serif text-lg">Company Profile</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Office Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Official Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Support Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
          </div>
        </div>

        {/* Bank Account Details for Invoices/Quotations */}
        <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-[#32113C] font-serif text-lg">Bank Transfer Account Details</h2>
          <p className="text-xs text-[#7E7781]">These details are displayed on quotation PDFs for direct bank transfers.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl font-semibold text-sm hover:opacity-90 shadow-md transition-opacity"
        >
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
}

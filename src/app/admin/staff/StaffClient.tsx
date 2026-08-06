'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

interface StaffProfile {
  id: string;
  fullName: string;
  roleTitle: string;
  phone: string;
  email: string;
  active: boolean;
  user: { email: string; role: string } | null;
  assignments: Array<{
    id: string;
    booking: { reference: string; eventDate: string; eventType: string };
  }>;
}

export default function StaffClient() {
  const [staffList, setStaffList] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('Lead Alaga Iduro');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/staff');
    const data = await res.json();
    setStaffList(data.staff ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, roleTitle, phone, email }),
      });

      if (res.ok) {
        toast.success('Staff profile added!');
        setShowModal(false);
        setFullName('');
        setPhone('');
        setEmail('');
        fetchStaff();
      } else {
        toast.error('Failed to create staff profile');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#32113C] font-serif">Staff & Coordinators</h1>
          <p className="text-sm text-[#7E7781]">{staffList.length} team members</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm"
        >
          + Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-[#E8E4E9] p-5 animate-pulse" />
          ))
        ) : staffList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#7E7781] bg-white rounded-2xl border border-[#E8E4E9]">
            <p>No staff profiles added yet</p>
          </div>
        ) : (
          staffList.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#652278] to-[#B84C73] flex items-center justify-center text-white text-base font-bold flex-shrink-0">
                  {s.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-[#32113C] font-serif">{s.fullName}</h2>
                  <p className="text-xs text-[#652278] font-medium">{s.roleTitle}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#F4F2F5] text-xs text-[#514B54]">
                <p className="flex items-center gap-2">📞 {s.phone}</p>
                <p className="flex items-center gap-2">✉️ {s.email}</p>
              </div>

              <div className="pt-2 border-t border-[#F4F2F5]">
                <p className="text-xs font-medium text-[#7E7781] mb-1">Active Event Assignments ({s.assignments.length})</p>
                {s.assignments.length === 0 ? (
                  <p className="text-xs text-[#7E7781]">No active assignments</p>
                ) : (
                  <div className="space-y-1">
                    {s.assignments.map(a => (
                      <div key={a.id} className="text-xs flex items-center justify-between bg-[#FAF7FB] p-2 rounded-lg">
                        <span className="font-mono text-[#652278] font-semibold">{a.booking.reference}</span>
                        <span className="text-[#514B54]">{new Date(a.booking.eventDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-[#32113C] font-serif mb-4">Add Staff Member</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Mrs. Funke Adeyemi"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Role Title</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  required
                  placeholder="e.g. Senior Alaga Iduro / Event Lead"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  placeholder="+234 802 345 6789"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#514B54] mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="funke@alagaalayo.com"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
                />
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
                  {submitting ? 'Saving…' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

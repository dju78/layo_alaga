'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface BookingCalendarEvent {
  id: string;
  reference: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  city: string;
  status: string;
  customer: { name: string; phone: string };
}

export default function CalendarClient() {
  const [events, setEvents] = useState<BookingCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/bookings?limit=100');
    const data = await res.json();
    setEvents(data.bookings ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function prevMonth() { setCurrentDate(new Date(year, month - 1, 1)); }
  function nextMonth() { setCurrentDate(new Date(year, month + 1, 1)); }
  function today() { setCurrentDate(new Date()); }

  // Group events by day of month
  const eventsByDay: Record<number, BookingCalendarEvent[]> = {};
  events.forEach(e => {
    const d = new Date(e.eventDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const dayNum = d.getDate();
      if (!eventsByDay[dayNum]) eventsByDay[dayNum] = [];
      eventsByDay[dayNum].push(e);
    }
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#32113C] font-serif">Event Schedule Calendar</h1>
          <p className="text-sm text-[#7E7781]">View traditional ceremonies and rental deliveries by date</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={today} className="px-3 py-1.5 bg-[#F1E8F4] text-[#652278] rounded-xl text-xs font-semibold hover:bg-[#652278] hover:text-white transition-colors">
            Today
          </button>
          <button onClick={prevMonth} className="px-3 py-1.5 border border-[#D8D3DA] rounded-xl text-xs hover:bg-[#F4F2F5]">
            ← Prev
          </button>
          <span className="font-bold text-[#32113C] text-sm font-serif min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="px-3 py-1.5 border border-[#D8D3DA] rounded-xl text-xs hover:bg-[#F4F2F5]">
            Next →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-[#E8E4E9] bg-[#FAF7FB] text-center text-xs font-semibold text-[#7E7781] py-3">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#F4F2F5]">
          {/* Empty padding days before first of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[100px] bg-[#FAF7FB]/50 p-2" />
          ))}

          {/* Days in month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayEvents = eventsByDay[dayNum] ?? [];
            const isToday = new Date().toDateString() === new Date(year, month, dayNum).toDateString();

            return (
              <div
                key={dayNum}
                className={`min-h-[110px] p-2 hover:bg-[#FAF7FB] transition-colors flex flex-col justify-between ${isToday ? 'bg-[#F1E8F4]/30' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isToday ? 'bg-[#652278] text-white' : 'text-[#32113C]'}`}>
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] bg-[#C99A3D] text-white font-bold px-1.5 py-0.5 rounded-full">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {dayEvents.map(ev => (
                    <Link
                      key={ev.id}
                      href={`/admin/bookings/${ev.id}`}
                      className="block p-1.5 rounded bg-[#32113C] text-white text-[11px] leading-tight hover:opacity-90 transition-opacity"
                    >
                      <p className="font-semibold truncate">{ev.eventType}</p>
                      <p className="text-[#C99A3D] text-[10px] truncate">{ev.customer.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

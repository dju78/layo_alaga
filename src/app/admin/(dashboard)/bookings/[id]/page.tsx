import BookingDetailClient from './BookingDetailClient';

export const metadata = {
  title: 'Booking Detail | Admin – Alaga Alayo',
};

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookingDetailClient bookingId={id} />;
}

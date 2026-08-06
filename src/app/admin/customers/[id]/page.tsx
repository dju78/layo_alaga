import CustomerDetailClient from './CustomerDetailClient';

export const metadata = {
  title: 'Customer Profile | Admin – Alaga Alayo',
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerDetailClient customerId={id} />;
}

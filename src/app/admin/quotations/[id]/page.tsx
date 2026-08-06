import QuotationDetailClient from './QuotationDetailClient';

export const metadata = {
  title: 'Quotation Detail | Admin – Alaga Alayo',
};

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <QuotationDetailClient quotationId={id} />;
}

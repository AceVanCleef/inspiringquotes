import { redirect } from 'next/navigation';

export default async function QuotesPreview({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
    const { id } = await params;
    redirect(`/quote/${id}`);
}
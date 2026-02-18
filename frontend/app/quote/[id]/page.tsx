import QuoteCard from "@/components/ui/atom/QuoteCard";
import { getQuote } from "@/lib/api";


export default async function QuotePreview({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const quoteId = parseInt(id);

    try {
        const quote = await getQuote(quoteId);
        return (
            <div className="max-w-2xl mx-auto py-20">
                <QuoteCard 
                    id={quote.id}
                    text={quote.text} 
                    author={quote.author} 
                    likes={quote.likes} />
            </div>
        )
    } catch(error) {
        return (
            <div className="text-center py-20">This quotes hasn't been found.</div>
        )
    }
}
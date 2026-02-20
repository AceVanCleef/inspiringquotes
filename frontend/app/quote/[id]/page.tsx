import QuoteCard from "@/components/ui/atom/QuoteCard";
import { Button } from "@/components/ui/button";
import { getQuote } from "@/lib/api";
import { MessageSquareOff } from "lucide-react";
import Link from "next/link";


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
            <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
            {/* Icon-Container passend zum Author-Error, aber mit anderer Farbe für Zitate */}
            <div className="rounded-full bg-amber-50 p-6 dark:bg-amber-900/20">
                <MessageSquareOff size={64} className="text-amber-500/80" strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Quote missing</h2>
                <p className="text-slate-500 max-w-[320px]">
                "Silence is golden, but this is too much." <br /> 
                We couldn't find the words you were looking for.
                </p>
            </div>

            <Button asChild variant="outline" className="mt-2">
                <Link href="/">
                    Back to the feed
                </Link>
            </Button>
            </div>
        );
    }
}
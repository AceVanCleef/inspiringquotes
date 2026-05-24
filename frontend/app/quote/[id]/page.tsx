import QuoteCard from "@/components/ui/atom/QuoteCard";
import { Button } from "@/components/ui/button";
import { getQuote } from "@/lib/api";
import { MessageSquareOff } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const quoteId = parseInt(id);

  try {
    const quote = await getQuote(quoteId);

    // Falls die API keinen Fehler wirft, aber das Zitat leer/null ist
    if (!quote) {
      return {
        title: 'Quote Not Found',
        description: 'The requested quote could not be found.',
      };
    }

    const authorName = quote.author 
      ? `${quote.author.first_name} ${quote.author.last_name}`
      : 'Unknown Author';
      
    const titleText = `Wisdom by ${authorName}`;
    const displayQuote = `"${quote.text}"`;

    return {
      // Wird im HTML zu: "Wisdom by Marcus Aurelius | inspiringquotes.ch"
      title: titleText,
      description: `${displayQuote} — Discover this and more curated wisdom on inspiringquotes.ch.`,
      
      openGraph: {
        url: `/quotes/${id}`, // Relativ dank deines metadataBase im Layout
        type: 'article', // Ein Zitat ist ein eigenständiger Inhalt (article)
        title: `${authorName} once said...`,
        description: displayQuote,
        // Optional: Wenn du ein dynamisches OG-Bild pro Zitat hast, hier rein.
        // Ansonsten greift das globale Standard-Bild aus dem Layout!
      },
    };
  } catch (error) {
    return {
      title: 'Quote Missing',
      description: 'We could not find the words you were looking for.',
    };
  }
}

export const dynamic = 'force-dynamic';

export default async function QuotePreview({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const quoteId = parseInt(id);

    try {
        const quote = await getQuote(quoteId);

        const authorName = quote.author 
            ? `${quote.author.first_name} ${quote.author.last_name}`
            : 'Unknown Author';

        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Quotation',
            'text': quote.text,
            'creator': {
            '@type': 'Person',
            'name': authorName,
            }
        };

        return (
            <div className="max-w-2xl mx-auto py-20">
                {/* SEO optimization */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <QuoteCard 
                    quote={quote} />
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
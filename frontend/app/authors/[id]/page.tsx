import QuoteCard from "@/components/ui/atom/QuoteCard";
import QuotesList from "@/components/ui/molecule/QuotesList";
import { getAuthor, getAuthorQuotes } from "@/lib/api";
import { Author } from "@/types/author";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default async function AuthorProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const [author, quotes] = await Promise.all([
        getAuthor(id),
        getAuthorQuotes(id)
    ]);

  return (
    <div className="container mx-auto py-10">
        <Link 
            href="/authors" 
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 w-fit"
        >←</Link>
        
        <header>
            <h1 className="text-4xl font-serif font-bold text-slate-900">
                {author.first_name} {author.last_name}
            </h1>
            <p className="text-slate-500 mt-2">{quotes?.length} Quotes of this author</p>
        </header>

        <QuotesList quotes={quotes} />
    </div>
  )
}
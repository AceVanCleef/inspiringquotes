import AuthorAvatar from "@/components/ui/atom/AuthorAvatar";
import QuotesListView from "@/components/ui/organisms/QuotesListView";
import { getAuthor, getAuthorQuotes } from "@/lib/api";
import { Author } from "@/types/author";
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
    <div className="container mx-auto">
        <Link 
          href="/authors" 
          className="text-xl group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 w-fit"
        >←</Link>
        
        <header>
          <div className="flex flex-row gap-4">
            <h1 className="text-4xl font-serif font-bold text-slate-900">
              {author.first_name} {author.last_name}
            </h1>
            <AuthorAvatar author={author} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {author.bio}
          </p>
          <p className="text-slate-500 mt-2">{quotes?.length} Quotes of this author</p>
        </header>

        <QuotesListView initialQuotes={quotes} authors={[author]} />
    </div>
  )
}
import AuthorAvatar from "@/components/ui/atom/AuthorAvatar";
import { Button } from "@/components/ui/button";
import QuotesListView from "@/components/ui/organisms/QuotesListView";
import { getAuthor, getAuthorQuotes } from "@/lib/api";
import { Author } from "@/types/author";
import { Ghost } from "lucide-react";
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

  if (!author) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        {/* Das Icon mit einer leichten Animation und feinerem Strich */}
        <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800">
          <Ghost size={64} className="text-slate-400 animate-pulse" strokeWidth={1.5} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Author not found</h2>
          <p className="text-slate-500 max-w-75">
            Oops! It looks like this author has vanished into thin air or never existed.
          </p>
        </div>

        <Button asChild variant="outline" className="mt-2">
          <Link href="/authors">
            Check out all authors
          </Link>
        </Button>
      </div>
    )
  }
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
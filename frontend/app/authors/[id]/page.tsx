import AuthorAvatar from "@/components/ui/atom/AuthorAvatar";
import { Button } from "@/components/ui/button";
import { LinkWidget } from "@/components/ui/molecule/LinkWidget";
import QuotesListView from "@/components/ui/organisms/QuotesListView";
import { getAuthor, getAuthorQuotes } from "@/lib/api";
import { Author } from "@/types/author";
import { Ghost } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  const author = await getAuthor(id);

  // Fallback, falls der Autor nicht existiert (wird vom Layout abgefangen)
  if (!author) {
    return {
      title: 'Author Not Found',
      description: 'The requested author could not be found.',
    };
  }

  const fullName = `${author.first_name} ${author.last_name}`;
  const shortBio = author.bio 
    ? `${author.bio.substring(0, 150)}...` 
    : `Read selected wisdom and quotes from ${fullName}.`;

  return {
    title: fullName,
    description: shortBio,
    
    openGraph: {
      // Nutzt das im Layout definierte metadataBase für absolute Pfade
      url: `/authors/${id}`,
      type: 'profile', // 'profile' ist das perfekte OG-Asset für Personen
      title: `${fullName} — Quotes & Wisdom`,
      description: shortBio,
      firstName: author.first_name,
      lastName: author.last_name,
    },
  };
}

export const dynamic = 'force-dynamic';

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

  const authorName = author 
    ? `${author.first_name} ${author.last_name}`
    : 'Unknown Author';
    
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    'mainEntity': {
      '@type': 'Person',
      'name': authorName,
      'description': author?.bio || `Curated quotes and wisdom from ${authorName}.`,
      'image': author?.profile_image_path,
      'sameAs': author?.links?.map(link => link.url) || [] // links Social-Media-Links
    }
  };

  if (!author) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        {/* SEO optimization */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 mb-4">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link 
            href="/authors" 
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span className="text-lg">←</span> Back to Authors
          </Link>
        </div>
      </div>
      <main className="container mx-auto px-4 max-w-5xl">
        {/* Header: Stolz und Klar */}
        <header className="flex flex-col md:flex-row gap-8 items-center md:items-end pb-10 pt-6">
          <div className="relative hidden md:block">
            {/* Ein subtiler Glow-Effekt hinter dem Avatar für mehr Tiefe */}
            <div className="absolute inset-0 bg-slate-200 blur-2xl rounded-full opacity-50 -z-10" />
            <div className="p-1.5 bg-white rounded-full shadow-2xl border border-slate-100 shrink-0">
              <AuthorAvatar author={author} className="w-32 h-32 md:w-40 md:h-40" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
              Featured Author
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-slate-900 leading-tight">
              {author.first_name} <span className="text-slate-400">{author.last_name}</span>
            </h1>
            <p className="text-slate-400 font-serif italic text-lg">
              {quotes?.length} Selected Wisdoms
            </p>
          </div>
        </header>

        {/* Content Grid: Bio & Links vs. Quotes */}
        <div className="grid grid-cols-1 gap-12 pt-10 border-t border-slate-100">
          
          {/* Seitenspalte: Die "Substanz" */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">About</h3>
              <p className="text-base text-slate-600 leading-relaxed font-light">
                {author.bio || "No biography available yet."}
              </p>
            </div>

            {author.links && author.links.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Connect</h3>
                <LinkWidget links={author.links} />
              </div>
            )}
          </aside>
        </div>
      </main>


      {/* Die Quotes Sektion: Deutlich abgegrenzt */}
      <section className="pt-12 border-t border-slate-200">
        {author?.first_name && (
          <h2 className="text-2xl font-serif font-semibold text-slate-800 mb-8">
            Wisdom from {author.first_name}
          </h2>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <QuotesListView initialQuotes={quotes} authors={[author]} />
        </div>
      </section>

    </div>
  )
}
import QuoteCard from '@/components/ui/atom/QuoteCard';
import QuotesList from '@/components/ui/molecule/QuotesList'
import { getDailyQuote, getPopularQuotes, getRecentQuotes } from '@/lib/api';

export default async function Home() {
  const [dailyQuote, popularQuotes, recentQuotes] = await Promise.all([
          getDailyQuote(),
          getPopularQuotes(),
          getRecentQuotes()
      ]);
      
  return (
    <main >
      <section className="pb-12 pt-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Quote of the Day
        </h2>
        <QuoteCard 
            id={dailyQuote.id}
            text={dailyQuote.text}
            authorName={`${dailyQuote.author.first_name} ${dailyQuote.author.last_name}`}
            likes={dailyQuote.likes} 
        />
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Most Popular Quotes
        </h2>
        <QuotesList quotes={popularQuotes} type='grid'/>
      </section>

      <section className="pb-12">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Most Recent Quotes
        </h2>
        <QuotesList quotes={recentQuotes} />
      </section>
    </main>
  )
}
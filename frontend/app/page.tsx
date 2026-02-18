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
    <main className='pt-4'>
      <section className="pb-12">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Quote of the Day
        </h2>
        <QuoteCard 
            id={dailyQuote.id}
            text={dailyQuote.text}
            author={dailyQuote.author}
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
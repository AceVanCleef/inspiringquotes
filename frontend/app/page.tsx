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
      <section>
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

      <section>
        <QuotesList quotes={popularQuotes} />
      </section>

      <section>
        <QuotesList quotes={recentQuotes} />
      </section>
    </main>
  )
}
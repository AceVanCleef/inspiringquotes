import QuoteList from '@/components/QuoteList'
import DailyQuoteSection from '@/components/ui/molecule/DailyQuoteSection'
import PopularQuotesSection from '@/components/ui/molecule/PopularQuotesSection'

export default function Home() {
  return (
    <main className="p-10 max-w-2xl mx-auto">
      <section>
          <DailyQuoteSection />
      </section>

      <section>
        <PopularQuotesSection />
      </section>
      
      <h1 className="text-3xl font-bold mb-6">Meine Weisheiten</h1>
      <QuoteList />
    </main>
  )
}
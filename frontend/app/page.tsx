import DailyQuoteSection from '@/components/ui/molecule/DailyQuoteSection'
import PopularQuotesSection from '@/components/ui/molecule/PopularQuotesSection'
import RecentQuotesSection from '@/components/ui/molecule/RecentQuotesSection'

export default function Home() {
  return (
    <main >
      <section>
          <DailyQuoteSection />
      </section>

      <section>
        <PopularQuotesSection />
      </section>

      <section>
        <RecentQuotesSection />
      </section>
    </main>
  )
}
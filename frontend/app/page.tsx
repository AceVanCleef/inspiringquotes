import QuoteList from '@/components/QuoteList'

export default function Home() {
  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meine Weisheiten</h1>
      <QuoteList />
    </main>
  )
}
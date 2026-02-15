"use client"

import { useQuery } from "@tanstack/react-query"
import { getRecentQuotes } from "@/lib/api"
import QuoteCard from "../atom/QuoteCard"

export default function RecentQuotesSection() {
  // 1. Daten vom Backend holen
  const { data, isLoading, isError } = useQuery({
    queryKey: ["quotes", "recent"],
    queryFn: getRecentQuotes
  })

  // 2. Loading State (Schön für die UX)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-xl" />
        ))}
      </div>
    )
  }

  // 3. Error State
  if (isError) {
    return <p className="text-rose-500">Konnte die Favoriten nicht laden.</p>
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
        Neueste Weisheiten
      </h2>
      
      {/* 4. Das Grid-Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.map((quote: any) => (
          <QuoteCard 
            key={quote.id}
            id={quote.id}
            text={quote.text}
            authorName={`${quote.author.first_name} ${quote.author.last_name}`}
            likes={quote.likes}
          />
        ))}
      </div>
    </section>
  )
}
"use client"

import { useQuery } from '@tanstack/react-query'
import { getDailyQuote } from "@/lib/api"
import QuoteCard from "../atom/QuoteCard"

export default function DailyQuoteSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['quotes', 'daily'],
    queryFn: getDailyQuote
  })

  if (isLoading) return <p>Lade Zitate...</p>
  if (isError) return <p>Backend nicht erreichbar?</p>
  if (!data) return null;
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Quote of the Day
      </h2>
      <QuoteCard 
          id={data.id}
          text={data.text}
          authorName={`${data.author.first_name} ${data.author.last_name}`}
          likes={data.likes} 
      />
    </div>
  )
}
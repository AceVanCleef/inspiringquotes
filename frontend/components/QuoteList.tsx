"use client"

import { useQuery } from '@tanstack/react-query'
import { getQuotes } from '@/lib/api'

export default function QuoteList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['quotes'], // Das ist der Name im DevTools Panel
    queryFn: getQuotes
  })

  if (isLoading) return <p>Lade Zitate...</p>
  if (isError) return <p>Backend nicht erreichbar?</p>

  return (
    <div className="space-y-4">
      {data?.map((quote: any) => (
        <div key={quote.id} className="p-4 border rounded-lg shadow-sm bg-white">
          <p className="text-lg italic">"{quote.text}"</p>
          <p className="text-sm font-bold mt-2">- {quote.author.first_name}</p>
        </div>
      ))}
    </div>
  )
}
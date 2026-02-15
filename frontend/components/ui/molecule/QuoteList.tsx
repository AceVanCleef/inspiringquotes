"use client"

import { useQuery } from '@tanstack/react-query'
import { getQuotes } from '@/lib/api'
import QuoteCard from '../atom/QuoteCard'

export default function QuoteList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['quotes'],
    queryFn: getQuotes
  })

  if (isLoading) return <p>Loading quotes...</p>
  if (isError) return <p>Did backend not respond?</p>

  return (
    <div className="space-y-4">
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
  )
}
"use client"

import { useQuery } from '@tanstack/react-query'
import { getQuotes } from '@/lib/api'
import QuoteCard from '../atom/QuoteCard'
import { cn } from "@/lib/utils";
import { Quote } from '@/types/quote';

interface QuotesListProps {
  type?: 'single-column' | 'grid'
  quotes: Quote[];
}

export default function QuotesList({ quotes, type='single-column' }: QuotesListProps) {
  if (!quotes || quotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
        <p className="text-slate-400 italic text-lg text-center">
          No quotes found.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full",
      type === 'single-column' && "space-y-4",
      type === 'grid' && "grid grid-cols-1 md:grid-cols-2 gap-8"
    )}>
      {quotes?.map((quote: any) => (
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
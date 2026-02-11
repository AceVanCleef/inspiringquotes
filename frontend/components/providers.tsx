"use client" // Wichtig!

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  // Wir erstellen den QueryClient einmalig pro Session
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Daten gelten 5 Minuten als "frisch"
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Das ist das kleine Logo unten rechts für deinen "Röntgenblick" */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
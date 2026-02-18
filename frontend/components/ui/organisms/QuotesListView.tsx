"use client"
import { useState } from "react";
import QuotesFilterBar from "../molecule/QuotesFilterBar";
import QuotesList from "../molecule/QuotesList";
import { Author } from "@/types/author";
import { Quote } from "@/types/quote";
import QuotesSortBar from "../molecule/QuotesSortBar";

interface QuotesListViewProps {
    initialQuotes: Quote[]; // Später durch dein Quote-Interface ersetzen
    authors: Author[];
    type?: 'single-column' | 'grid'
}

export default function QuotesListView({ initialQuotes, authors, type = 'single-column'}: QuotesListViewProps) {
    const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>(initialQuotes);
    const [displayQuotes, setDisplayQuotes] = useState<Quote[]>(initialQuotes);

    return (
        <div className="space-y-12">
            <QuotesFilterBar 
                initialQuotes={initialQuotes} 
                authors={authors} 
                onFilteredResults={setFilteredQuotes} 
            />

            <QuotesSortBar
                quotes={filteredQuotes}
                onSortResults={setDisplayQuotes} />

            <QuotesList quotes={displayQuotes} type={type} />
        </div>
    )
}
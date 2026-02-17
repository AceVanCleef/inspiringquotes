"use client"
import { useState } from "react";
import QuotesFilterBar from "../molecule/QuotesFilterBar";
import QuotesList from "../molecule/QuotesList";
import { Author } from "@/types/author";
import { Quote } from "@/types/quote";

interface QuotesListViewProps {
    initialQuotes: Quote[]; // Später durch dein Quote-Interface ersetzen
    authors: Author[];
}

export default function QuotesListView({ initialQuotes, authors}: QuotesListViewProps) {
    const [displayQuotes, setDisplayQuotes] = useState(initialQuotes);

    return (
        <div className="space-y-12">
            <QuotesFilterBar 
                initialQuotes={initialQuotes} 
                authors={authors} 
                onFilteredResults={setDisplayQuotes} 
            />

            <QuotesList quotes={displayQuotes} />
        </div>
    )
}
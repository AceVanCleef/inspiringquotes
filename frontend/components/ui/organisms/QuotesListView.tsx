"use client"
import { useMemo, useState } from "react";
import SearchInput from "../atom/SearchInput";
import QuotesList from "../molecule/QuotesList";
import { Author } from "@/types/author";
import { Quote } from "@/types/quote";
import QuotesSortBar from "../molecule/QuotesSortBar";
import SortSelect from "../atom/SortSelect";
import AuthorMultiSelect from "../molecule/AuthorMultiSelect";
import { SORT_OPTIONS, SortOption, sortSelectOptions } from "@/enums/sort_options";

interface QuotesListViewProps {
    initialQuotes: Quote[];
    authors: Author[];
    type?: 'single-column' | 'grid'
}

export default function QuotesListView({ initialQuotes, authors, type = 'single-column'}: QuotesListViewProps) {
    const [search, setSearch] = useState("");
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([]);
    const [sortType, setSortType] = useState<SortOption>(SORT_OPTIONS.DEFAULT);

    // filter pipeline
    const finalQuotes = useMemo(() => {
        return initialQuotes
            .filter(q => q.text.toLowerCase().includes(search.toLowerCase()))
            .filter(q => selectedAuthorIds.length === 0 || selectedAuthorIds.includes(q.author.id))
            .sort((a, b) => {
                switch (sortType) {
                    case SORT_OPTIONS.MOST_POPULAR:
                    return b.likes - a.likes;
                    case SORT_OPTIONS.LEAST_POPULAR:
                    return a.likes - b.likes;
                    case SORT_OPTIONS.NEWEST:
                    return b.id - a.id;
                    case SORT_OPTIONS.OLDEST:
                    return a.id - b.id;
                    case SORT_OPTIONS.ALPHA_ASC:
                    return a.text.localeCompare(b.text, 'en', { sensitivity: 'base' });
                    case SORT_OPTIONS.ALPHA_DESC:
                    return b.text.localeCompare(a.text, 'en', { sensitivity: 'base' });
                    case SORT_OPTIONS.DEFAULT:
                    return 0;
                    default:
                    return 0;
                }
            });
        }, [search, selectedAuthorIds, sortType, initialQuotes]);

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchInput value={search} onChange={setSearch} />
                <SortSelect<SortOption> value={sortType} onValueChange={setSortType} options={sortSelectOptions} />
            </div>

            <AuthorMultiSelect 
                authors={authors} 
                selectedIds={selectedAuthorIds} 
                onSelectedIdsChange={setSelectedAuthorIds} 
            />

            <QuotesList quotes={finalQuotes} type={type} />
        </div>
    )
}
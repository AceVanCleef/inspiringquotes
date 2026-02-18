"use client"
import { useMemo, useState } from "react";
import { RotateCcw, ListFilterPlus } from 'lucide-react';
import SearchInput from "../atom/SearchInput";
import QuotesList from "../molecule/QuotesList";
import { Author } from "@/types/author";
import { Quote } from "@/types/quote";
import SortSelect from "../atom/SortSelect";
import AuthorMultiSelect from "../molecule/AuthorMultiSelect";
import { SORT_OPTIONS, SortOption, sortSelectOptions } from "@/enums/sort_options";
import { Button } from "../button";

interface QuotesListViewProps {
    initialQuotes: Quote[];
    authors: Author[];
    type?: 'single-column' | 'grid'
}

export default function QuotesListView({ initialQuotes, authors, type = 'single-column'}: QuotesListViewProps) {
    const [search, setSearch] = useState("");
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([]);
    const [sortType, setSortType] = useState<SortOption>(SORT_OPTIONS.DEFAULT);

    // filter and sort pipeline
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

        const handleClearAll = () => {
            setSearch("");
            setSelectedAuthorIds([]);
            setSortType(SORT_OPTIONS.DEFAULT);
        };

        const isFiltered = search !== "" || selectedAuthorIds.length > 0 || sortType !== SORT_OPTIONS.DEFAULT;

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
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    {finalQuotes.length} Quotes found
                </p>
                
                {isFiltered && (
                    <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearAll}
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset filters
                    </Button>
                )}
            </div>

            <QuotesList quotes={finalQuotes} type={type} />
        </div>
    )
}
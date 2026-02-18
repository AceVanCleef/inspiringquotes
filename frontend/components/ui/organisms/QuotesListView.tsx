"use client"
import { useMemo, useState } from "react";
import { RotateCcw, ListFilterPlus, X } from 'lucide-react';
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
            setMoreFiltersShown(false); // closes extra filters
        };

        const isFiltered = search !== "" || selectedAuthorIds.length > 0 || sortType !== SORT_OPTIONS.DEFAULT;

        // showing more / less filters
        const [moreFiltersShown, setMoreFiltersShown] = useState(false);
        const [hasMoreFilters, setHasMoreFilters] = useState(authors.length > 1);

    return (
        <div className="space-y-4 pt-4">
            <div className="flex flex-col md:flex-row items-end gap-4 w-full">
                <div className="flex-1 w-full">
                    <SearchInput value={search} onChange={setSearch} />
                </div>

                <div className="flex-0 w-full flex flex-row gap-4 items-end justify-between">
                    <SortSelect<SortOption> value={sortType} onValueChange={setSortType} options={sortSelectOptions} />
                    
                    {hasMoreFilters && (
                        <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setMoreFiltersShown(!moreFiltersShown)}
                        title={moreFiltersShown ? "Less filters" : "More filters"}
                        className={`h-11 w-11 shrink-0 transition-all ${moreFiltersShown ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}
                        >
                            {moreFiltersShown ? <X className="h-5 w-5" /> : <ListFilterPlus className="h-5 w-5" />}
                    </Button>
                    )}
                </div>          
            </div>

            {moreFiltersShown && (
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <AuthorMultiSelect 
                        authors={authors} 
                        selectedIds={selectedAuthorIds} 
                        onSelectedIdsChange={setSelectedAuthorIds} 
                    />
                </div>
            )}

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
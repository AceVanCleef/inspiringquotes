"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"
import { Quote } from "@/types/quote"
import { useEffect, useMemo, useState } from "react"

export type SortOption = 
  | "newest" 
  | "oldest" 
  | "most-popular" 
  | "least-popular" 
  | "alpha-asc" 
  | "alpha-desc"
  | "default";
  
interface QuotesSortBarProps {
  quotes: Quote[];
  onSortResults: (sorted: Quote[]) => void;
}

export default function QuotesSortBar({ quotes, onSortResults }: QuotesSortBarProps) {
  const [sortType, setSortType] = useState<SortOption>("default");
  
  // Die Sortierung wird jedes Mal ausgeführt, wenn sich die Liste oder der Typ ändert
  useEffect(() => {
    const sorted = [...quotes].sort((a, b) => {
    switch (sortType) {
        case "most-popular":
        return b.likes - a.likes;
        case "least-popular":
        return a.likes - b.likes;
        case "newest":
        return b.id - a.id;
        case "oldest":
        return a.id - b.id;
        case "alpha-asc":
        return a.text.localeCompare(b.text, 'en', { sensitivity: 'base' });
        case "alpha-desc":
        return b.text.localeCompare(a.text, 'en', { sensitivity: 'base' });
        case "default":
        return 0;
        default:
        return 0;
    }
    });
    onSortResults(sorted);
  }, [quotes, sortType, onSortResults]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort:</span>
      <Select value={sortType} onValueChange={(value: SortOption) => setSortType(value)}>
        <SelectTrigger className="w-50 h-9 bg-white border-slate-200 text-xs shadow-sm focus:ring-rose-500">
            <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3 w-3 text-slate-400" />
            <SelectValue placeholder="Sort by..." />
            </div>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="default">-</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="most-popular">Most Popular (Likes)</SelectItem>
            <SelectItem value="least-popular">Secret Tipps (Likes)</SelectItem>
            <SelectItem value="alpha-asc">Alphabetical (A-Z)</SelectItem>
            <SelectItem value="alpha-desc">Alphabetical (Z-A)</SelectItem>
        </SelectContent>
        </Select>
    </div>
  );
}
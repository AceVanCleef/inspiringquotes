"use client"
import { getAuthors } from '@/lib/api'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Author } from "@/types/author"
import Link from "next/link"
import { useMemo, useState } from 'react'
import { SORT_OPTIONS, sortAuthorSelectOptions, SortOption } from '@/enums/sort_options'
import { Button } from '../button'
import { RotateCcw } from 'lucide-react'
import AuthorMultiSelect from './AuthorMultiSelect'
import SortSelect from '../atom/SortSelect'

interface AuthorTableProps {
    authors: Author[];
}

export default function AuthorTable({ authors }: AuthorTableProps) {
    const [selectedAuthorIds, setSelectedAuthorIds] = useState<number[]>([]);
    const [sortType, setSortType] = useState<SortOption>(SORT_OPTIONS.DEFAULT);

    // filter and sort pipeline
    const finalAuthors = useMemo(() => {
        return authors
            .filter(a => selectedAuthorIds.length === 0 || selectedAuthorIds.includes(a.id))
            .sort((a, b) => {
                switch (sortType) {
                    case SORT_OPTIONS.ALPHA_ASC:
                    return a.last_name.localeCompare(b.last_name, 'en', { sensitivity: 'base' });
                    case SORT_OPTIONS.ALPHA_DESC:
                    return b.last_name.localeCompare(a.last_name, 'en', { sensitivity: 'base' });
                    case SORT_OPTIONS.DEFAULT:
                    return 0;
                    default:
                    return 0;
                }
            });
    }, [selectedAuthorIds, sortType, authors])

    const handleClearAll = () => {
        setSelectedAuthorIds([]);
        setSortType(SORT_OPTIONS.DEFAULT);
    };

    const isFiltered = selectedAuthorIds.length > 0 || sortType !== SORT_OPTIONS.DEFAULT;
    
    return (
        <div className='flex flex-col gap-4'>
            <div className="p-4 flex flex-row items-center justify- gap-4 bg-slate-50/50 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className='flex-1'>
                    <AuthorMultiSelect 
                    authors={authors} 
                    selectedIds={selectedAuthorIds} 
                    onSelectedIdsChange={setSelectedAuthorIds} 
                    />
                </div>
            
                <div className="flex-none">
                    <SortSelect<SortOption> value={sortType} onValueChange={setSortType} options={sortAuthorSelectOptions} />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    {finalAuthors.length} Authors found
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
            
            <Table>
                <TableHeader className='hidden'>
                    <TableRow>
                        <TableHead className="text-slate-500">Author Name</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { finalAuthors.map((author: Author) => (
                        // Wir nutzen einen Link-Wrapper für die ganze Reihe
                        // Das ist besser für Accessibility und SEO
                        <TableRow key={author.id} className="group relative hover:bg-slate-50/50 transition-colors">
                            <TableCell className="py-6 text-lg tracking-tight">
                                <Link href={`/authors/${author.id}`} className="absolute inset-0 z-10">
                                    <span className="sr-only">View {author.first_name} {author.last_name}</span>
                                </Link>
                                <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                                    {author.first_name}
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                    {author.last_name}
                                </span>
                            </TableCell>
                            <TableCell className="text-right pointer-events-none">
                                <span className="inline-block transform -translate-x-2.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200 text-slate-300 text-2xl">
                                    →
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
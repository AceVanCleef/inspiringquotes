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

export default async function AuthorTable() {
    const authors = await getAuthors();

    if (!authors || authors.length === 0) return <p>No authors found.</p>

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-slate-500">Author Name</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { authors.map((author: Author) => (
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
    )
}
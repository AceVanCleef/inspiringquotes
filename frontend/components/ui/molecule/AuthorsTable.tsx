import { useQuery } from "@tanstack/react-query"
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


export default function AuthorTable() {
    const { data, isLoading, isError } = useQuery<Author[]>({
        queryKey: ['authors'],
        queryFn: getAuthors
      })
    
    if (isLoading) return <p>Loading authors...</p>
    if (isError) return <p>Did backend not respond?</p>

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Author Name</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                { data?.map((author: Author) => 
                    <TableRow key={author.id} className="group cursor-pointer hover:bg-slate-50/50">
                        <TableCell className="py-6 text-lg tracking-tight">
                            <span className="text-slate-400 group-hover:text-slate-900 transition-colors">
                            {author.first_name}
                            </span>{" "}
                            <span className="font-semibold text-slate-900">
                            {author.last_name}
                            </span>
                        </TableCell>
                        <TableCell className="text-right opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-slate-300 text-2xl">→</span>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
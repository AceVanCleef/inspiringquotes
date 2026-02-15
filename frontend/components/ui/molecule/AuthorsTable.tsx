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
                </TableRow>
            </TableHeader>
            <TableBody>
                { data?.map((author: Author) => 
                    <TableRow key={author.id}>
                        <TableCell className="py-4">
                            {author.first_name} <span className="font-bold">{author.last_name}</span>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
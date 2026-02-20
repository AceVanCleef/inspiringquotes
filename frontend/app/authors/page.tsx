import AuthorTable from "@/components/ui/molecule/AuthorsTable";
import { getAuthors } from "@/lib/api";

export default async function Authors() {
    const authors = await getAuthors();

    if (!authors || authors.length === 0) {
        return <p>No authors found.</p>
    }
    return (
        <div>
            <AuthorTable authors={authors} />
        </div>
    )
}
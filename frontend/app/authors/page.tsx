import AuthorTable from "@/components/ui/molecule/AuthorsTable";
import { getAuthors } from "@/lib/api";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Authors',
    openGraph: {
        url: '/authors',
    }
}


export const dynamic = 'force-dynamic';

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
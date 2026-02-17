import QuotesListView from '@/components/ui/organisms/QuotesListView';
import { getAuthors, getQuotes } from '@/lib/api';

export default async function Quotes() {
    const [initialQuotes, authors] = await Promise.all([
        getQuotes(),
        getAuthors() 
    ]);
    
    return (
        <div>
            <QuotesListView initialQuotes={initialQuotes} authors={authors} type='grid' />
        </div>
    )
}
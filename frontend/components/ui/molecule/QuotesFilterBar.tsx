"use client"
import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

import { Author } from "@/types/author";
import { Quote } from "@/types/quote";

interface QuotesFilterBarProps {
  initialQuotes: Quote[];
  authors: Author[];
  onFilteredResults: (filtered: Quote[]) => void;
}
export default function QuotesFilterBar({ 
  initialQuotes, 
  authors, 
  onFilteredResults 
}: QuotesFilterBarProps) {
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [search, setSearch] = React.useState("");
  const anchor = useComboboxAnchor();

  // Mapping für die Combobox: Wir brauchen Strings für die Interaktion
  const authorNames = authors.map(a => `${a.first_name} ${a.last_name}`);

  // Filter-Logik ausführen
  React.useEffect(() => {
    const filtered = initialQuotes.filter((quote) => {
      const matchesAuthor = 
        selectedIds.length === 0 || selectedIds.includes(quote.author.id);
      
      const matchesText = 
        quote.text.toLowerCase().includes(search.toLowerCase()) ||
        `${quote.author.first_name} ${quote.author.last_name}`.toLowerCase().includes(search.toLowerCase());

      return matchesAuthor && matchesText;
    });

    onFilteredResults(filtered);
  }, [selectedIds, search, initialQuotes, onFilteredResults]);

  // Hilfsfunktion: Namen der Chips in IDs umwandeln
  const handleAuthorChange = (names: string[]) => {
    const ids = names.map(name => 
      authors.find(a => `${a.first_name} ${a.last_name}` === name)?.id
    ).filter(Boolean) as number[];
    setSelectedIds(ids);
  };

  // Hilfsfunktion: IDs zurück in Namen für die Anzeige der Chips
  const currentSelectedNames = selectedIds.map(id => {
    const a = authors.find(author => author.id === id);
    return a ? `${a.first_name} ${a.last_name}` : "";
  }).filter(Boolean);

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* SHADCN COMBOBOX (Multi-Select) */}
          {authors.length > 1 && (
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                Authors (Multi-Select)
              </label>
              <Combobox
                multiple
                items={authorNames}
                value={currentSelectedNames}
                onValueChange={handleAuthorChange}
              >
                <ComboboxChips ref={anchor} className="w-full bg-white border-slate-200 min-h-11">
                  <ComboboxValue>
                    {(values) => (
                      <React.Fragment>
                        {values.map((value: string) => (
                          <ComboboxChip key={value} className="bg-slate-900 text-white border-none">
                            {value}
                          </ComboboxChip>
                        ))}
                        <ComboboxChipsInput placeholder="Search authors..." />
                      </React.Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>No author found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          )}

        {/* TEXT-SUCHE */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
            Stichwort
          </label>
          <input
            type="text"
            placeholder="Search in quotes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 px-4 bg-white border border-slate-200 rounded-md outline-none focus:ring-2 ring-slate-100 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
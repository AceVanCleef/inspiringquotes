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
import { Author } from "@/types/author"

interface AuthorMultiSelectProps {
  authors: Author[];
  selectedIds: number[];
  onSelectedIdsChange: (ids: number[]) => void;
}

export default function AuthorMultiSelect({ 
  authors, 
  selectedIds, 
  onSelectedIdsChange 
}: AuthorMultiSelectProps) {
  const anchor = useComboboxAnchor();

  // Mapping: IDs -> Namen für die UI
  const currentSelectedNames = selectedIds
    .map(id => {
      const a = authors.find(author => author.id === id);
      return a ? `${a.first_name} ${a.last_name}` : "";
    })
    .filter(Boolean);

  const authorNames = authors.map(a => `${a.first_name} ${a.last_name}`);

  // Event-Handler: Namen zurück in IDs wandeln und nach oben melden
  const handleAuthorChange = (names: string[]) => {
    const ids = names
      .map(name => authors.find(a => `${a.first_name} ${a.last_name}` === name)?.id)
      .filter(Boolean) as number[];
    onSelectedIdsChange(ids);
  };

  if (authors.length <= 1) return null;

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
        Authors
      </label>
      <Combobox
        multiple
        items={authorNames}
        value={currentSelectedNames}
        onValueChange={handleAuthorChange}
      >
        <ComboboxChips ref={anchor} className="w-full bg-white border-slate-200 min-h-11 shadow-sm">
          <ComboboxValue>
            {(values) => (
              <React.Fragment>
                {values.map((value: string) => (
                  <ComboboxChip key={value} className="bg-slate-900 text-white border-none">
                    {value}
                  </ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder="Filter by author..." />
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
  );
}
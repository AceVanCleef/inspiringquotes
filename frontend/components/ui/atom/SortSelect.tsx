"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"

export interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: { value: T; label: string }[];
  label?: string;
}

export default function SortSelect<T extends string>({ value, onValueChange, options, label = "Sort:" }: SortSelectProps<T>) {
  return (
    <div>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <Select value={value} onValueChange={(val) => onValueChange(val as T)}>
        <SelectTrigger className="w-48 h-9 bg-white border-slate-200 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3 w-3 text-slate-400" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
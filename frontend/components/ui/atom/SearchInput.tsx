"use client"
import * as React from "react"
import { Search } from "lucide-react"

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Search in quotes..." 
}: SearchInputProps) {
  
  return (
    <div className="space-y-2 w-full">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
        Stichwort
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-md outline-none focus:ring-2 ring-slate-100 transition-all text-slate-700"
        />
      </div>
    </div>
  );
}
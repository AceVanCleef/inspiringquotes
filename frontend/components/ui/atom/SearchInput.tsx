"use client"
import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Search..." 
}: SearchInputProps) {
  
  return (
<div className="space-y-2 w-full">
      <Label 
        className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1"
      >
        Keyword
      </Label>
      
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 bg-white border-slate-200 focus-visible:ring-rose-500/20 focus-visible:border-rose-500 transition-all"
        />
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook für die aktuelle Route
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils"; // Shadcn Utility für Klassen-Merging

export function MobileNavLink({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SheetClose asChild>
      <Link
        href={href}
        className={cn(
          "text-lg font-medium transition-colors py-2 border-l-4 pl-3",
          isActive 
            ? "text-rose-500 border-rose-500 bg-rose-50/50" // Aktiv-Stil
            : "text-slate-600 border-transparent hover:text-slate-900" // Normal-Stil
        )}
      >
        {children}
      </Link>
    </SheetClose>
  );
}
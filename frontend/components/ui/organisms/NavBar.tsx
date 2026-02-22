"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import GenericSheet from "../molecule/GenericSheet"
import { Button } from "../button"
import { Menu } from "lucide-react"
import { SheetClose } from "../sheet"
import { MobileNavLink } from "../atom/MobileNavLink"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Quotes", href: "/quotes" },
    { name: "Authors", href: "/authors" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo / Name der Seite */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-serif font-bold tracking-tight text-slate-900">
            Inspiring Quotes<span className="text-rose-500 text-sm">.ch</span>
          </span>
        </Link>

        {/* Mobile Navigation */}
      <GenericSheet
        side="left"
        trigger={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        }
        title="Navigation"
      >
        <div className="flex flex-col gap-4 mt-4 px-4">
          <MobileNavLink href={"/"}>
            Home
          </MobileNavLink>
          <MobileNavLink href={"/quotes"}>
            Quotes
          </MobileNavLink>
          <MobileNavLink href={"/authors"}>
            Authors
          </MobileNavLink>
        </div>
      </GenericSheet>

      {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-slate-900",
                pathname === item.href 
                  ? "text-slate-900 underline underline-offset-8 decoration-2" 
                  : "text-slate-500"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Platzhalter für später (z.B. User-Icon oder Search) */}
        <div className="hidden md:block w-10"></div>
      </div>
    </nav>
  )
}
"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";

interface GenericSheetProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export default function GenericSheet({
  trigger,
  title,
  description,
  children,
  side = "right", // Standardmäßig von rechts
  className,
}: GenericSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side={side} className={className}>
        {(title || description) && (
          <SheetHeader className="mb-6">
            {title && <SheetTitle className="text-2xl font-bold">{title}</SheetTitle>}
            {description && (
              <SheetDescription>{description}</SheetDescription>
            )}
          </SheetHeader>
        )}
        
        {/* Der Inhalt des Sheets */}
        <div className="flex flex-col h-full">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
import { ExternalLink } from "lucide-react";
import { DynamicIcon } from "../atom/DynamicIcon";
import { Link } from "@/types/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

export interface LinkWidgetProps {
    links: Link[];
}

export function LinkWidget({ links }: LinkWidgetProps) {
  if (!links || links.length === 0) return null;

  return (
    <TooltipProvider>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
        {links.map((link: Link) => (
            <Tooltip key={link.id}>
                <TooltipTrigger asChild>
                    <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group"
                    >
                    {/* Icon vom Link-Typ */}
                    <div className="shrink-0 text-slate-500 group-hover:text-slate-900">
                        <DynamicIcon name={link.link_type?.name || "Link"} size={20} />
                    </div>

                    {/* Label mit Truncate-Logik */}
                    <span className="flex-1 text-sm font-medium text-slate-700 truncate">
                        {link.label || link.link_type?.name || "Link"}
                    </span>

                    {/* Kleiner Hinweis-Pfeil (optional) */}
                    <ExternalLink size={14} className="text-slate-300 group-hover:text-slate-500 shrink-0" />
                    </a>
                </TooltipTrigger>
                <TooltipContent>
                    {link.url}
                </TooltipContent>
            </Tooltip>
        ))}
        </div>
    </TooltipProvider>
  );
}
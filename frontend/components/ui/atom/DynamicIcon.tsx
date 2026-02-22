import * as Icons from "lucide-react";

const CustomIcons: Record<string, React.FC<any>> = {
  tiktok: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  ),
  x: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  )
};

interface DynamicIconProps {
  name?: string; // Der Name aus deiner DB, z.B. "Instagram"
  size?: number;
  className?: string;
}

export const DynamicIcon = ({ name, size = 20, className = "text-slate-400" }: DynamicIconProps) => {
    if (!name) return <Icons.Link size={size} className={className} />;
    const lowerName = name.toLowerCase();

    // 1. Check Custom Icons
    if (CustomIcons[lowerName]) {
        const CustomIcon = CustomIcons[lowerName];
        return <CustomIcon size={size} className={className} />;
    }

    // 2. Mapping für Spezialfälle
    const mapping: Record<string, string> = {
        website: "Globe",
        web: "Globe",
        blog: "BookOpen",
        twitter: "x" // Falls du alte Daten hättest, die noch Twitter heißen
    };

    const lookupName = mapping[lowerName] || lowerName;

    // 3. Lucide Suche (Case-Insensitive)
    // Wir müssen durch die Icons loopen, da Lucide Keys Case-Sensitive sind (z.B. "Instagram")
    const lucideKey = Object.keys(Icons).find(
        (key) => key.toLowerCase() === lookupName.toLowerCase()
    );

    if (lucideKey) {
    const LucideIcon = (Icons as any)[lucideKey];
        return <LucideIcon size={size} className={className} />;
    }

    // 4. Fallback
    return <Icons.Link size={size} className={className} />;
};
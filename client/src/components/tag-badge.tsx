import { cn } from "@/lib/utils";
import type { Tag } from "@shared/schema";

interface TagBadgeProps {
  tag: string | Tag;
  tagGroup?: string;
  className?: string;
  onRemove?: () => void;
}

const groupColors: Record<string, string> = {
  Vibe: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Logistics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Risk: "bg-red-500/10 text-red-400 border-red-500/20",
  Admin: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export function TagBadge({ tag, tagGroup, className, onRemove }: TagBadgeProps) {
  const tagName = typeof tag === "string" ? tag : tag.tagName;
  const group = tagGroup || (typeof tag === "object" ? tag.tagGroup : undefined);
  const colorClass = group ? groupColors[group] : "bg-muted text-muted-foreground border-border";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
        colorClass,
        className
      )}
      data-testid={`tag-${tagName.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {tagName}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:text-foreground transition-colors"
          data-testid={`button-remove-tag-${tagName.toLowerCase().replace(/\s+/g, "-")}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

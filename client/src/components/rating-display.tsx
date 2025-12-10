import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number | null | undefined;
  maxRating?: number;
  className?: string;
  showNumber?: boolean;
}

export function RatingDisplay({
  rating,
  maxRating = 5,
  className,
  showNumber = false,
}: RatingDisplayProps) {
  const numericRating = rating ?? 0;
  const displayRating = Math.round(numericRating * 10) / 10;

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      data-testid="rating-display"
    >
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < Math.floor(numericRating)
              ? "fill-yellow-400 text-yellow-400"
              : i < numericRating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-muted-foreground/30"
          )}
        />
      ))}
      {showNumber && numericRating > 0 && (
        <span className="ml-1 text-xs text-muted-foreground">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

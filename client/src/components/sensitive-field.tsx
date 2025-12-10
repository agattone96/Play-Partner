import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SensitiveFieldProps {
  value: string | null | undefined;
  label?: string;
  className?: string;
}

export function SensitiveField({ value, label, className }: SensitiveFieldProps) {
  const [revealed, setRevealed] = useState(false);

  if (!value) {
    return (
      <span className={cn("text-muted-foreground italic text-sm", className)}>
        Not provided
      </span>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}:
        </span>
      )}
      <span
        className={cn(
          "font-mono text-sm transition-all duration-200",
          !revealed && "blur-sm select-none"
        )}
        data-testid="sensitive-value"
      >
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => setRevealed(!revealed)}
        data-testid="button-reveal-sensitive"
      >
        {revealed ? (
          <EyeOff className="h-3.5 w-3.5" />
        ) : (
          <Eye className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}

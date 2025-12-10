import { Skull, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  isBlacklisted?: boolean;
  hasRiskFlag?: boolean;
  hasConflict?: boolean;
  className?: string;
}

export function RiskBadge({
  isBlacklisted,
  hasRiskFlag,
  hasConflict,
  className,
}: RiskBadgeProps) {
  if (isBlacklisted) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium blacklisted-badge",
          className
        )}
        data-testid="badge-blacklisted"
      >
        <Skull className="h-3 w-3" />
        Blacklisted
      </span>
    );
  }

  if (hasRiskFlag) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20",
          className
        )}
        data-testid="badge-risk"
      >
        <AlertTriangle className="h-3 w-3" />
        Risk
      </span>
    );
  }

  if (hasConflict) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium conflict-badge",
          className
        )}
        data-testid="badge-conflict"
      >
        <AlertTriangle className="h-3 w-3" />
        Conflict
      </span>
    );
  }

  return null;
}

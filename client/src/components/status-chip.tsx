import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusChipProps {
  status: string;
  className?: string;
  showLock?: boolean;
}

const statusStyles: Record<string, string> = {
  "New Prospect": "status-new-prospect",
  "Contacted": "status-contacted",
  "Ready for Vetting": "status-ready-for-vetting",
  "Vetted": "status-vetted",
  "Active": "status-active",
  "On Pause": "status-on-pause",
  "Retired": "status-retired",
  "Do Not Engage": "status-do-not-engage",
};

export function StatusChip({ status, className, showLock }: StatusChipProps) {
  const styleClass = statusStyles[status] || "status-new-prospect";
  const isDoNotEngage = status === "Do Not Engage";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap",
        styleClass,
        className
      )}
      data-testid={`status-chip-${status.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {(isDoNotEngage || showLock) && <Lock className="h-3 w-3" />}
      {status}
    </span>
  );
}

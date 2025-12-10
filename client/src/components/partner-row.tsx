import { Link } from "wouter";
import { MoreHorizontal, ClipboardPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusChip } from "@/components/status-chip";
import { RatingDisplay } from "@/components/rating-display";
import { LogisticsIcons } from "@/components/logistics-icons";
import { RiskBadge } from "@/components/risk-badge";
import { cn } from "@/lib/utils";
import type { PartnerWithComputed } from "@shared/schema";

interface PartnerRowProps {
  partner: PartnerWithComputed;
  onQuickAssess?: (partnerId: number) => void;
  className?: string;
}

export function PartnerRow({ partner, onQuickAssess, className }: PartnerRowProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-4 px-4 py-3 hover-elevate rounded-md transition-colors",
        partner.riskFlag && "risk-indicator",
        className
      )}
      data-testid={`partner-row-${partner.id}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/partners/${partner.id}`}>
            <span className="font-medium hover:underline cursor-pointer" data-testid={`link-partner-${partner.id}`}>
              {partner.fullName}
            </span>
          </Link>
          {partner.nickname && (
            <span className="text-sm text-muted-foreground">
              ({partner.nickname})
            </span>
          )}
        </div>
        {partner.city && (
          <p className="text-sm text-muted-foreground truncate">{partner.city}</p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <StatusChip status={partner.effectiveStatus} />
        <RiskBadge
          isBlacklisted={partner.isBlacklisted}
          hasRiskFlag={partner.riskFlag && !partner.isBlacklisted}
          hasConflict={partner.conflictFlag}
        />
      </div>

      <div className="w-24">
        <RatingDisplay rating={partner.avgRating} showNumber />
      </div>

      <div className="w-24">
        <LogisticsIcons
          hosting={partner.logistics?.hosting}
          car={partner.logistics?.car}
          discreet={partner.logistics?.discreetDl}
          hasPhone={!!partner.logistics?.phoneNumber}
        />
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuickAssess?.(partner.id)}
          data-testid={`button-quick-assess-${partner.id}`}
        >
          <ClipboardPlus className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`button-partner-menu-${partner.id}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/partners/${partner.id}`}>
                <span>View Details</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onQuickAssess?.(partner.id)}>
              Add Assessment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

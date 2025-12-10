import { Link } from "wouter";
import { ClipboardPlus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

interface PartnerCardProps {
  partner: PartnerWithComputed;
  onQuickAssess?: (partnerId: number) => void;
  variant?: "default" | "compact";
  className?: string;
}

export function PartnerCard({
  partner,
  onQuickAssess,
  variant = "default",
  className,
}: PartnerCardProps) {
  const isCompact = variant === "compact";

  return (
    <Card
      className={cn(
        "group hover-elevate transition-all duration-150",
        partner.riskFlag && "risk-indicator",
        className
      )}
      data-testid={`partner-card-${partner.id}`}
    >
      <CardContent className={cn("p-4", isCompact && "p-3")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Link href={`/partners/${partner.id}`}>
                <span
                  className={cn(
                    "font-medium hover:underline cursor-pointer",
                    isCompact && "text-sm"
                  )}
                  data-testid={`link-partner-${partner.id}`}
                >
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
              <p className="text-sm text-muted-foreground mb-2">{partner.city}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <StatusChip status={partner.effectiveStatus} />
              <RiskBadge
                isBlacklisted={partner.isBlacklisted}
                hasRiskFlag={partner.riskFlag && !partner.isBlacklisted}
                hasConflict={partner.conflictFlag}
              />
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onQuickAssess?.(partner.id)}
                data-testid={`button-quick-assess-${partner.id}`}
              >
                <ClipboardPlus className="h-3.5 w-3.5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    data-testid={`button-partner-menu-${partner.id}`}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
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
            <RatingDisplay rating={partner.avgRating} />
            <LogisticsIcons
              hosting={partner.logistics?.hosting}
              car={partner.logistics?.car}
              discreet={partner.logistics?.discreetDl}
              hasPhone={!!partner.logistics?.phoneNumber}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

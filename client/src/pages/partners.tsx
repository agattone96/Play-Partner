import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Download, Upload, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerRow } from "@/components/partner-row";
import { PartnerCard } from "@/components/partner-card";
import { FilterBar, defaultFilters, type FilterState } from "@/components/filter-bar";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { QuickAddPartnerModal } from "@/components/quick-add-partner-modal";
import { QuickAssessmentModal } from "@/components/quick-assessment-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PartnerWithComputed } from "@shared/schema";

export default function Partners() {
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [assessingPartnerId, setAssessingPartnerId] = useState<number | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const { data: partners, isLoading } = useQuery<PartnerWithComputed[]>({
    queryKey: ["/api/partners"],
  });

  const filteredPartners = useMemo(() => {
    if (!partners) return [];

    return partners.filter((partner) => {
      if (
        filters.search &&
        !partner.fullName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !partner.nickname?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      if (filters.status && filters.status !== "all" && partner.effectiveStatus !== filters.status) {
        return false;
      }

      if (filters.city && !partner.city?.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }

      if (filters.hosting === true && !partner.logistics?.hosting) {
        return false;
      }

      if (filters.car === true && !partner.logistics?.car) {
        return false;
      }

      if (filters.discreet === true && !partner.logistics?.discreetDl) {
        return false;
      }

      const avgRating = partner.avgRating ?? 0;
      if (avgRating < filters.ratingMin || avgRating > filters.ratingMax) {
        return false;
      }

      if (filters.hasRisk === true && !partner.riskFlag) {
        return false;
      }

      if (filters.hasConflict === true && !partner.conflictFlag) {
        return false;
      }

      return true;
    });
  }, [partners, filters]);

  const handleExport = () => {
    window.open("/api/partners/export", "_blank");
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Partners</h1>
            <p className="text-muted-foreground">Manage all partner profiles</p>
          </div>
        </div>
        <LoadingSkeleton variant="partner-row" count={8} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Partners</h1>
          <p className="text-muted-foreground">
            {filteredPartners.length} of {partners?.length || 0} partners
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" data-testid="button-import-export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Upload className="h-4 w-4 mr-2" />
                Import from CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={() => setShowAddPartner(true)} data-testid="button-add-partner">
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        </div>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {filteredPartners.length === 0 ? (
        <EmptyState
          icon={<Plus className="h-12 w-12" />}
          title={filters.search || Object.values(filters).some((v) => v) ? "No matching partners" : "No partners yet"}
          description={
            filters.search || Object.values(filters).some((v) => v)
              ? "Try adjusting your filters to find partners"
              : "Add your first partner to get started"
          }
          action={
            !filters.search && (
              <Button onClick={() => setShowAddPartner(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Partner
              </Button>
            )
          }
        />
      ) : viewMode === "list" ? (
        <div className="space-y-1">
          <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <div className="flex-1">Partner</div>
            <div className="w-48">Status</div>
            <div className="w-24">Rating</div>
            <div className="w-24">Logistics</div>
            <div className="w-20"></div>
          </div>
          {filteredPartners.map((partner) => (
            <PartnerRow
              key={partner.id}
              partner={partner}
              onQuickAssess={setAssessingPartnerId}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onQuickAssess={setAssessingPartnerId}
            />
          ))}
        </div>
      )}

      <QuickAddPartnerModal
        open={showAddPartner}
        onOpenChange={setShowAddPartner}
      />

      <QuickAssessmentModal
        partnerId={assessingPartnerId}
        open={assessingPartnerId !== null}
        onOpenChange={(open) => !open && setAssessingPartnerId(null)}
      />
    </div>
  );
}

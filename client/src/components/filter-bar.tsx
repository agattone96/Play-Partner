import { useState } from "react";
import { Search, X, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { STATUS_OPTIONS, ADMIN_OPTIONS, TAG_GROUP_OPTIONS } from "@shared/schema";
import { cn } from "@/lib/utils";

export interface FilterState {
  search: string;
  status: string;
  allisonStatus: string;
  roxanneStatus: string;
  city: string;
  hosting: boolean | null;
  car: boolean | null;
  discreet: boolean | null;
  ratingMin: number;
  ratingMax: number;
  tagGroup: string;
  hasRisk: boolean | null;
  hasConflict: boolean | null;
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

const defaultFilters: FilterState = {
  search: "",
  status: "",
  allisonStatus: "",
  roxanneStatus: "",
  city: "",
  hosting: null,
  car: null,
  discreet: null,
  ratingMin: 0,
  ratingMax: 5,
  tagGroup: "",
  hasRisk: null,
  hasConflict: null,
};

export function FilterBar({ filters, onFiltersChange, className }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange(defaultFilters);
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "search") return false;
    if (key === "ratingMin") return value !== 0;
    if (key === "ratingMax") return value !== 5;
    if (value === null || value === "") return false;
    return true;
  }).length;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
            data-testid="input-search-partners"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => updateFilter("search", "")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="w-[180px]" data-testid="select-filter-status">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2"
              data-testid="button-advanced-filters"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="font-medium text-sm">Advanced Filters</div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Admin Status</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={filters.allisonStatus}
                      onValueChange={(value) => updateFilter("allisonStatus", value)}
                    >
                      <SelectTrigger className="text-xs" data-testid="select-allison-status">
                        <SelectValue placeholder="Allison" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={filters.roxanneStatus}
                      onValueChange={(value) => updateFilter("roxanneStatus", value)}
                    >
                      <SelectTrigger className="text-xs" data-testid="select-roxanne-status">
                        <SelectValue placeholder="Roxanne" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">City</Label>
                  <Input
                    placeholder="Filter by city..."
                    value={filters.city}
                    onChange={(e) => updateFilter("city", e.target.value)}
                    className="text-sm"
                    data-testid="input-filter-city"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Logistics</Label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filters.hosting === true}
                        onCheckedChange={(checked) =>
                          updateFilter("hosting", checked ? true : null)
                        }
                        data-testid="checkbox-filter-hosting"
                      />
                      Hosting
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filters.car === true}
                        onCheckedChange={(checked) =>
                          updateFilter("car", checked ? true : null)
                        }
                        data-testid="checkbox-filter-car"
                      />
                      Car
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filters.discreet === true}
                        onCheckedChange={(checked) =>
                          updateFilter("discreet", checked ? true : null)
                        }
                        data-testid="checkbox-filter-discreet"
                      />
                      Discreet
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Rating Range: {filters.ratingMin} - {filters.ratingMax}
                  </Label>
                  <Slider
                    min={0}
                    max={5}
                    step={1}
                    value={[filters.ratingMin, filters.ratingMax]}
                    onValueChange={([min, max]) => {
                      updateFilter("ratingMin", min);
                      updateFilter("ratingMax", max);
                    }}
                    data-testid="slider-rating-range"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Tag Group</Label>
                  <Select
                    value={filters.tagGroup}
                    onValueChange={(value) => updateFilter("tagGroup", value)}
                  >
                    <SelectTrigger className="text-sm" data-testid="select-filter-tag-group">
                      <SelectValue placeholder="All groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {TAG_GROUP_OPTIONS.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Flags</Label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filters.hasRisk === true}
                        onCheckedChange={(checked) =>
                          updateFilter("hasRisk", checked ? true : null)
                        }
                        data-testid="checkbox-filter-risk"
                      />
                      Has Risk
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={filters.hasConflict === true}
                        onCheckedChange={(checked) =>
                          updateFilter("hasConflict", checked ? true : null)
                        }
                        data-testid="checkbox-filter-conflict"
                      />
                      Has Conflict
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  data-testid="button-clear-filters"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
            data-testid="button-clear-all-filters"
          >
            Clear All
            <X className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

export { defaultFilters };

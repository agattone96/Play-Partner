import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { ClipboardList, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusChip } from "@/components/status-chip";
import { RatingDisplay } from "@/components/rating-display";
import { RiskBadge } from "@/components/risk-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { ADMIN_OPTIONS } from "@shared/schema";
import type { AdminAssessment, Partner } from "@shared/schema";

interface AssessmentWithPartner extends AdminAssessment {
  partner?: Partner;
}

export default function Assessments() {
  const [adminFilter, setAdminFilter] = useState<string>("");

  const { data: assessments, isLoading } = useQuery<AssessmentWithPartner[]>({
    queryKey: ["/api/assessments"],
  });

  const filteredAssessments = assessments?.filter((a) => {
    if (adminFilter && adminFilter !== "all" && a.admin !== adminFilter) {
      return false;
    }
    return true;
  }) || [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Assessments</h1>
          <p className="text-muted-foreground">View all partner assessments</p>
        </div>
        <LoadingSkeleton variant="table" count={8} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Assessments</h1>
          <p className="text-muted-foreground">
            {filteredAssessments.length} assessments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={adminFilter} onValueChange={setAdminFilter}>
            <SelectTrigger className="w-[150px]" data-testid="select-admin-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Admins" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Admins</SelectItem>
              {ADMIN_OPTIONS.map((admin) => (
                <SelectItem key={admin} value={admin}>
                  {admin}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAssessments.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-12 w-12" />}
          title="No assessments yet"
          description="Assessments will appear here as they are created"
        />
      ) : (
        <div className="space-y-3">
          {filteredAssessments
            .sort(
              (a, b) =>
                new Date(b.createdAt!).getTime() -
                new Date(a.createdAt!).getTime()
            )
            .map((assessment) => (
              <Card
                key={assessment.id}
                className={assessment.blacklisted ? "border-red-500/30" : ""}
                data-testid={`assessment-card-${assessment.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {assessment.partner && (
                          <Link href={`/partners/${assessment.partnerId}`}>
                            <span className="font-medium hover:underline cursor-pointer">
                              {assessment.partner.fullName}
                            </span>
                          </Link>
                        )}
                        <Badge variant="outline">{assessment.admin}</Badge>
                        {assessment.status && (
                          <StatusChip status={assessment.status} />
                        )}
                        {assessment.blacklisted && <RiskBadge isBlacklisted />}
                      </div>
                      {assessment.notes && (
                        <p className="text-sm text-muted-foreground">
                          {assessment.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {assessment.rating && (
                        <RatingDisplay rating={assessment.rating} showNumber />
                      )}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {assessment.createdAt
                          ? format(new Date(assessment.createdAt), "MMM d, yyyy h:mm a")
                          : ""}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

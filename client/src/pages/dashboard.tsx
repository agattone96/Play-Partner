import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users, AlertTriangle, Clock, XOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpi-card";
import { PartnerCard } from "@/components/partner-card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { QuickAddPartnerModal } from "@/components/quick-add-partner-modal";
import { QuickAssessmentModal } from "@/components/quick-assessment-modal";
import type { PartnerWithComputed } from "@shared/schema";

interface DashboardData {
  totalPartners: number;
  activePartners: number;
  vettingQueue: PartnerWithComputed[];
  riskList: PartnerWithComputed[];
  conflictsList: PartnerWithComputed[];
  recentPartners: PartnerWithComputed[];
}

export default function Dashboard() {
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [assessingPartnerId, setAssessingPartnerId] = useState<number | null>(null);

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Overview</h1>
            <p className="text-muted-foreground">Partner management overview</p>
          </div>
        </div>
        <LoadingSkeleton variant="kpi" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton variant="partner-card" count={3} />
          <LoadingSkeleton variant="partner-card" count={3} />
        </div>
      </div>
    );
  }

  const dashboard = data || {
    totalPartners: 0,
    activePartners: 0,
    vettingQueue: [],
    riskList: [],
    conflictsList: [],
    recentPartners: [],
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Overview</h1>
          <p className="text-muted-foreground">Partner management overview</p>
        </div>
        <Button onClick={() => setShowAddPartner(true)} data-testid="button-add-partner">
          <Plus className="h-4 w-4 mr-2" />
          Create Partner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Partners"
          value={dashboard.totalPartners}
          icon={<Users className="h-5 w-5" />}
        />
        <KpiCard
          title="Active Partners"
          value={dashboard.activePartners}
          icon={<Users className="h-5 w-5" />}
          variant="success"
        />
        <KpiCard
          title="Vetting Queue"
          value={dashboard.vettingQueue.length}
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
        />
        <KpiCard
          title="Risk Items"
          value={dashboard.riskList.length}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="danger"
        />
      </div>

      {/* FLOW-01: First-Run Experience / Getting Started Banner */}
      {dashboard.totalPartners === 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Welcome to PlayPartner!</h3>
              <p className="text-muted-foreground max-w-md">
                Get started by creating your first partner record. You can track vetting status, assessments, and detailed profiles.
              </p>
            </div>
            <Button size="lg" onClick={() => setShowAddPartner(true)} className="gap-2">
              <Plus className="h-5 w-5" />
              Create Your First Partner
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              Vetting Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.vettingQueue.length === 0 ? (
              <EmptyState
                title="No partners awaiting vetting"
                description="Partners marked as 'Ready for Vetting' will appear here"
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {dashboard.vettingQueue.slice(0, 5).map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    variant="compact"
                    onQuickAssess={setAssessingPartnerId}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Risk List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.riskList.length === 0 ? (
              <EmptyState
                title="No risk items"
                description="Partners with risk flags will appear here"
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {dashboard.riskList.slice(0, 5).map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    variant="compact"
                    onQuickAssess={setAssessingPartnerId}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <XOctagon className="h-4 w-4 text-orange-400" />
              Conflicts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.conflictsList.length === 0 ? (
              <EmptyState
                title="No conflicts detected"
                description="Partners with conflicting admin statuses will appear here"
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {dashboard.conflictsList.slice(0, 5).map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    variant="compact"
                    onQuickAssess={setAssessingPartnerId}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Partners</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.recentPartners.length === 0 ? (
              <EmptyState
                title="No partners yet"
                description="Add your first partner to get started"
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddPartner(true)}
                  >
                    Create Partner
                  </Button>
                }
                className="py-8"
              />
            ) : (
              <div className="space-y-3">
                {dashboard.recentPartners.slice(0, 5).map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    variant="compact"
                    onQuickAssess={setAssessingPartnerId}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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

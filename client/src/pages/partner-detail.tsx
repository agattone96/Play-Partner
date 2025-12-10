import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StatusChip } from "@/components/status-chip";
import { RatingDisplay } from "@/components/rating-display";
import { LogisticsIcons } from "@/components/logistics-icons";
import { RiskBadge } from "@/components/risk-badge";
import { SensitiveField } from "@/components/sensitive-field";
import { TagBadge } from "@/components/tag-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { QuickAssessmentModal } from "@/components/quick-assessment-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  BODY_BUILD_OPTIONS,
  STATUS_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
} from "@shared/schema";
import type { PartnerWithComputed, AdminAssessment } from "@shared/schema";
import { cn } from "@/lib/utils";

export default function PartnerDetail() {
  const { id } = useParams<{ id: string }>();
  const partnerId = parseInt(id || "0");
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [intimacyOpen, setIntimacyOpen] = useState(false);
  const [logisticsOpen, setLogisticsOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<PartnerWithComputed>>({});

  const { data: partner, isLoading } = useQuery<PartnerWithComputed>({
    queryKey: ["/api/partners", partnerId],
    enabled: !!partnerId,
  });

  const updatePartner = useMutation({
    mutationFn: async (data: Partial<PartnerWithComputed>) => {
      return apiRequest("PATCH", `/api/partners/${partnerId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners", partnerId] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast({ title: "Partner updated successfully" });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updatePartner.mutate(editData);
  };

  const handleEdit = () => {
    setEditData({
      fullName: partner?.fullName,
      nickname: partner?.nickname,
      city: partner?.city,
      height: partner?.height,
      bodyBuild: partner?.bodyBuild,
      status: partner?.status,
      referralSource: partner?.referralSource,
    });
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSkeleton variant="detail" count={4} />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Partner not found</h2>
          <Link href="/partners">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = partner.effectiveStatus === "Do Not Engage" || partner.isBlacklisted;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/partners">
          <Button variant="ghost" size="icon" data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            {isEditing ? (
              <Input
                value={editData.fullName || ""}
                onChange={(e) =>
                  setEditData({ ...editData, fullName: e.target.value })
                }
                className="text-2xl font-semibold max-w-xs"
                data-testid="input-edit-name"
              />
            ) : (
              <h1 className="text-2xl font-semibold">{partner.fullName}</h1>
            )}
            {partner.nickname && !isEditing && (
              <span className="text-lg text-muted-foreground">
                ({partner.nickname})
              </span>
            )}
            {isLocked && (
              <Badge variant="destructive" className="gap-1">
                <Lock className="h-3 w-3" />
                Locked
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <StatusChip status={partner.effectiveStatus} />
            <RiskBadge
              isBlacklisted={partner.isBlacklisted}
              hasRiskFlag={partner.riskFlag && !partner.isBlacklisted}
              hasConflict={partner.conflictFlag}
            />
            {partner.city && (
              <span className="text-sm text-muted-foreground">
                {partner.city}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                data-testid="button-cancel-edit"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updatePartner.isPending}
                data-testid="button-save-partner"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleEdit}
                disabled={isLocked}
                data-testid="button-edit-partner"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={() => setShowAssessmentModal(true)}
                data-testid="button-add-assessment"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Assessment
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList data-testid="partner-tabs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="intimacy">Intimacy</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Height
                    </p>
                    <p className="text-sm">{partner.height || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Body Build
                    </p>
                    {isEditing ? (
                      <Select
                        value={editData.bodyBuild || ""}
                        onValueChange={(v) =>
                          setEditData({ ...editData, bodyBuild: v as typeof BODY_BUILD_OPTIONS[number] })
                        }
                      >
                        <SelectTrigger className="h-8" data-testid="select-edit-body-build">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {BODY_BUILD_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm">{partner.bodyBuild || "Not specified"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Date of Birth
                    </p>
                    <p className="text-sm">
                      {partner.dob
                        ? format(new Date(partner.dob), "MMM d, yyyy")
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                      Referral Source
                    </p>
                    <p className="text-sm">{partner.referralSource || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Effective Status</span>
                  <StatusChip status={partner.effectiveStatus} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Rating</span>
                  <RatingDisplay rating={partner.avgRating} showNumber />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Logistics</span>
                  <LogisticsIcons
                    hosting={partner.logistics?.hosting || false}
                    car={partner.logistics?.car || false}
                    discreet={partner.logistics?.discreetDl || false}
                    hasPhone={!!partner.logistics?.phoneNumber}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Allison&apos;s Status</span>
                  {partner.latestAllisonStatus ? (
                    <StatusChip status={partner.latestAllisonStatus} />
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No assessment</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Roxanne&apos;s Status</span>
                  {partner.latestRoxanneStatus ? (
                    <StatusChip status={partner.latestRoxanneStatus} />
                  ) : (
                    <span className="text-sm text-muted-foreground italic">No assessment</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {partner.tags && partner.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {partner.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="intimacy">
          <Card>
            <Collapsible open={intimacyOpen} onOpenChange={setIntimacyOpen}>
              <CardHeader className="cursor-pointer" onClick={() => setIntimacyOpen(!intimacyOpen)}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Intimacy Details</CardTitle>
                    {intimacyOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {partner.intimacy ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                          Kinks
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {partner.intimacy.kinks?.map((kink) => (
                            <Badge key={kink} variant="secondary">
                              {kink}
                            </Badge>
                          )) || (
                            <span className="text-sm text-muted-foreground italic">
                              None specified
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                          Roles
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {partner.intimacy.role?.map((role) => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          )) || (
                            <span className="text-sm text-muted-foreground italic">
                              None specified
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                          Bedroom Style
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {partner.intimacy.bedroomStyle?.map((style) => (
                            <Badge key={style} variant="secondary">
                              {style}
                            </Badge>
                          )) || (
                            <span className="text-sm text-muted-foreground italic">
                              None specified
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                          Sexual Orientation
                        </p>
                        <p className="text-sm">
                          {partner.intimacy.sexualOrientation || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                          Relationship Status
                        </p>
                        <p className="text-sm">
                          {partner.intimacy.relationshipStatus || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                          Appealing Characteristics
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {partner.intimacy.appealingCharacteristics?.map((char) => (
                            <Badge key={char} variant="secondary">
                              {char}
                            </Badge>
                          )) || (
                            <span className="text-sm text-muted-foreground italic">
                              None specified
                            </span>
                          )}
                        </div>
                      </div>
                      {partner.intimacy.notes && (
                        <div className="md:col-span-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                            Notes
                          </p>
                          <p className="text-sm">{partner.intimacy.notes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No intimacy details recorded
                    </p>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </TabsContent>

        <TabsContent value="logistics">
          <Card>
            <Collapsible open={logisticsOpen} onOpenChange={setLogisticsOpen}>
              <CardHeader className="cursor-pointer" onClick={() => setLogisticsOpen(!logisticsOpen)}>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Logistics Details</CardTitle>
                    {logisticsOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {partner.logistics ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <LogisticsIcons
                          hosting={partner.logistics.hosting || false}
                          car={partner.logistics.car || false}
                          discreet={partner.logistics.discreetDl || false}
                        />
                        <span className="text-sm">
                          {[
                            partner.logistics.hosting && "Can Host",
                            partner.logistics.car && "Has Car",
                            partner.logistics.discreetDl && "Discreet/DL",
                          ]
                            .filter(Boolean)
                            .join(", ") || "No logistics info"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                          City
                        </p>
                        <p className="text-sm">
                          {partner.logistics.city || partner.city || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                          Phone Number
                        </p>
                        <SensitiveField value={partner.logistics.phoneNumber} />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                          Street Address
                        </p>
                        <SensitiveField value={partner.logistics.streetAddress} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No logistics details recorded
                    </p>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Media</CardTitle>
            </CardHeader>
            <CardContent>
              {partner.media && partner.media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {partner.media.map((media) => (
                    <div
                      key={media.id}
                      className="aspect-square bg-muted rounded-md flex items-center justify-center"
                    >
                      {media.photoFaceUrl || media.photoBodyUrl ? (
                        <img
                          src={media.photoFaceUrl || media.photoBodyUrl || ""}
                          alt="Partner media"
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">No image</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No media uploaded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">Assessment Timeline</CardTitle>
              <Button
                size="sm"
                onClick={() => setShowAssessmentModal(true)}
                data-testid="button-add-assessment-tab"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Assessment
              </Button>
            </CardHeader>
            <CardContent>
              {partner.assessments && partner.assessments.length > 0 ? (
                <div className="space-y-4">
                  {partner.assessments
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt!).getTime() -
                        new Date(a.createdAt!).getTime()
                    )
                    .map((assessment: AdminAssessment) => (
                      <div
                        key={assessment.id}
                        className={cn(
                          "p-4 rounded-md border",
                          assessment.blacklisted && "border-red-500/30 bg-red-500/5"
                        )}
                        data-testid={`assessment-${assessment.id}`}
                      >
                        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{assessment.admin}</Badge>
                            {assessment.status && (
                              <StatusChip status={assessment.status} />
                            )}
                            {assessment.blacklisted && (
                              <RiskBadge isBlacklisted />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {assessment.rating && (
                              <RatingDisplay rating={assessment.rating} />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {assessment.createdAt
                                ? format(new Date(assessment.createdAt), "MMM d, yyyy h:mm a")
                                : ""}
                            </span>
                          </div>
                        </div>
                        {assessment.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {assessment.notes}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No assessments recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <QuickAssessmentModal
        partnerId={partnerId}
        open={showAssessmentModal}
        onOpenChange={setShowAssessmentModal}
      />
    </div>
  );
}

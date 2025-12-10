import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { STATUS_OPTIONS, ADMIN_OPTIONS } from "@shared/schema";
import type { PartnerWithComputed } from "@shared/schema";
import { useState } from "react";
import { cn } from "@/lib/utils";

const assessmentSchema = z.object({
  partnerId: z.number(),
  admin: z.string().min(1, "Admin is required"),
  status: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  blacklisted: z.boolean().default(false),
  notes: z.string().optional(),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

interface QuickAssessmentModalProps {
  partnerId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickAssessmentModal({
  partnerId,
  open,
  onOpenChange,
}: QuickAssessmentModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showDoNotEngageConfirm, setShowDoNotEngageConfirm] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<AssessmentFormValues | null>(null);

  const { data: partner } = useQuery<PartnerWithComputed>({
    queryKey: ["/api/partners", partnerId],
    enabled: !!partnerId,
  });

  const defaultAdmin = user?.firstName === "Roxanne" ? "Roxanne" : "Allison";

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      partnerId: partnerId || 0,
      admin: defaultAdmin,
      status: "",
      rating: undefined,
      blacklisted: false,
      notes: "",
    },
  });

  const createAssessment = useMutation({
    mutationFn: async (data: AssessmentFormValues) => {
      return apiRequest("POST", "/api/assessments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/partners", partnerId] });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: "Assessment added",
        description: "The assessment has been recorded successfully.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create assessment",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AssessmentFormValues) => {
    const finalData = { ...data, partnerId: partnerId! };
    
    if (data.status === "Do Not Engage" || data.blacklisted) {
      setPendingSubmit(finalData);
      setShowDoNotEngageConfirm(true);
    } else {
      createAssessment.mutate(finalData);
    }
  };

  const confirmDoNotEngage = () => {
    if (pendingSubmit) {
      createAssessment.mutate(pendingSubmit);
    }
    setShowDoNotEngageConfirm(false);
    setPendingSubmit(null);
  };

  const watchedRating = form.watch("rating");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" data-testid="modal-quick-assessment">
          <DialogHeader>
            <DialogTitle>Add Assessment</DialogTitle>
            <DialogDescription>
              {partner
                ? `Record your assessment for ${partner.fullName}`
                : "Record your assessment for this partner"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="admin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessed By *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-admin">
                          <SelectValue placeholder="Select admin..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ADMIN_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-assessment-status">
                          <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            className="p-1"
                            onClick={() => field.onChange(value)}
                            data-testid={`button-rating-${value}`}
                          >
                            <Star
                              className={cn(
                                "h-6 w-6 transition-colors",
                                value <= (watchedRating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          </button>
                        ))}
                        {watchedRating && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-2 text-xs"
                            onClick={() => field.onChange(undefined)}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blacklisted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-destructive/20 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-blacklisted"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-destructive">
                        Blacklist this partner
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        This will mark the partner as "Do Not Engage"
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any notes about this assessment..."
                        className="resize-none"
                        rows={3}
                        {...field}
                        data-testid="textarea-assessment-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  data-testid="button-cancel-assessment"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createAssessment.isPending}
                  data-testid="button-submit-assessment"
                >
                  {createAssessment.isPending ? "Saving..." : "Save Assessment"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDoNotEngageConfirm} onOpenChange={setShowDoNotEngageConfirm}>
        <AlertDialogContent data-testid="dialog-confirm-do-not-engage">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Confirm Do Not Engage
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to mark this partner as "Do Not Engage" or blacklist them.
              This action will lock the partner profile and prevent future engagement.
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-do-not-engage">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDoNotEngage}
              className="bg-destructive text-destructive-foreground"
              data-testid="button-confirm-do-not-engage"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

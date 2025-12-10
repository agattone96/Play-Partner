import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Tags as TagsIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { TagBadge } from "@/components/tag-badge";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TAG_GROUP_OPTIONS } from "@shared/schema";
import type { Tag } from "@shared/schema";

const createTagSchema = z.object({
  tagName: z.string().min(1, "Tag name is required"),
  tagGroup: z.string().min(1, "Tag group is required"),
});

type CreateTagValues = z.infer<typeof createTagSchema>;

export default function Tags() {
  const { toast } = useToast();
  const [showAddTag, setShowAddTag] = useState(false);

  const { data: tags, isLoading } = useQuery<Tag[]>({
    queryKey: ["/api/tags"],
  });

  const form = useForm<CreateTagValues>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      tagName: "",
      tagGroup: "",
    },
  });

  const createTag = useMutation({
    mutationFn: async (data: CreateTagValues) => {
      return apiRequest("POST", "/api/tags", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tags"] });
      toast({ title: "Tag created successfully" });
      form.reset();
      setShowAddTag(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTag = useMutation({
    mutationFn: async (tagId: number) => {
      return apiRequest("DELETE", `/api/tags/${tagId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tags"] });
      toast({ title: "Tag deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const groupedTags = tags?.reduce(
    (acc, tag) => {
      const group = tag.tagGroup;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(tag);
      return acc;
    },
    {} as Record<string, Tag[]>
  ) || {};

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Tags & Taxonomies</h1>
          <p className="text-muted-foreground">Manage tags and categories</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton variant="kpi" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Tags & Taxonomies</h1>
          <p className="text-muted-foreground">
            {tags?.length || 0} tags across {Object.keys(groupedTags).length} groups
          </p>
        </div>
        <Button onClick={() => setShowAddTag(true)} data-testid="button-add-tag">
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>

      {tags?.length === 0 ? (
        <EmptyState
          icon={<TagsIcon className="h-12 w-12" />}
          title="No tags yet"
          description="Create tags to categorize and organize partners"
          action={
            <Button onClick={() => setShowAddTag(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TAG_GROUP_OPTIONS.map((group) => (
            <Card key={group}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {group}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({groupedTags[group]?.length || 0})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {groupedTags[group]?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {groupedTags[group].map((tag) => (
                      <div
                        key={tag.id}
                        className="group inline-flex items-center gap-1"
                      >
                        <TagBadge tag={tag} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteTag.mutate(tag.id)}
                          data-testid={`button-delete-tag-${tag.id}`}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No tags in this group
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAddTag} onOpenChange={setShowAddTag}>
        <DialogContent className="sm:max-w-md" data-testid="modal-add-tag">
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
            <DialogDescription>
              Create a new tag to categorize partners
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => createTag.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="tagName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tag name"
                        {...field}
                        data-testid="input-tag-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Group</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-tag-group">
                          <SelectValue placeholder="Select group..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TAG_GROUP_OPTIONS.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddTag(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createTag.isPending}
                  data-testid="button-submit-tag"
                >
                  {createTag.isPending ? "Creating..." : "Create Tag"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

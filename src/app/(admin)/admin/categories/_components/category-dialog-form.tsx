"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { orpcQC } from "@/lib/orpc";
import { CategorySchema } from "@/schemas/category";
import { useCategoryContext } from "../context";
import CategorySelect from "./category-select";

type CategoryFormData = {
  name: string;
  description: string;
  priority: number;
  parentId?: string;
  sectionId?: string;
};

const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  priority: z.number().default(0),
  parentId: z.string().optional(),
  sectionId: z.string().min(1, "Section is required"),
});

export default function CategoryDialogForm() {
  const {
    isDialogOpen,
    dialogMode,
    selectedCategory,
    sections,
    closeDialog,
    addCategory,
    updateCategory,
  } = useCategoryContext();
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      priority: 0,
      parentId: undefined,
      sectionId: "",
    },
  });

  // Reset form when dialog opens/closes or selected category changes
  useEffect(() => {
    if (isDialogOpen && selectedCategory && dialogMode === "update") {
      form.reset({
        name: selectedCategory.name,
        description: selectedCategory.description || "",
        priority: selectedCategory.priority || 0,
        parentId: selectedCategory.parent?.id || undefined,
        sectionId: selectedCategory.section?.id || undefined,
      });
    } else if (isDialogOpen && dialogMode === "create") {
      form.reset({
        name: "",
        description: "",
        priority: 0,
        parentId: undefined,
        sectionId: "",
      });
    }
  }, [isDialogOpen, selectedCategory, dialogMode, form]);

  const createMutation = useMutation(
    orpcQC.category.create.mutationOptions({
      onSuccess: (data) => {
        if (data.data) {
          addCategory(data.data as any);
          toast.success(data.message || "Category created successfully");
          closeDialog();
          form.reset();

          // Invalidate category queries to refresh the list
          queryClient.invalidateQueries({
            queryKey: orpcQC.category.get.key(),
          });
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create category");
      },
    })
  );

  const updateMutation = useMutation(
    orpcQC.category.update.mutationOptions({
      onSuccess: (data) => {
        if (data.data) {
          updateCategory(data.data as any);
          toast.success(data.message || "Category updated successfully");
          closeDialog();
          form.reset();

          // Invalidate category queries to refresh the list
          queryClient.invalidateQueries({
            queryKey: orpcQC.category.get.key(),
          });
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update category");
      },
    })
  );

  const onSubmit = async (data: CategoryFormData) => {
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const categoryData = {
      ...data,
      slug,
      level: data.parentId ? 1 : 0, // Set level based on parent
    };

    if (dialogMode === "create") {
      createMutation.mutate(categoryData);
    } else if (selectedCategory) {
      updateMutation.mutate({
        params: { id: selectedCategory.id },
        body: {
          ...selectedCategory,
          ...categoryData,
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] h-full overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {dialogMode === "create" ? "Create Category" : "Update Category"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isDialogOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter category name"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter category description"
                            disabled={isLoading}
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section *</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || ""}
                            onValueChange={(value) =>
                              field.onChange(value || "")
                            }
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a section" />
                            </SelectTrigger>
                            <SelectContent>
                              {sections?.map((section: any) => (
                                <SelectItem key={section.id} value={section.id}>
                                  {section.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                        <div className="text-xs text-slate-600">
                          Every category must belong to a section
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category (Optional)</FormLabel>
                        <FormControl>
                          <CategorySelect
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select parent category"
                            disabled={isLoading}
                            className="w-full"
                            showSubcategories={false}
                            sectionId={form.watch("sectionId")}
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="text-xs text-slate-600">
                          Leave empty to create a root category (Level 0)
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            disabled={isLoading}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                        <div className="text-xs text-slate-600">
                          Higher numbers appear first
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeDialog}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading && <Loader className="mr-2 h-4 w-4" />}
                      {dialogMode === "create" ? "Create" : "Update"}
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

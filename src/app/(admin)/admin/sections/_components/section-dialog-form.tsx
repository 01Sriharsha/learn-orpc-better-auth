"use client";

import { SectionType } from "@generated/client/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Loader } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { orpcQC } from "@/lib/orpc";
import { SectionSchema } from "@/schemas/section";
import { useSectionContext } from "../context";

interface SectionDialogFormProps {
  trigger: React.ReactNode;
}

type SectionFormData = {
  name: string;
  slug: string;
  type: SectionSchema["type"];
  priority: number;
};

export default function SectionDialogForm({ trigger }: SectionDialogFormProps) {
  const {
    isDialogOpen,
    dialogMode,
    selectedSection,
    closeDialog,
    addSection,
    updateSection,
  } = useSectionContext();
  const queryClient = useQueryClient();

  const form = useForm<SectionFormData>({
    resolver: zodResolver(
      SectionSchema.omit({ id: true, createdAt: true, updatedAt: true })
    ) as any,
    defaultValues: {
      name: "",
      slug: "",
      type: "AI_LIKE",
      priority: 0,
    },
  });

  // Reset form when dialog opens/closes or selected section changes
  React.useEffect(() => {
    if (isDialogOpen && selectedSection && dialogMode === "update") {
      form.reset({
        name: selectedSection.name,
        slug: selectedSection.slug,
        type: selectedSection.type,
        priority: selectedSection.priority,
      });
    } else if (isDialogOpen && dialogMode === "create") {
      form.reset({
        name: "",
        slug: "",
        type: "AI_LIKE",
        priority: 0,
      });
    }
  }, [isDialogOpen, selectedSection, dialogMode, form]);

  const createMutation = useMutation(
    orpcQC.section.create.mutationOptions({
      onSuccess: (data) => {
        if (data.data) {
          addSection(data.data);
          toast.success(data.message || "Section created successfully");
          closeDialog();
          form.reset();

          // Invalidate section queries to refresh the list
          queryClient.invalidateQueries({
            queryKey: orpcQC.section.get.key({ type: "query" }),
          });
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create section");
      },
    })
  );

  const updateMutation = useMutation(
    orpcQC.section.update.mutationOptions({
      onSuccess: (data) => {
        if (data.data) {
          updateSection(data.data);
          toast.success(data.message || "Section updated successfully");
          closeDialog();
          form.reset();

          // Invalidate section queries to refresh the list
          queryClient.invalidateQueries({
            queryKey: orpcQC.section.get.key({ type: "query" }),
          });
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update section");
      },
    })
  );

  const onSubmit = async (data: SectionFormData) => {
    if (dialogMode === "create") {
      createMutation.mutate(data);
    } else if (selectedSection) {
      updateMutation.mutate({
        params: { id: selectedSection.id },
        body: {
          ...selectedSection,
          ...data,
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    form.setValue("slug", slug);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={closeDialog}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {dialogMode === "create" ? "Create New Section" : "Update Section"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={dialogMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter section name"
                          onChange={(e) => {
                            field.onChange(e);
                            handleNameChange(e.target.value);
                          }}
                          className="border-slate-200 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug Field */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="section-slug"
                          className="border-slate-200 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type Field */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-slate-200 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-200">
                            <SelectValue placeholder="Select section type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(SectionType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type
                                .replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority Field */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="border-slate-200 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeDialog}
                    className="flex-1 border-slate-200 hover:bg-slate-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>

                  <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <Loader className="w-4 h-4">
                          {dialogMode === "create"
                            ? "Creating..."
                            : "Updating..."}
                        </Loader>
                      ) : dialogMode === "create" ? (
                        "Create Section"
                      ) : (
                        "Update Section"
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </Form>
          </motion.div>
        </AnimatePresence>
      </AlertDialogContent>
    </AlertDialog>
  );
}

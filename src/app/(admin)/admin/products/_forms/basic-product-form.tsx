"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { CreateProductSchema, UpdateProductSchema } from "@/schemas/product";
import CategorySelect from "../../categories/_components/category-select";

import type { SectionSchema } from "@/schemas/section";

interface BasicProductFormProps {
  form: UseFormReturn<
    z.infer<typeof CreateProductSchema> | z.infer<typeof UpdateProductSchema>
  >;
  sections: SectionSchema[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BasicProductForm({
  form,
  sections,
}: BasicProductFormProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");

  // Watch section changes to reset category
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === "sectionId") {
        setSelectedSectionId(values.sectionId || "");
        // Reset category when section changes
        if (values.sectionId !== selectedSectionId) {
          form.setValue("categoryId", "");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, selectedSectionId]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 w-full max-w-none"
    >
      {/* Categorization - Moved to top */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span>🏷️</span>
            Categorization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="sectionId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-medium">
                      Section *
                    </FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full transition-all focus:ring-2 focus:ring-primary/20 capitalize">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.length === 0 ? (
                            <SelectItem value="None" disabled>
                              No Sections Found
                            </SelectItem>
                          ) : (
                            sections.map((section) => (
                              <SelectItem
                                key={section.id}
                                value={section.id}
                                className="capitalize"
                              >
                                {section.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Category *
                    </FormLabel>
                    <FormControl>
                      <CategorySelect
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        sectionId={selectedSectionId}
                        placeholder="Select a category"
                        disabled={!selectedSectionId}
                        showSubcategories={true}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Product Info */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span>📝</span>
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Product Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value);
                          form.setValue("slug", generateSlug(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      URL Slug *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="product-url-slug"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Brand Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter brand name"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Industry
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Technology, Healthcare"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Product Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://product-website.com"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Priority (Display Order)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="-1 (default)"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        {...field}
                        value={field.value || 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Product Image URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description..."
                      rows={4}
                      className="transition-all focus:ring-2 focus:ring-primary/20 resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <span>⚙️</span>
            Display Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 pt-0">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="showVendor"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                  <div>
                    <FormLabel className="text-base font-medium">
                      Show Vendor
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Display vendor information on product card
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="hasPricing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                  <div>
                    <FormLabel className="text-base font-medium">
                      Has Pricing
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable pricing tab and display pricing information
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

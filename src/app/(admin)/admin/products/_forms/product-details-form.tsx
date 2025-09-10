"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

import { CreateProductSchema, UpdateProductSchema } from "@/schemas/product";
import AIProductForm from "./ai-product-form";
import DatacenterCloudForm from "./datacenter-cloud-form";
import SoftwareForm from "./software-form";
import NetworkHardwareForm from "./network-hardware-form";

import type { SectionSchema } from "@/schemas/section";
import { SectionType } from "@generated/client/enums";

interface ProductDetailsFormProps {
  form: UseFormReturn<
    z.infer<typeof CreateProductSchema> | z.infer<typeof UpdateProductSchema>
  >;
  sections: SectionSchema[];
}

export default function ProductDetailsForm({
  form,
  sections,
}: ProductDetailsFormProps) {
  const selectedSectionId = form.watch("sectionId");
  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  if (!selectedSectionId) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <InfoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Select a Section First
            </h3>
            <p className="text-sm text-muted-foreground">
              Please select a section in the Categorization tab to see relevant
              product detail fields
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderSectionSpecificForm = () => {
    if (!selectedSection) return null;

    const type = selectedSection.type;

    switch (type) {
      case SectionType.AI_LIKE:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AIProductForm form={form} />
          </motion.div>
        );

      case SectionType.DATA_CENTER:
      case SectionType.CLOUD:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DatacenterCloudForm form={form} />
          </motion.div>
        );

      case SectionType.SOFTWARE:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SoftwareForm form={form} />
          </motion.div>
        );

      case SectionType.NETWORK_HARDWARE:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NetworkHardwareForm form={form} />
          </motion.div>
        );

      default:
        return (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <InfoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No Specific Details Required
                </h3>
                <p className="text-sm text-muted-foreground">
                  This section doesn't require additional product-specific
                  details
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Product details are customized based on the selected section:{" "}
          <strong>{selectedSection?.name}</strong>
        </AlertDescription>
      </Alert>

      {renderSectionSpecificForm()}
    </div>
  );
}

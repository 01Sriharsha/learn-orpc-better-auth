"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-mobile";
import { orpcQC } from "@/lib/orpc";
import { cn } from "@/lib/utils";

import { CreateProductSchema, UpdateProductSchema } from "@/schemas/product";
import BasicProductForm from "../_forms/basic-product-form";
import EngagementBlockForm from "../_forms/engagement-block-form";
import PricingForm from "../_forms/pricing-form";
import ProductDetailsForm from "../_forms/product-details-form";
import { useProductContext } from "../context";

type TabId = "basic" | "engagement" | "details" | "pricing";

interface TabValidationState {
  basic: boolean;
  engagement: boolean;
  details: boolean;
  pricing: boolean;
}

export default function ProductDialogForm() {
  const {
    isDialogOpen,
    dialogMode,
    selectedProduct,
    sections,
    closeDialog,
    addProduct,
    updateProduct,
    setLoading,
  } = useProductContext();

  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Create mutation
  const createMutation = useMutation(
    orpcQC.product.create.mutationOptions({
      onSuccess: (data) => {
        if (data?.data) {
          addProduct(data.data);
          toast.success("Product created successfully");
          // Invalidate queries to refresh lists
          queryClient.invalidateQueries({
            queryKey: orpcQC.product.get.key(),
          });
          closeDialog();
          form.reset();
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to create product");
        setLoading(false);
      },
    })
  );

  // Update mutation
  const updateMutation = useMutation(
    orpcQC.product.update.mutationOptions({
      onSuccess: (data) => {
        if (data?.data) {
          updateProduct(data.data);
          toast.success("Product updated successfully");
          // Invalidate queries to refresh lists
          queryClient.invalidateQueries({
            queryKey: orpcQC.product.get.key(),
          });
          closeDialog();
          form.reset();
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update product");
        setLoading(false);
      },
    })
  );

  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [tabValidation, setTabValidation] = useState<TabValidationState>({
    basic: false,
    engagement: false,
    details: false,
    pricing: false,
  });

  const isEdit = dialogMode === "update";
  const schema = isEdit ? UpdateProductSchema : CreateProductSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      brandName: "",
      industry: "",
      imageUrl: "",
      link: "",
      priority: -1,
      showVendor: false,
      hasPricing: false,
      sectionId: "",
      categoryId: "",
      vendorId: "",
      engagementBlock: undefined,
      pricing: undefined,
      aiProductDetails: undefined,
      datacenterCloudDetails: undefined,
      networkHardwareDetails: undefined,
      softwareDetails: undefined,
    },
  });

  // Load product data into form
  useEffect(() => {
    if (selectedProduct && isDialogOpen) {
      form.reset({
        name: selectedProduct.name,
        slug: selectedProduct.slug,
        description: selectedProduct.description || "",
        brandName: selectedProduct.brandName || "",
        industry: selectedProduct.industry || "",
        imageUrl: selectedProduct.imageUrl || "",
        link: selectedProduct.link || "",
        priority: selectedProduct.priority || -1,
        showVendor: selectedProduct.showVendor || false,
        hasPricing: selectedProduct.hasPricing || false,
        sectionId: selectedProduct.section?.id || "",
        categoryId: selectedProduct.category?.id || "",
        vendorId: "",
        engagementBlock: selectedProduct.engagementBlock || undefined,
        pricing: selectedProduct.pricing || undefined,
        aiProductDetails: selectedProduct.aiProductDetails || undefined,
        datacenterCloudDetails:
          selectedProduct.datacenterCloudDetails || undefined,
        networkHardwareDetails:
          selectedProduct.networkHardwareDetails || undefined,
        softwareDetails: selectedProduct.softwareDetails || undefined,
      });
    } else if (!isEdit && isDialogOpen) {
      form.reset({
        name: "",
        slug: "",
        description: "",
        brandName: "",
        industry: "",
        imageUrl: "",
        link: "",
        priority: -1,
        showVendor: false,
        hasPricing: false,
        sectionId: "",
        categoryId: "",
        vendorId: "",
        engagementBlock: undefined,
        pricing: undefined,
        aiProductDetails: undefined,
        datacenterCloudDetails: undefined,
        networkHardwareDetails: undefined,
        softwareDetails: undefined,
      });
      setTabValidation({
        basic: false,
        engagement: false,
        details: false,
        pricing: false,
      });
      setActiveTab("basic");
    }
  }, [selectedProduct, isDialogOpen, isEdit, form]);

  // Validate tabs on form changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      const newValidation: TabValidationState = {
        basic: !!(
          values.name &&
          values.slug &&
          values.sectionId &&
          values.categoryId
        ),
        engagement: true, // Engagement is optional
        details: true, // Details are optional but validated based on section type
        pricing: true, // Pricing is optional
      };

      // Validate product details based on section type
      if (values.sectionId) {
        const section = sections.find((s) => s.id === values.sectionId);
        if (section) {
          switch (section.name.toLowerCase()) {
            case "ai":
              newValidation.details = !!values.aiProductDetails;
              break;
            case "datacenter & cloud":
              newValidation.details = !!values.datacenterCloudDetails;
              break;
            case "software":
              newValidation.details = !!values.softwareDetails;
              break;
            case "network & hardware":
              newValidation.details = !!values.networkHardwareDetails;
              break;
            default:
              newValidation.details = true;
          }
        }
      }

      setTabValidation(newValidation);
    });

    return () => subscription.unsubscribe();
  }, [form, sections]);

  const getTabForError = (errorKey: string): string => {
    if (["name", "slug", "sectionId", "categoryId"].includes(errorKey))
      return "basic";
    if (errorKey.startsWith("engagementBlock")) return "engagement";
    if (
      errorKey.startsWith("datacenterCloudDetails") ||
      errorKey.startsWith("softwareDetails") ||
      errorKey.startsWith("networkHardwareDetails") ||
      errorKey.startsWith("aiProductDetails")
    )
      return "details";
    if (errorKey.startsWith("pricing")) return "pricing";
    return "basic";
  };

  const onInvalidSubmit = (errors: any) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return;
    
    // Show error toast
    toast.error(`Please fix ${errorKeys.length} validation error${errorKeys.length !== 1 ? 's' : ''}`);
    
    // Navigate to first error tab
    const firstErrorKey = errorKeys[0];
    const targetTab = getTabForError(firstErrorKey);
    setActiveTab(targetTab as TabId);
  };

  const onSubmit = useCallback(
    async (data: z.infer<typeof schema>) => {
      setLoading(true);
      
      try {
        if (isEdit && selectedProduct) {
          await updateMutation.mutateAsync({
            params: { id: selectedProduct.id },
            body: data,
          });
        } else {
          await createMutation.mutateAsync(data);
        }
      } catch (error) {
        // Error handling is done in mutation onError callbacks
        console.error("Product operation failed:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      isEdit,
      selectedProduct,
      updateMutation,
      createMutation,
      setLoading,
    ]
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabId);
  };

  const watchedValues = form.watch();
  const hasPricing = watchedValues.hasPricing;

  const tabs = [
    { id: "basic", label: "Basic Info", icon: "📝" },
    { id: "engagement", label: "Engagement", icon: "💬" },
    { id: "details", label: "Product Details", icon: "📋" },
    ...(hasPricing
      ? [{ id: "pricing" as const, label: "Pricing", icon: "💰" }]
      : []),
  ];

  // Responsive: Top Tab Bar on Mobile, Sidebar on Desktop
  const NavTabs = (
    <nav
      className={cn(
        "flex flex-shrink-0",
        isMobile
          ? "gap-1 w-full border-b bg-white sticky top-0 z-10 px-4 py-2 overflow-x-auto"
          : "flex-col w-full max-w-60 border-r bg-gray-50/70 p-4 overflow-y-auto"
      )}
    >
      {tabs.map((tab, idx) => {
        const hasErrors = Object.keys(form.formState.errors).some(
          (errorKey) => getTabForError(errorKey) === tab.id
        );
        return (
          <motion.button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as TabId)}
            className={cn(
              isMobile
                ? "flex-shrink-0 py-2 px-3 rounded-lg font-medium text-xs flex flex-col items-center transition-all relative min-w-fit"
                : "w-full text-left p-4 rounded-lg font-medium transition-all relative flex items-center gap-3 mb-2",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : hasErrors
                ? "bg-red-50/80 border border-red-200 text-red-700"
                : "hover:bg-gray-100"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <span className={cn("text-lg", isMobile ? "text-sm" : "")}>
              {tab.icon}
            </span>
            <span className={cn(isMobile ? "text-xs mt-1" : "text-sm")}>
              {tab.label}
            </span>
            {hasErrors && (
              <span className="absolute right-2 top-2 w-2 h-2 bg-red-600 rounded-full" />
            )}
            {hasErrors && !isMobile && activeTab !== tab.id && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-xs text-red-600 mt-1"
              >
                Has validation errors
              </motion.p>
            )}
          </motion.button>
        );
      })}
    </nav>
  );

  const canSubmit = Object.values(tabValidation).every(Boolean);

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={closeDialog}>
      <AlertDialogContent className="m-0 p-0 w-full max-w-6xl md:h-[90vh] h-full overflow-auto">
        <AlertDialogHeader className="p-4 sm:p-6 pb-2 sm:pb-4 flex-shrink-0 border-b">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <AlertDialogTitle className="text-xl sm:text-2xl font-bold">
                {isEdit ? "Edit Product" : "Create New Product"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm sm:text-base">
                Manage product details
              </AlertDialogDescription>
            </div>
            <AlertDialogCancel className="h-8 w-8 p-0">
              <X size={16} />
            </AlertDialogCancel>
          </div>
        </AlertDialogHeader>

        <Form {...form}>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)}
              className="flex flex-col h-full"
            >
              <div
                className={cn(
                  "flex-1 flex bg-white overflow-hidden h-full",
                  isMobile ? "flex-col" : ""
                )}
              >
                {/* Tab Navigation */}
                {NavTabs}

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="max-w-none"
                    >
                      {activeTab === "basic" && (
                        <BasicProductForm form={form} sections={sections} />
                      )}
                      {activeTab === "engagement" && (
                        <EngagementBlockForm form={form} />
                      )}
                      {activeTab === "details" && (
                        <ProductDetailsForm form={form} sections={sections} />
                      )}
                      {activeTab === "pricing" && hasPricing && (
                        <PricingForm form={form} />
                      )}
                    </motion.div>
                  </div>

                  {/* Footer Actions */}
                  <div
                    className={cn(
                      "border-t p-4 sm:p-6 flex justify-between items-center flex-shrink-0",
                      isMobile ? "flex-col gap-3" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-4",
                        isMobile ? "w-full justify-between order-2" : ""
                      )}
                    >
                      <Button
                        disabled={form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending}
                        type="button"
                        variant="outline"
                        size={isMobile ? "sm" : "default"}
                        onClick={() => {
                          closeDialog();
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      {Object.keys(form.formState.errors).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-xs sm:text-sm text-red-600 bg-red-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-red-200"
                        >
                          {Object.keys(form.formState.errors).length} validation
                          error
                          {Object.keys(form.formState.errors).length !== 1
                            ? "s"
                            : ""}{" "}
                          found
                        </motion.div>
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        isMobile ? "w-full justify-between order-1" : ""
                      )}
                    >
                      {/* Quick Navigation */}
                      {!isMobile && (
                        <div className="flex gap-1">
                          {tabs.map((tab) => (
                            <Button
                              key={tab.id}
                              type="button"
                              variant={
                                activeTab === tab.id ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setActiveTab(tab.id as TabId)}
                              className="w-8 h-8 p-0"
                              title={tab.label}
                            >
                              {tab.icon}
                            </Button>
                          ))}
                        </div>
                      )}
                      <Button
                        type="submit"
                        className="gap-2 min-w-[120px] sm:min-w-[140px]"
                        size={isMobile ? "sm" : "default"}
                        disabled={form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending}
                      >
                        {(form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending) ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                            Saving...
                          </>
                        ) : (
                          <>
                            <span>💾</span>
                            {isEdit ? "Update Product" : "Create Product"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

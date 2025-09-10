import { z } from "zod";
import { QueryParamsSchema } from ".";
import { SectionSchema } from "./section";
import { CategorySchema } from "./category";
import { EngagementBlockSchema, PricingSchema } from "./reusable-block";
import { DatacenterCloudType } from "@generated/client/enums";

export const LabelLinkPrioritySchema = z.object({
  label: z.string().min(1, "Label is required"),
  link: z.url("Link must be a valid URL").or(z.literal("")),
  priority: z.number().default(-1),
});

export const NetworkHardwareDetailsSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  model: z.string().min(1, "Model name is required"),
  features: z.array(z.string()),
  productId: z.string().optional(),
});

export const SoftwarePlanSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  name: z.string().min(1, "Plan name is required"),
  priority: z.number().int().default(-1),
  features: z.array(z.string()).default([]),
  softwareDetailsId: z.string().optional(),
});

export const SoftwareDetailsSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  viewLink: z.string().optional(),
  softwarePlans: z.array(z.lazy(() => SoftwarePlanSchema)).default([]),
  productId: z.string().optional(),
});

export const DatacenterCloudDetailsSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  type: z.enum(DatacenterCloudType).default("DATA_CENTER"),
  isAiCertified: z.boolean().default(false),
  isGreenCompatible: z.boolean().default(false),
  aiCertifiedLink: z.string().optional(),
  greenCompatibleLink: z.string().optional(),
  features: z.array(z.string()),
  certifications: LabelLinkPrioritySchema.optional(),
  locations: LabelLinkPrioritySchema.optional(),
  services: LabelLinkPrioritySchema.optional(),
  expertise: LabelLinkPrioritySchema.optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  productId: z.string().optional(),
});

const DisplayOptionsSchema = z
  .object({
    text: z.string(),
    link: z.url().or(z.string()),
    badgeColor: z.string(),
    showIcon: z.boolean().default(false),
  })
  .partial();

export const AIProductDetailsSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  includeDetails: z.boolean().default(false),
  solidDotColor: z.string().optional(),
  rating: z.number().default(0),
  reviewCount: z.number().int().default(0),
  tagline1: z.string().optional(),
  tagline2: z.string().optional(),
  isClaimable: z.boolean().default(false),
  claim: DisplayOptionsSchema.optional(),
  showStartupOffer: z.boolean().default(false),
  startupOffer: DisplayOptionsSchema.optional(),
  showSpecialOffer: z.boolean().default(false),
  specialOffer: DisplayOptionsSchema.optional(),
  showStartTrial: z.boolean().default(false),
  startTrial: DisplayOptionsSchema.optional(),
  showBookDemo: z.boolean().default(false),
  bookDemo: DisplayOptionsSchema.optional(),
  showQuote: z.boolean().default(false),
  quote: DisplayOptionsSchema.optional(),
  showCallBack: z.boolean().default(false),
  callBack: DisplayOptionsSchema.optional(),
  showChat: z.boolean().default(false),
  chat: DisplayOptionsSchema.optional(),
  showDiscount: z.boolean().default(false),
  discount: DisplayOptionsSchema.optional(),
  showWebinar: z.boolean().default(false),
  webinar: DisplayOptionsSchema.extend({
    dateTime: z.date().optional(),
  }).optional(),
  productId: z.string().optional(),
});

export const BaseProductSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  name: z.string(),
  slug: z.string(),
  brandName: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  link: z.string().optional(),
  priority: z.number().int().default(-1),
  showVendor: z.boolean().default(false),
  hasPricing: z.boolean().default(false),
  sectionId: z.string().optional(),
  categoryId: z.string().optional(),
  vendorId: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const ProductSchema = BaseProductSchema.extend({
  engagementBlock: EngagementBlockSchema.optional(),
  pricing: PricingSchema.optional(),
  aiProductDetails: z.lazy(() => AIProductDetailsSchema).optional(),
  datacenterCloudDetails: z.lazy(() => DatacenterCloudDetailsSchema).optional(),
  networkHardwareDetails: z.lazy(() => NetworkHardwareDetailsSchema).optional(),
  softwareDetails: z.lazy(() => SoftwareDetailsSchema).optional(),
});

export const CreateProductSchema = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }).extend({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  sectionId: z.string().min(1, "Section is required"),
  categoryId: z.string().min(1, "Category is required"),
});
export const UpdateProductSchema = ProductSchema.omit({ createdAt: true, updatedAt: true, id: true }).extend({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Product slug is required"),
  sectionId: z.string().min(1, "Section is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export const ProductQueryParamsSchema = QueryParamsSchema.extend(
  BaseProductSchema.pick({
    categoryId: true,
    sectionId: true,
    vendorId: true,
  }).partial().shape
);

export const ProductResponseSchema = ProductSchema.omit({
  sectionId: true,
  categoryId: true,
  vendorId: true,
}).extend({
  section: SectionSchema.pick({
    id: true,
    slug: true,
    type: true,
  }).optional(),
  category: CategorySchema.pick({
    id: true,
    slug: true,
  }).optional(),
});

export type NetworkHardwareDetailsSchema = z.infer<
  typeof NetworkHardwareDetailsSchema
>;
export type SoftwarePlanSchema = z.infer<typeof SoftwarePlanSchema>;
export type SoftwareDetailsSchema = z.infer<typeof SoftwareDetailsSchema>;
export type DatacenterCloudDetailsSchema = z.infer<
  typeof DatacenterCloudDetailsSchema
>;
export type AIProductDetailsSchema = z.infer<typeof AIProductDetailsSchema>;
export type BaseProductSchema = z.infer<typeof BaseProductSchema>;
export type ProductSchema = z.infer<typeof ProductSchema>;
export type CreateProductSchema = z.infer<typeof CreateProductSchema>;
export type UpdateProductSchema = z.infer<typeof UpdateProductSchema>;
export type ProductQueryParamsSchema = z.infer<typeof ProductQueryParamsSchema>;
export type ProductResponseSchema = z.infer<typeof ProductResponseSchema>;
export type LabelLinkPrioritySchema = z.infer<typeof LabelLinkPrioritySchema>;

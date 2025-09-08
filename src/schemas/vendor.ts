import { z } from "zod";

export const VendorSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  brandName: z.string().min(1, "Brand name is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyLogo: z.string().min(1, "Company logo is required"),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  city: z.string(),
  pan: z.string().optional(),
  gstin: z.string().optional(),
  msme: z.string().optional(),
  msmeAttachment: z.url().optional().or(z.literal("")),
  panAttachment: z.url().optional().or(z.literal("")),
  gstinAttachment: z.url().optional().or(z.literal("")),
  coiAttachment: z.url().optional().or(z.literal("")),
  shareLinks: z.any().optional(),
  createdByAdmin: z.boolean().default(false),
  priority: z.number().int().default(-1),
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  userId: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type VendorSchema = z.infer<typeof VendorSchema>;

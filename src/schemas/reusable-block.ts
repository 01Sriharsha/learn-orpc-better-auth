import z from "zod";

export const EngagementEmbedTypeSchema = z.enum(
  ["LINK", "EMBEDDABLE", "FILE"],
  {
    error: "Invalid embed type",
  }
);
export const EngagementEmbedType = EngagementEmbedTypeSchema.enum;

export const CurrencySchema = z.enum(["INR", "USD", "EUR"], {
  error: "Invalid currency",
});
export const Currency = CurrencySchema.enum;

export const ShareLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  link: z.string().min(1, "Link is required"),
  priority: z.number().default(-1),
});

export const InfoDetailsSchema = z.object({
  infoType: z.enum(EngagementEmbedType),
  info: z.string().optional(),
  infoText: z.string().optional(),
  infoLinkButtonText: z.string().optional(),
});

export const BrochureDetailsSchema = z.object({
  brochureType: z.enum(EngagementEmbedType),
  brochureUrl: z.string().optional(),
});

export const FormDetailsSchema = z.object({
  formType: z.enum(EngagementEmbedType),
  formValue: z.string().optional(),
});

export const TrendingBrandsDetailsSchema = z.object({
  trendingBrandsText: z.string().optional(),
});

export const CalendarDetailsSchema = z.object({
  calendarLink: z.string().optional(),
});

export const BadgeDetailsSchema = z.object({
  badgeColor: z.string().optional(),
  badgeText: z.string().optional(),
});

// For Engagement form
export const EngagementBlockSchema = z.object({
  showInfo: z.boolean().default(false),
  infoDetails: InfoDetailsSchema.optional(),

  showBrochure: z.boolean().default(false),
  brochureDetails: BrochureDetailsSchema.optional(),

  showForm: z.boolean().default(false),
  formDetails: FormDetailsSchema.optional(),

  showTrendingBrands: z.boolean().default(false),
  trendingBrandsDetails: TrendingBrandsDetailsSchema.optional(),

  showCalendar: z.boolean().default(false),
  calendarDetails: CalendarDetailsSchema.optional(),

  showShareLinks: z.boolean().default(false),
  shareLinks: ShareLinkSchema.array().optional(),

  showBadge: z.boolean().default(false),
  badgeDetails: BadgeDetailsSchema.optional(),

  productId: z.string().optional(),
});

export const PricingSchema = z.object({
  isStartingPrice: z.boolean().default(false).optional(),
  price: z.number().nonnegative().optional(),
  priceText: z.string().optional(),
  currency: z.enum(Currency).default("INR").optional(),
  btnText: z.string().optional(),
  btnLink: z.string().optional(),
  hasFreeDemo: z.boolean().default(false).optional(),
  freeDemoLink: z.string().optional(),
  productId: z.string().optional(),
});

export type EngagementBlockSchema = z.infer<typeof EngagementBlockSchema>;
export type ShareLinkSchema = z.infer<typeof ShareLinkSchema>;
export type InfoDetailsSchema = z.infer<typeof InfoDetailsSchema>;
export type BrochureDetailsSchema = z.infer<typeof BrochureDetailsSchema>;
export type FormDetailsSchema = z.infer<typeof FormDetailsSchema>;
export type TrendingBrandsDetailsSchema = z.infer<
  typeof TrendingBrandsDetailsSchema
>;
export type CalendarDetailsSchema = z.infer<typeof CalendarDetailsSchema>;
export type BadgeDetailsSchema = z.infer<typeof BadgeDetailsSchema>;
export type EngagementEmbedTypeSchema = z.infer<
  typeof EngagementEmbedTypeSchema
>;
export type CurrencySchema = z.infer<typeof CurrencySchema>;
export type PricingSchema = z.infer<typeof PricingSchema>;

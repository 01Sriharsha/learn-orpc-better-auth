import { EventWebinarType } from "@generated/client/enums";

import { z } from "zod";

import { EngagementBlockSchema, PricingSchema } from "@/schemas/reusable-block";

export const EventWebinarSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  type: z.enum(EventWebinarType).default("EVENT"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  priority: z.number().default(-1),
  date: z.date().default(() => new Date()),
  city: z.string().optional(),
  address: z.string().optional(),
  hasPricing: z.boolean().default(false),
  sectionId: z.string().optional(),
  categoryId: z.string().optional(),
  engagementBlock: EngagementBlockSchema.optional(),
  pricing: PricingSchema.optional(),
});

export type EventWebinarSchema = z.infer<typeof EventWebinarSchema>;

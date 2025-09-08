import { ShowcaseMediaType } from "@generated/client/enums";

import { z } from "zod";

import { EngagementBlockSchema } from "@/schemas/reusable-block";

export const ShowcaseSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  mediaType: z.enum(ShowcaseMediaType).default("IMAGE"),
  url: z.url().optional().or(z.literal("")),
  priority: z.number().default(-1),
  engagementBlock: EngagementBlockSchema.optional(),
  sectionId: z.string().optional(),
  categoryId: z.string().optional(),
  vendorId: z.string().optional(),
});

export type ShowcaseSchema = z.infer<typeof ShowcaseSchema>;

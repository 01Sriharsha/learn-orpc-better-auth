import { SectionType } from "@generated/client/enums";

import z from "zod";

import { QueryParamsSchema } from "@/schemas";

export const SectionSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "slug is required"),
  type: z.enum(SectionType, { error: "Invalid section type" }),
  priority: z.number().default(-1),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export const SectionQueryParamsSchema = QueryParamsSchema.extend(
  SectionSchema.pick({ type: true }).partial().shape
);

export type SectionSchema = z.infer<typeof SectionSchema>;
export type SectionQueryParamsSchema = z.infer<typeof SectionQueryParamsSchema>;

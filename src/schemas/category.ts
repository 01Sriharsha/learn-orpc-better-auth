import { QueryParamsSchema } from "@/schemas";
import z from "zod";

export const CategorySchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().nullable().optional(),
  imageUrl: z.url().nullable().optional(),
  priority: z.coerce.number().default(-1),
  level: z.coerce.number().default(0),
  parentId: z.uuid().nullable().optional(),
  sectionId: z.uuid().nullable().optional(),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export const CategoryQueryParamsSchema = QueryParamsSchema.extend({
  ...CategorySchema.pick({
    sectionId: true,
    parentId: true,
    level: true,
  }).partial().shape,
});

// Response schema with relations (for output)
export const CategoryWithRelationsSchema = CategorySchema.omit({
  sectionId: true,
  parentId: true,
}).extend({
  section: z
    .object({
      id: z.string(),
      slug: z.string(),
    })
    .nullable()
    .optional(),
  parent: z
    .object({
      id: z.string(),
      slug: z.string(),
    })
    .nullable()
    .optional(),
  childrenLength: z.number(),
});

export type CategorySchema = z.infer<typeof CategorySchema>;
export type CategoryQueryParamsSchema = z.infer<
  typeof CategoryQueryParamsSchema
>;
export type CategoryWithRelationsSchema = z.infer<
  typeof CategoryWithRelationsSchema
>;

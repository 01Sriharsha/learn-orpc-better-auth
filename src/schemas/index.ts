import z from "zod";

export const transformQuery = <T extends QueryParamsSchema>(query: T) => {
  const { page, limit, ...rest } = query;
  return {
    ...rest,
    page: Number(page),
    limit: Number(limit),
  };
};

export const ResponseSchema = z.object({
  message: z.string().default("Success"),
  data: z.any().nullable().optional(),
});

export const PaginationResponseSchema = ResponseSchema.extend({
  data: z.object({
    total: z.coerce.number().default(0),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    content: z.array(z.any()).default([]),
    totalPages: z.coerce.number().default(0),
  }),
});

export const IdentifiersSchema = z.object({
  id: z.string({ error: "Invalid Id" }).min(1, "Id is required"),
  slug: z.string().min(1, "Slug is required"),
});

export const QueryParamsSchema = z
  .object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    sort: z.enum(["asc", "desc"]).default("asc"),
    sortBy: z.enum(["createdAt", "priority"]).default("createdAt"),
    keyword: z.string().default(""),
  })
  .partial();

export type QueryParamsSchema = z.infer<typeof QueryParamsSchema>;
export type IdentifiersSchema = z.infer<typeof IdentifiersSchema>;
export type ResponseSchema = z.infer<typeof ResponseSchema>;
export type PaginationResponseSchema = z.infer<typeof PaginationResponseSchema>;

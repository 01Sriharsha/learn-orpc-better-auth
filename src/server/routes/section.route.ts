import { Prisma } from "@generated/client/client";

import { ORPCError } from "@orpc/client";
import z from "zod";

import { db } from "@/lib/db";
import { IdentifiersSchema, ResponseSchema, transformQuery } from "@/schemas";
import { SectionQueryParamsSchema, SectionSchema } from "@/schemas/section";

import { base } from "@/server";
import { requireAuth } from "@/server/middlewares/auth.middleware";
import { paginationResponse } from "@/server/utils";

const sectionRouter = base
  .route({ path: "/section", tags: ["Section"] })
  .errors({
    NOT_FOUND: { message: "Section not found" },
    CONFLICT: { message: "Section already exists" },
  });

export const createSection = sectionRouter
  .use(requireAuth("admin"))
  .route({ method: "POST", path: "/", summary: "Create a new section" })
  .input(SectionSchema.omit({ id: true, createdAt: true, updatedAt: true }))
  .output(ResponseSchema.safeExtend({ data: SectionSchema }))
  .handler(async ({ input, errors }) => {
    await checkSectionNameExists(input.name);
    const section = await db.section.create({ data: input });
    if (!section)
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to create section",
      });
    return {
      message: "Section created successfully",
      data: section,
    };
  });

export const getSections = sectionRouter
  .route({ method: "GET", path: "/", summary: "Get all sections" })
  .input(SectionQueryParamsSchema)
  .handler(async ({ input }) => {
    const {
      sort,
      sortBy = "priority",
      page = 1,
      pageSize = 10,
      keyword,
      type,
    } = input;

    const where: Prisma.SectionWhereInput = {};

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: "insensitive",
      };
    }
    if (type) where.type = type;

    const [sections, total] = await Promise.all([
      db.section.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { [sortBy]: sort },
      }),
      db.section.count({ where }),
    ]);
    return {
      message: "Sections fetched successfully",
      data: paginationResponse({ page, pageSize, total, content: sections }),
    };
  });

export const getSectionById = sectionRouter
  .route({
    method: "GET",
    path: "/{id}",
    summary: "Get section by ID",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ id: true }),
    })
  )
  .output(ResponseSchema.safeExtend({ data: SectionSchema.nullable() }))
  .handler(async ({ input }) => {
    const { id } = input.params;
    const section = await db.section.findUnique({
      where: { id },
    });
    if (!section)
      throw new ORPCError("NOT_FOUND", {
        message: "Section not found",
      });
    return {
      message: "Section fetched successfully",
      data: section,
    };
  });

export const getSectionBySlug = sectionRouter
  .route({
    method: "GET",
    path: "/slug/{slug}",
    summary: "Get section by slug",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ slug: true }),
    })
  )
  .output(ResponseSchema.safeExtend({ data: SectionSchema.nullable() }))
  .handler(async ({ input }) => {
    const { slug } = input.params;
    const section = await db.section.findUnique({
      where: { slug },
    });
    if (!section)
      throw new ORPCError("NOT_FOUND", {
        message: "Section not found",
      });
    return {
      message: "Section fetched successfully",
      data: section,
    };
  });

export const updateSection = sectionRouter
  .use(requireAuth("admin"))
  .route({
    method: "PUT",
    path: "/{id}",
    summary: "Update a section",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ id: true }),
      body: SectionSchema.omit({ createdAt: true, updatedAt: true }),
    })
  )
  .output(ResponseSchema.safeExtend({ data: SectionSchema }))
  .handler(async ({ input, errors }) => {
    const { id } = input.params;
    const { name } = input.body;
    const section = await db.section.findUnique({ where: { id } });
    if (!section) throw errors.NOT_FOUND();
    await checkSectionNameExists(name, id);
    const updatedSection = await db.section.update({
      where: { id },
      data: { ...input.body },
    });
    if (!updatedSection)
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to update section",
      });
    return {
      message: "Section updated successfully",
      data: updatedSection,
    };
  });

export const deleteSection = sectionRouter
  .use(requireAuth("admin"))
  .route({
    method: "DELETE",
    path: "/{id}",
    summary: "Delete a section",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ id: true }),
    })
  )
  .output(ResponseSchema)
  .handler(async ({ input, errors }) => {
    const { id } = input.params;
    const section = await db.section.findUnique({ where: { id } });
    if (!section) throw errors.NOT_FOUND();
    await db.section.delete({ where: { id } });
    return {
      message: "Section deleted successfully",
    };
  });

/**
 * Checks if a section with the given name exists.
 * On update, If the section exists and its ID is not the same as the provided ID, throws a conflict error.
 */
const checkSectionNameExists = async (name: string, id?: string) => {
  const section = await db.section.findFirst({ where: { name } });
  if (section && section.id !== id)
    throw new ORPCError("CONFLICT", {
      message: "Section already exists",
    });
};

export const sectionRoute = base.prefix("/section").router({
  create: createSection,
  get: getSections,
  getById: getSectionById,
  update: updateSection,
  delete: deleteSection,
});

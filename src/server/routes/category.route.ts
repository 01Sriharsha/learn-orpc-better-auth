import { Prisma } from "@generated/client/client";

import { ORPCError } from "@orpc/server";
import z from "zod";

import { db } from "@/lib/db";
import { IdentifiersSchema } from "@/schemas";
import {
  CategoryQueryParamsSchema,
  CategorySchema,
  CategoryWithRelationsSchema,
} from "@/schemas/category";

import { base } from "@/server";
import { requireAuth } from "@/server/middlewares/auth.middleware";
import { paginationResponse } from "@/server/utils";

const DefaultCategoryArgs = {
  include: {
    section: { select: { id: true, slug: true } },
    parent: { select: { id: true, slug: true } },
    _count: { select: { children: true } },
  },
  omit: {
    sectionId: true,
    parentId: true,
  },
} satisfies Prisma.CategoryDefaultArgs;

const categoryRouter = base
  .route({ path: "/category", tags: ["Category"] })
  .errors({
    NOT_FOUND: { message: "Category not found" },
    CONFLICT: { message: "Category already exists" },
  });

export const createCategory = categoryRouter
  .use(requireAuth("admin"))
  .route({ method: "POST", path: "/", summary: "Create a new category" })
  .input(CategorySchema.omit({ id: true, createdAt: true, updatedAt: true }))
  .handler(async ({ input, errors }) => {
    await checkCategoryNameExists(input.name);
    const category = await db.category.create({ data: input });
    if (!category)
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to create category",
      });
    return {
      message: "Category created successfully",
      data: category,
    };
  });

export const getCategories = categoryRouter
  .route({ method: "GET", path: "/", summary: "Get all categories" })
  .input(CategoryQueryParamsSchema)
  .handler(async ({ input }) => {
    const {
      sort,
      sortBy = "priority",
      page = 1,
      pageSize = 10,
      keyword,
      level,
      parentId,
      sectionId,
    } = input;

    const where: Prisma.CategoryWhereInput = {};

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: "insensitive",
      };
    }
    if (level !== undefined) where.level = level;
    if (parentId) where.parentId = parentId;
    if (sectionId) where.sectionId = sectionId;

    const [categories, total] = await Promise.all([
      db.category.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { [sortBy]: sort },
        ...DefaultCategoryArgs,
      }),
      db.category.count({ where }),
    ]);

    const formattedCategories = categories.map((c) => ({
      ...c,
      _count: undefined,
      childrenLength: c._count.children as number,
    }));

    const parsed =
      CategoryWithRelationsSchema.array().parse(formattedCategories);

    return {
      message: "Categories fetched successfully",
      data: paginationResponse({
        page,
        pageSize,
        total,
        content: parsed,
      }),
    };
  });

export const getCategoryById = categoryRouter
  .route({
    method: "GET",
    path: "/{id}",
    summary: "Get category by ID",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ id: true }),
    })
  )
  .handler(async ({ input, errors }) => {
    const { id } = input.params;
    const category = await db.category.findUnique({
      where: { id },
      ...DefaultCategoryArgs,
    });
    if (!category) throw errors.NOT_FOUND();

    return {
      message: "Category fetched successfully",
      data: {
        ...category,
        _count: undefined,
        childrenLength: category._count.children,
      },
    };
  });

export const getCategoryBySlug = categoryRouter
  .route({
    method: "GET",
    path: "/slug/{slug}",
    summary: "Get category by slug",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ slug: true }),
    })
  )
  .handler(async ({ input, errors }) => {
    const { slug } = input.params;
    const category = await db.category.findUnique({
      where: { slug },
      ...DefaultCategoryArgs,
    });
    if (!category) throw errors.NOT_FOUND();

    return {
      message: "Category fetched successfully",
      data: {
        ...category,
        _count: undefined,
        childrenLength: category._count.children as number,
      },
    };
  });

export const updateCategory = categoryRouter
  .use(requireAuth("admin"))
  .route({
    method: "PUT",
    path: "/{id}",
    summary: "Update a category",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ id: true }),
      body: CategorySchema.omit({ createdAt: true, updatedAt: true }),
    })
  )
  .handler(async ({ input, errors }) => {
    const { id } = input.params;
    const { name } = input.body;

    const category = await db.category.findUnique({ where: { id } });
    if (!category) throw errors.NOT_FOUND();

    await checkCategoryNameExists(name, id);

    const updatedCategory = await db.category.update({
      where: { id },
      data: { ...input.body },
    });
    if (!updatedCategory)
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to update category",
      });
    return {
      message: "Category updated successfully",
      data: updatedCategory,
    };
  });

export const deleteCategory = categoryRouter
  .use(requireAuth("admin"))
  .route({
    method: "DELETE",
    path: "/{id}",
    summary: "Delete a category",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ id: true }),
    })
  )
  .handler(async ({ input, errors }) => {
    const { id } = input.params;
    const category = await db.category.findUnique({ where: { id } });
    if (!category) throw errors.NOT_FOUND();

    await db.category.delete({ where: { id } });
    return {
      message: "Category deleted successfully",
    };
  });

/**
 * Checks if a category with the given name exists.
 * On update, if the category exists and its ID is not the same as the provided ID, throws a conflict error.
 */
const checkCategoryNameExists = async (name: string, id?: string) => {
  const category = await db.category.findFirst({ where: { name } });
  if (category && category.id !== id)
    throw new ORPCError("CONFLICT", {
      message: "Category already exists",
    });
};

export const categoryRoute = base.prefix("/category").router({
  create: createCategory,
  get: getCategories,
  getById: getCategoryById,
  getBySlug: getCategoryBySlug,
  update: updateCategory,
  delete: deleteCategory,
});

export type CategoryRoute = typeof categoryRoute;

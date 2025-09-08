import { Prisma } from "@generated/client/client";
import { SectionType } from "@generated/client/enums";

import { ORPCError } from "@orpc/server";
import z from "zod";

import { db } from "@/lib/db";
import { IdentifiersSchema, ResponseSchema } from "@/schemas";
import {
  ProductQueryParamsSchema,
  ProductResponseSchema,
  ProductSchema,
} from "@/schemas/product";

import { base } from "@/server";
import { requireAuth } from "@/server/middlewares/auth.middleware";
import { paginationResponse } from "@/server/utils";

const DefaultProductArgs = {
  include: {
    section: { select: { id: true, slug: true, type: true } },
    category: { select: { id: true, slug: true } },
    vendor: { select: { id: true, brandName: true } },
    engagementBlock: true,
    pricing: true,
    aiProductDetails: true,
    datacenterCloudDetails: true,
    networkHardwareDetails: true,
    softwareDetails: { include: { softwarePlans: true } },
  },
  omit: {
    sectionId: true,
    categoryId: true,
    vendorId: true,
  },
} satisfies Prisma.ProductDefaultArgs;

const productRouter = base
  .route({ path: "/product", tags: ["Product"] })
  .errors({
    NOT_FOUND: { message: "Product not found" },
    CONFLICT: { message: "Product already exists" },
    BAD_REQUEST: { message: "Invalid request" },
  });

export const createProduct = productRouter
  .use(requireAuth("admin"))
  .route({ method: "POST", path: "/", summary: "Create a new product" })
  .input(ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }))
  .output(ResponseSchema.safeExtend({ data: ProductResponseSchema }))
  .handler(async ({ input, errors }) => {
    const createdProduct = await createOrUpdateProduct(
      input,
      undefined,
      errors
    );
    return {
      message: "Product created successfully",
      data: createdProduct,
    };
  });

export const getProducts = productRouter
  .route({ method: "GET", path: "/", summary: "Get all products" })
  .input(ProductQueryParamsSchema)
  .handler(async ({ input, errors }) => {
    const {
      sort,
      sortBy = "priority",
      page = 1,
      limit = 10,
      keyword,
      categoryId,
      sectionId,
      vendorId,
    } = input;

    if (limit > 100) {
      throw errors.BAD_REQUEST({
        message: "Only 100 products can be fetched at a time",
      });
    }

    const where: Prisma.ProductWhereInput = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (sectionId) where.sectionId = sectionId;
    if (vendorId) where.vendorId = vendorId;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { [sortBy]: sort },
        ...DefaultProductArgs,
      }),
      db.product.count({ where }),
    ]);

    return {
      message: "Products fetched successfully",
      data: paginationResponse({
        page,
        limit,
        total,
        content: products,
      }),
    };
  });

export const getProductById = productRouter
  .route({
    method: "GET",
    path: "/{id}",
    summary: "Get product by ID",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ id: true }),
    })
  )
  .handler(async ({ input, errors }) => {
    const { id } = input.params;
    const product = await db.product.findUnique({
      where: { id },
      ...DefaultProductArgs,
    });
    if (!product) throw errors.NOT_FOUND();

    const {
      engagementBlock,
      pricing,
      datacenterCloudDetails,
      aiProductDetails,
      networkHardwareDetails,
      softwareDetails,
      ...productDetails
    } = product;

    const cleaned = {
      ...productDetails,
      ...(datacenterCloudDetails ? { datacenterCloudDetails } : undefined),
      ...(networkHardwareDetails ? { networkHardwareDetails } : undefined),
      ...(engagementBlock ? { engagementBlock } : undefined),
      ...(pricing ? { pricing } : undefined),
      ...(aiProductDetails ? { aiProductDetails } : undefined),
      ...(softwareDetails ? { softwareDetails } : undefined),
    };

    return {
      message: "Product fetched successfully",
      data: cleaned,
    };
  });

export const getProductBySlug = productRouter
  .route({
    method: "GET",
    path: "/slug/{slug}",
    summary: "Get product by slug",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ slug: true }),
    })
  )
  .handler(async ({ input, errors }) => {
    const { slug } = input.params;
    const product = await db.product.findUnique({
      where: { slug },
      ...DefaultProductArgs,
    });
    if (!product) throw errors.NOT_FOUND();

    return {
      message: "Product fetched successfully",
      data: product,
    };
  });

export const updateProduct = productRouter
  .use(requireAuth("admin"))
  .route({
    method: "PUT",
    path: "/{id}",
    summary: "Update a product",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ id: true }),
      body: ProductSchema.omit({ createdAt: true, updatedAt: true, id: true }),
    })
  )
  .handler(async ({ input, errors }) => {
    const { id } = input.params;
    const updatedProduct = await createOrUpdateProduct(input.body, id, errors);
    return {
      message: "Product updated successfully",
      data: updatedProduct,
    };
  });

export const deleteProduct = productRouter
  .use(requireAuth("admin"))
  .route({
    method: "DELETE",
    path: "/{id}",
    summary: "Delete a product",
    inputStructure: "detailed",
  })
  .input(
    z.object({
      params: IdentifiersSchema.pick({ id: true }),
    })
  )
  .handler(async ({ input, errors }) => {
    const { id } = input.params;
    const product = await db.product.findUnique({ where: { id } });
    if (!product) throw errors.NOT_FOUND();

    await db.product.delete({ where: { id } });
    return {
      message: "Product deleted successfully",
    };
  });

/**
 * A utility function to create or update a product
 */
const createOrUpdateProduct = async (
  body: Omit<ProductSchema, "createdAt" | "updatedAt" | "id">,
  updateId?: string,
  errors?: any
) => {
  const {
    engagementBlock,
    pricing,
    aiProductDetails,
    datacenterCloudDetails,
    networkHardwareDetails,
    softwareDetails,
    ...product
  } = body;

  const isUpdate = !!updateId;

  // Check if product exists for update
  if (isUpdate) {
    const existingProduct = await db.product.findUnique({
      where: { id: updateId },
    });
    if (!existingProduct) {
      throw (
        errors?.NOT_FOUND() ||
        new ORPCError("NOT_FOUND", {
          message: "Product not found",
        })
      );
    }
  }

  const section = await db.section.findUnique({
    where: { id: product.sectionId },
  });

  if (!section) {
    throw (
      errors?.NOT_FOUND({
        message: "Section not found",
      }) ||
      new ORPCError("NOT_FOUND", {
        message: "Section not found",
      })
    );
  }

  const upsert: Prisma.ProductUpsertArgs = {
    where: { id: updateId ?? "" },
    create: { ...product },
    update: { ...product },
  };

  const action = isUpdate ? "update" : ("create" as const);

  if (section.type === SectionType.AI_LIKE && aiProductDetails) {
    upsert[action].aiProductDetails = { [action]: aiProductDetails };
  }

  if (
    (section.type === SectionType.DATA_CENTER ||
      section.type === SectionType.CLOUD) &&
    datacenterCloudDetails
  ) {
    upsert[action].datacenterCloudDetails = {
      [action]: datacenterCloudDetails,
    };
  }

  if (section.type === SectionType.NETWORK_HARDWARE && networkHardwareDetails) {
    upsert[action].networkHardwareDetails = {
      [action]: networkHardwareDetails,
    };
  }

  if (section.type === SectionType.SOFTWARE && softwareDetails) {
    if (isUpdate) {
      upsert.update.softwareDetails = {
        update: {
          ...softwareDetails,
          softwarePlans: {
            deleteMany: { softwareDetailsId: softwareDetails.id },
            createMany: { data: softwareDetails.softwarePlans },
          },
        },
      };
    } else {
      upsert.create.softwareDetails = {
        create: {
          ...softwareDetails,
          softwarePlans: {
            createMany: { data: softwareDetails.softwarePlans },
          },
        },
      };
    }
  }

  if (product.hasPricing && pricing) {
    upsert[action].pricing = { [action]: pricing };
  }

  if (engagementBlock) {
    upsert[action].engagementBlock = { [action]: engagementBlock };
  }

  const savedProduct = await db.product.upsert({
    ...upsert,
    ...DefaultProductArgs,
  });
  if (!savedProduct) {
    throw (
      errors?.INTERNAL_SERVER_ERROR({
        message: `Failed to ${action} product`,
      }) ||
      new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `Failed to ${action} product`,
      })
    );
  }

  return ProductResponseSchema.parse(savedProduct);
};

export const productRoute = base.prefix("/product").router({
  create: createProduct,
  get: getProducts,
  getById: getProductById,
  getBySlug: getProductBySlug,
  update: updateProduct,
  delete: deleteProduct,
});

export type ProductRoute = typeof productRoute;

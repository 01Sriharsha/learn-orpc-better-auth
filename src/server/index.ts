import { onError, ORPCError, os, ValidationError } from "@orpc/server";
import * as z from "zod";

import { optionalAuth } from "@/server/middlewares/auth.middleware";
import { ORPCContext } from "@/server/types";

const context = os.$context<ORPCContext>();

export const base = context
  .errors({
    INTERNAL_SERVER_ERROR: { message: "Something went wrong" },
  })
  .use(optionalAuth)
  .use(onError((e) => errorHandler(e)));

// Global error handler
const errorHandler = (error: Error) => {
  if (
    error instanceof ORPCError &&
    error.code === "BAD_REQUEST" &&
    error.cause instanceof ValidationError
  ) {
    // If you only use Zod you can safely cast to ZodIssue[]
    const zodError = new z.ZodError(error.cause.issues as z.core.$ZodIssue[]);

    throw new ORPCError("INPUT_VALIDATION_FAILED", {
      status: 422,
      message: z.prettifyError(zodError),
      data: z.flattenError(zodError),
      cause: error.cause,
    });
  }

  if (
    error instanceof ORPCError &&
    error.code === "INTERNAL_SERVER_ERROR" &&
    error.cause instanceof ValidationError
  ) {
    throw new ORPCError("OUTPUT_VALIDATION_FAILED", {
      cause: error.cause,
    });
  }
};

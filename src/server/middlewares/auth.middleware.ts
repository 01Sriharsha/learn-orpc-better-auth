import { ORPCError } from "@orpc/client";
import { os } from "@orpc/server";

import { ORPCContext } from "@/server/types";
import { displayUser, getSession } from "@/server/utils";

export const optionalAuth = os
  .$context<ORPCContext>()
  .middleware(async ({ context, next }) => {
    try {
      const session = await getSession(context.reqHeaders!);
      if (session) {
        context.user = displayUser(session.user);
      }
    } catch (error) {
      // No session found, proceed without setting context.user
    }
    return next({ context });
  });

export const requireAuth = (role?: "admin" | "user") =>
  os.$context<ORPCContext>().middleware(async ({ context, next }) => {
    if (!context.user) {
      throw new ORPCError("UNAUTHORIZED", { message: "Session Expired!" });
    }
    if (role && context.user.role !== role) {
      throw new ORPCError("FORBIDDEN", {
        message: "You don't have access to this resource",
      });
    }
    return next({ context });
  });

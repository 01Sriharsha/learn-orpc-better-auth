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
  os
    .$context<ORPCContext>()
    .errors({
      UNAUTHORIZED: { message: "Session expired!" },
      FORBIDDEN: { message: "You don't have access to this resource" },
    })
    .middleware(async ({ context, errors, next }) => {
      if (!context.user) throw errors.UNAUTHORIZED();
      if (role && context.user.role !== role) {
        throw errors.FORBIDDEN();
      }
      return next({ context });
    });

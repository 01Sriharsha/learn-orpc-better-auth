import { os } from "@orpc/server";

import { ORPCContext } from "@/server/types";

export const injectNextHeaders = os
  .$context<ORPCContext>()
  .middleware(async ({ context, next }) => {
    context.reqHeaders =
      context.reqHeaders ??
      (await import("next/headers").then((mod) => mod.headers()));
    return next({ context });
  });

import { auth } from "@/lib/auth";
import { contextRouter } from "@/server/router";

export const requireAuth = contextRouter.middleware(
  async ({ context, next }) => {
    const session = await auth.api.getSession({
      headers: context.reqHeaders!,
    });
    return next();
  }
);

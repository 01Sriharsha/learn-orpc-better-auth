import "server-only";

import { createRouterClient } from "@orpc/server";

import { routes } from "@/server/routes";

export const orpcServerClient = createRouterClient(routes, {
  /**
   * Provide initial context if needed.
   *
   * Because this client instance is shared across all requests,
   * only include context that's safe to reuse globally.
   * For per-request context, use middleware context or pass a function as the initial context.
   */
  context: async () => ({
    reqHeaders: await import("next/headers").then((mod) => mod.headers()),
  }),
});

if (process.env.NODE_ENV === "development")
  globalThis.$client = orpcServerClient;

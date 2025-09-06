import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { SimpleCsrfProtectionLinkPlugin } from "@orpc/client/plugins";
import { inferRPCMethodFromContractRouter } from "@orpc/contract";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import { routes } from "@/server/routes";

interface ClientContext {
  cache?: RequestCache;
}

const link = new RPCLink<ClientContext>({
  method: inferRPCMethodFromContractRouter(routes),
  plugins: [new SimpleCsrfProtectionLinkPlugin()],
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("RPCLink is not allowed on the server side.");
    }

    return `${window.location.origin}/rpc`;
  },
  fetch: (request, init, { context }) =>
    globalThis.fetch(request, {
      ...init,
      cache: context?.cache,
    }),
});

export const orpcClient: RouterClient<typeof routes> = createORPCClient(link);

// tanstack query utils
export const orpcQC = createTanstackQueryUtils(orpcClient);

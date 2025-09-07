import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { SimpleCsrfProtectionLinkPlugin } from "@orpc/client/plugins";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { isServer } from "@tanstack/react-query";

import { RPCRouter } from "@/server/router";

type Client = RouterClient<RPCRouter>;
interface ClientContext {
  cache?: RequestCache;
}

const link = new RPCLink<ClientContext>({
  plugins: [new SimpleCsrfProtectionLinkPlugin()],
  url: () => {
    if (isServer) {
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

export const orpcClient: Client = createORPCClient(link);

// tanstack query utils
export const orpcQC = createTanstackQueryUtils(orpcClient);

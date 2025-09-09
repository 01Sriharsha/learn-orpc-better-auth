import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { SimpleCsrfProtectionLinkPlugin } from "@orpc/client/plugins";
import type { RouterClient } from "@orpc/server";
import {
  createTanstackQueryUtils,
  TANSTACK_QUERY_OPERATION_CONTEXT_SYMBOL,
  TanstackQueryOperationContext,
} from "@orpc/tanstack-query";

import { type RPCRouter } from "@/server/router";

declare global {
  var $client: Client | undefined;
}

type Client = RouterClient<RPCRouter>;
interface ClientContext extends TanstackQueryOperationContext {
  cache?: RequestCache;
}

const GET_OPERATION_TYPE = new Set(["query", "streamed", "live", "infinite"]);

const link = new RPCLink<ClientContext>({
  plugins: [new SimpleCsrfProtectionLinkPlugin()],
  url: () => {
    // if (isServer) {
    //   throw new Error("RPCLink is not allowed on the server side.");
    // }

    // return `${window.location.origin}/rpc`;

    console.log("Server client not available, using client side for RPC calls.");
    return "http://localhost:3000/rpc";
  },
  method: ({ context }, path) => {
    const operationType =
      context[TANSTACK_QUERY_OPERATION_CONTEXT_SYMBOL]?.type;

    if (operationType && GET_OPERATION_TYPE.has(operationType)) {
      return "GET";
    }

    return "POST";
  },
  fetch: (request, init, { context }) =>
    globalThis.fetch(request, {
      ...init,
      cache: context?.cache,
    }),
});

export const client: Client = globalThis.$client ?? createORPCClient(link);

// tanstack query utils
export const orpcQC = createTanstackQueryUtils(client);

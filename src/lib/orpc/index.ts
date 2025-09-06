import { RouterClient } from "@orpc/server";
import { isServer } from "@tanstack/react-query";

import { routes } from "@/server/routes";

type Client = RouterClient<typeof routes>;

declare global {
  var $client: Client | undefined;
}

async function getORPCClient() {
  if (process.env.NODE_ENV === "development" && globalThis.$client)
    return globalThis.$client;

  let client: Client;
  if (isServer)
    client = await import("./orpc.server").then((mod) => mod.orpcServerClient);
  else client = await import("./orpc.client").then((mod) => mod.orpcClient);
  return client;
}

export const client = await getORPCClient();

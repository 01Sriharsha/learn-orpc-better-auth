import { RPCHandler } from "@orpc/server/fetch";
import {
  RequestHeadersPlugin,
  SimpleCsrfProtectionHandlerPlugin,
} from "@orpc/server/plugins";

import { router } from "@/server/router";

const handler = new RPCHandler(router, {
  plugins: [
    // add plugins here if needed
    new SimpleCsrfProtectionHandlerPlugin(),
    new RequestHeadersPlugin(),
  ],
});

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: { reqHeaders: request.headers },
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;

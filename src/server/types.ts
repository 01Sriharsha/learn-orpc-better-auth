import { RequestHeadersPluginContext } from "@orpc/server/plugins";

import { displayUser } from "@/server/utils";

export interface ORPCContext extends RequestHeadersPluginContext {
  user?: ReturnType<typeof displayUser>;
}

import { RequestHeadersPluginContext } from "@orpc/server/plugins";

import { displayUser } from "@/server/utils";

type DisplayUser = ReturnType<typeof displayUser>;

export interface ORPCContext extends RequestHeadersPluginContext {
  user?: DisplayUser;
}

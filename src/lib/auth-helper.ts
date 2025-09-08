import "server-only";

import { safe } from "@orpc/client";

import { client } from "@/lib/orpc";

export const getMeServerSession = async () => {
  const [error, data] = await safe(client.auth.me());
  if (error || !data?.data) return null;
  return data.data;
};

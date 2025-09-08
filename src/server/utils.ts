import { ORPCError } from "@orpc/client";

import { User } from "@generated/client/client";

import { auth } from "@/lib/auth";
import { Pagination } from "@/types";

export const getSession = async (headers: Headers) => {
  const session = await auth.api.getSession({
    headers,
  });
  if (!session)
    throw new ORPCError("UNAUTHORIZED", { message: "Session Expired!" });
  return session;
};

export const displayUser = (user: Partial<User>) => ({
  id: user?.id || "",
  name: user?.name || "",
  email: user?.email || "",
  image: user?.image || "",
  phoneNumber: user?.phoneNumber || "",
  businessEmail: user?.businessEmail || "",
  role: user?.role || "",
  isOnboarded: user?.isOnboarded || false,
  isOAuth: user?.isOAuth || false,
});

export const paginationResponse = <T extends Array<any>>(
  options: Omit<Pagination<T>, "totalPages">
): Pagination<T> => {
  return { ...options, totalPages: Math.ceil(options.total / options.limit) };
};

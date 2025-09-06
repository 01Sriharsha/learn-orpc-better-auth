// import { safe } from "@orpc/client";
// import { client } from "@/lib/orpc";

// // to be used in server components
// export const getMeServer = async () => {
//   const [error, data] = await safe(client.auth.me());
//   if (error || !data?.data) return null;
//   return data.data;
// };

// // to be used in orpc procedures
// export const getAuthSession = async (headers: Headers) => {
//   const { auth } = await import("@/lib/auth");

//   const session = await auth.api.getSession({
//     headers,
//   });
//   return session;
// };

import { safe } from "@orpc/client";
import { NextRequest, NextResponse } from "next/server";
import { client } from "./lib/orpc";

export const runtime = "nodejs";

const protectedRoutes = ["/onboarding"];

export const getMeServer = async () => {
  const [error, data] = await safe(client.auth.me());
  if (error || !data?.data) return null;
  return data.data;
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const redirect = (url: string) =>
    NextResponse.redirect(new URL(url, req.nextUrl));

  if (path.startsWith("/login")) {
    const user = await getMeServer();
    if (user) redirect("/");
  }

  if (protectedRoutes.includes(path)) {
    console.log("Inside protected route check");
    const user = await getMeServer();
    if (!user) return redirect("/login");

    if (path.startsWith("/onboarding") && user.isOnboarded) {
      console.log("user is onboarded, redirecting to home");

      return redirect("/");
    }
  }
}

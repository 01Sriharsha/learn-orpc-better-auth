import { safe } from "@orpc/client";
import { NextRequest, NextResponse } from "next/server";

import { client } from "@/lib/orpc";

export const runtime = "experimental-edge";

const protectedRoutes = ["/onboarding"];

export const getMeServer = async () => {
  const [error, data] = await safe(client.auth.me());
  if (error || !data?.data) return null;
  return data.data;
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/login")) {
    const user = await getMeServer();
    if (user) return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (protectedRoutes.includes(path)) {
    const user = await getMeServer();
    if (!user) return NextResponse.redirect(new URL("/login", req.nextUrl));

    if (path.startsWith("/onboarding") && user.isOnboarded) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }
}

export const config = {
  matcher: [
    // Run on everything but Next internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};

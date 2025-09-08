import { createMiddleware } from "@arcjet/next";
import { NextRequest, NextResponse } from "next/server";

import { aj } from "@/lib/arcjet";
import { getMeServerSession } from "@/lib/auth-helper";

export const runtime = "experimental-edge";

const protectedRoutes = ["/onboarding"];

async function nextMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/login")) {
    const user = await getMeServerSession();
    if (user) return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (protectedRoutes.includes(path)) {
    const user = await getMeServerSession();
    if (!user) return NextResponse.redirect(new URL("/login", req.nextUrl));

    if (path.startsWith("/onboarding") && user.isOnboarded) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export default createMiddleware(aj, nextMiddleware);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|rpc)(.*)",
  ],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AUTH_MOCKING } from "@/lib/auth/mocking";

const isPublicRoute = createRouteMatcher([
  "/signin",
  "/signin/reset-password",
  "/signin/reset-password/step2",
]);

export default AUTH_MOCKING
  ? () => NextResponse.next()
  : clerkMiddleware(async (auth, req) => {
      if (!isPublicRoute(req)) {
        await auth.protect();
      }
    });

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

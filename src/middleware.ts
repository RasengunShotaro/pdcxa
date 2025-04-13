import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const matcher = [
  "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  "/(api|trpc)(.*)",
  "/",
];

const isProtectedRoute = createRouteMatcher(matcher);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req))
    await auth.protect({
      unauthenticatedUrl: "https://accounts.pdcxa.com/sign-in",
    });
});

export const config = { matcher };

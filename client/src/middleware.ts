import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only protect /posts pages (not API)
const isProtectedRoute = createRouteMatcher(["/posts(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request) && !request.url.includes("/api/")) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)", // API routes are not blocked
  ],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definiamo le pagine pubbliche
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/chat(.*)' 
]);

// Versione Standard (Senza async/await)
export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
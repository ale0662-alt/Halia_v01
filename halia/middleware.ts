import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/chat(.*)' 
]);

// 1. Aggiungiamo 'async' qui
export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // 2. Aggiungiamo 'await' qui per "spacchettare" la promessa
    const { userId, redirectToSignIn } = await auth();
    
    if (!userId) {
      return redirectToSignIn();
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
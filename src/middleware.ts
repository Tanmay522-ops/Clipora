// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  '/api/payment',
  '/payment(.*)',
])

const isPublicRoutes = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // ✅ Already logged in + on public page → redirect to callback
  if (userId && isPublicRoutes(req)) {
    return NextResponse.redirect(new URL('/callback', req.url))
  }

  // ✅ Not logged in + on protected page → redirect to sign-in
  if (!userId && isProtectedRoutes(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
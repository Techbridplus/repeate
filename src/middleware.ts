import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
  matcher: ['/settings/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;
  console.log("middleware")
  // If the user is not authenticated and trying to access restricted pages
  if (!token) {
    console.log("token not found")
    if (
      !url.pathname.startsWith('/sign-in') &&
      !url.pathname.startsWith('/sign-up') &&
      url.pathname !== '/'
    ) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
  }

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/settings', request.url));
  }
  console.log("returning next response")
  return NextResponse.next();
}
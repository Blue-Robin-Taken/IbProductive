import { NextRequest, NextResponse } from 'next/server';
import { checkJWT } from './db/authentication/jwtAuth';

export async function middleware(request: NextRequest) {
  const cookieStore = request.cookies;
  const tokenCookie = cookieStore.get('token')?.value;
  if (!tokenCookie) {
    return NextResponse.redirect(new URL('/sign_in', request.url)); // Cookie not set
  }

  if (await checkJWT(tokenCookie)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(`/sign_in`, request.url));
}

export const config = {
  matcher: '/components/calendar/:path*',
};

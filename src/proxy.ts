import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // ถ้าไม่มี token และพยายามเข้า /main
  if (pathname.startsWith('/main') && !token) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('error', 'no_token');
    return NextResponse.redirect(url);
  }

  // ถ้ามี token และอยู่หน้า /auth ให้ไปหน้า /carChecked
  if (pathname === '/auth' && token) {
    return NextResponse.redirect(new URL('/main/carChecked', request.url));
  }

  // ป้องกัน cache สำหรับหน้า /main/* (ป้องกัน bfcache)
  if (pathname.startsWith('/main')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '-1');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/main/:path*', '/auth']
};

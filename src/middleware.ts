import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적 파일들은 통과
  if (pathname.startsWith('/_next/') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // 토큰 체크
  const token = request.cookies.get('access-token')?.value;
  
  if (!token || !(await verifyToken(token))) {
    // 홈페이지가 아닌 곳에 접근하면 홈페이지로 리다이렉트
    if (pathname !== '/') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Middleware가 실행될 경로 설정
 */
export const config = {
  matcher: [
    /*
     * 다음 경로들을 제외한 모든 요청에 대해 실행:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 

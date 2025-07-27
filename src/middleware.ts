import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/token';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// 정적 파일들은 통과
	if (
		pathname.startsWith('/_next/') ||
		pathname === '/favicon.ico' ||
		pathname.startsWith('/fonts/') ||
		pathname.startsWith('/images/') ||
		pathname.startsWith('/icons/') ||
		pathname.startsWith('/tinymce/') ||
		pathname.endsWith('.svg') ||
		pathname.endsWith('.png') ||
		pathname.endsWith('.jpg') ||
		pathname.endsWith('.jpeg') ||
		pathname.endsWith('.woff2') ||
		pathname.endsWith('.woff') ||
		pathname.endsWith('.ttf') ||
		pathname.endsWith('.css')
	) {
		return NextResponse.next();
	}

	// 토큰 체크
	const token = request.cookies.get('access-token')?.value;
	const isDevelopment = process.env.NODE_ENV === 'development';

	// 개발자 모드에서 디버깅 정보 출력
	if (isDevelopment) {
		console.log('🔍 Middleware - 경로:', pathname);
		console.log(
			'🔍 Middleware - 토큰:',
			token ? `${token.substring(0, 20)}...` : '없음'
		);
	}

	const isTokenValid = token && (await verifyToken(token));

	if (!isTokenValid) {
		if (isDevelopment) {
			console.log('❌ Middleware - 토큰 검증 실패:', pathname);
		}

		// 홈페이지가 아닌 곳에 접근하면 홈페이지로 리다이렉트
		if (pathname !== '/') {
			if (isDevelopment) {
				console.log(
					'🔄 Middleware - 홈페이지로 리다이렉트:',
					pathname,
					'→',
					'/'
				);
			}
			return NextResponse.redirect(new URL('/', request.url));
		}
	} else if (isDevelopment) {
		console.log('✅ Middleware - 토큰 검증 성공:', pathname);
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
		 * - api routes
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - fonts directory
		 * - images directory
		 * - icons directory
		 * - tinymce directory
		 * - common static file extensions
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|fonts|images|icons|tinymce).*)',
	],
};

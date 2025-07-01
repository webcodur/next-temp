'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { initThemeAtom } from '@/store/theme';
// import { isAuthenticatedAtom } from '@/store/auth'; // 백엔드 연결 전까지 임시 주석처리

// components
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import { SideToggleMain } from './sidebar/unit/SideToggleMain';

// hooks
import { useSidebarKeyboard } from './sidebar/hooks';

// data
import { defaults, animations } from '@/data/sidebarConfig';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const [, initTheme] = useAtom(initThemeAtom);
	// const [isAuthenticated] = useAtom(isAuthenticatedAtom); // 백엔드 연결 전까지 임시 주석처리
	// const router = useRouter(); // 백엔드 연결 전까지 임시 주석처리
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// 테마 초기화
	useEffect(() => {
		initTheme();
	}, [initTheme]);

	// 키보드 단축키 활성화
	useSidebarKeyboard();

	// 인증 체크 및 리다이렉트 - 백엔드 연결 전까지 임시 주석처리
	/* useEffect(() => {
		if (!isAuthenticated && pathname !== '/login') {
			router.push('/login');
		}
	}, [isAuthenticated, pathname, router]); */



	// 로그인하지 않은 경우 빈 화면 표시 (리다이렉트 중) - 백엔드 연결 전까지 임시 주석처리
	/* if (!isAuthenticated && pathname !== '/login') {
		return (
			<div className="flex justify-center items-center h-screen bg-background">
				<div className="text-center">
					<div className="mx-auto mb-4 w-8 h-8 rounded-full border-2 animate-spin border-primary border-t-transparent"></div>
					<p className="text-muted-foreground">로그인 페이지로 이동 중...</p>
				</div>
			</div>
		);
	} */

	return (
		<div className="flex h-screen bg-background" suppressHydrationWarning>
			<SideToggleMain />
			<Sidebar />

			<main
				style={{
					marginLeft: isCollapsed ? '0px' : `${defaults.sidebarWidth}px`,
					transition: `margin-left ${animations.sidebarDuration}ms ease-in-out`,
				}}
				className="flex overflow-hidden flex-col flex-1 h-screen">
				
				
				
				{/* Header 영역 - 절대 위치 */}
				<div 
					className="absolute top-0 right-0 z-10 border-b bg-background border-border"
					style={{
						left: isCollapsed ? '0px' : `${defaults.sidebarWidth}px`,
						transition: `left ${animations.sidebarDuration}ms ease-in-out`,
					}}>
					<Header />
				</div>

				{/* 컨텐츠 전용 스크롤 영역 - 전체 화면 높이에서 중앙 정렬 */}
				<div
					ref={scrollContainerRef}
					className="flex overflow-y-auto flex-col justify-center items-center pt-16 h-screen bg-muted/30">
          <div className="max-w-[1440px] mx-auto px-6 w-full">
            {children}
          </div>
				</div>
			</main>
		</div>
	);
}

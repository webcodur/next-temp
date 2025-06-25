'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { isAuthenticatedAtom } from '@/store/auth';

// components
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import Footer from './footer/Footer';
import { SideToggleMain } from './sidebar/unit/SideToggleMain';
import { SideToggleHead } from './sidebar/unit/SideToggleHead';

// hooks
import { useSidebarKeyboard } from './sidebar/hooks';

// data
import { defaults, animations } from '@/data/sidebarConfig';

interface MainLayoutProps {
	children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const [isAuthenticated] = useAtom(isAuthenticatedAtom);
	const pathname = usePathname();
	const router = useRouter();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// 키보드 단축키 활성화
	useSidebarKeyboard();

	// 인증 체크 및 리다이렉트
	useEffect(() => {
		if (!isAuthenticated && pathname !== '/login') {
			router.push('/login');
		}
	}, [isAuthenticated, pathname, router]);

	// 페이지 변경 시 스크롤 최상단으로 이동
	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = 0;
		}
	}, [pathname]);

	// 로그인하지 않은 경우 빈 화면 표시 (리다이렉트 중)
	if (!isAuthenticated && pathname !== '/login') {
		return (
			<div className="flex items-center justify-center h-screen bg-background">
				<div className="text-center">
					<div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
					<p className="text-muted-foreground">로그인 페이지로 이동 중...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-background">
			<SideToggleMain />
			<SideToggleHead />
			<Sidebar />

			<main
				style={{
					marginLeft: isCollapsed ? '0px' : `${defaults.sidebarWidth}px`,
					transition: `margin-left ${animations.sidebarDuration}ms ease-in-out`,
				}}
				className="flex overflow-hidden flex-col flex-1 h-screen">
				<div
					ref={scrollContainerRef}
					className="overflow-y-scroll flex-1 bg-gray-50">
					<Header />
					<div className="flex flex-1 justify-center items-center px-6 py-8">
						<div className="container p-8 mx-auto w-full max-w-7xl bg-white rounded-lg border border-gray-100 shadow-xs min-h-96 min-w-96">
							{children}
						</div>
					</div>
					<Footer />
				</div>
			</main>
		</div>
	);
}

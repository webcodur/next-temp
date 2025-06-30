'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { sidebarCollapsedAtom, headerToggleVisibleAtom } from '@/store/sidebar';
// import { isAuthenticatedAtom } from '@/store/auth'; // 백엔드 연결 전까지 임시 주석처리

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
	const [, setHeaderToggleVisible] = useAtom(headerToggleVisibleAtom);
	// const [isAuthenticated] = useAtom(isAuthenticatedAtom); // 백엔드 연결 전까지 임시 주석처리
	const pathname = usePathname();
	// const router = useRouter(); // 백엔드 연결 전까지 임시 주석처리
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// 키보드 단축키 활성화
	useSidebarKeyboard();

	// 인증 체크 및 리다이렉트 - 백엔드 연결 전까지 임시 주석처리
	/* useEffect(() => {
		if (!isAuthenticated && pathname !== '/login') {
			router.push('/login');
		}
	}, [isAuthenticated, pathname, router]); */

	// 페이지 변경 시 스크롤 최상단으로 이동
	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop = 0;
		}
	}, [pathname]);

	// 스크롤 이벤트에 따른 헤더 토글 버튼 가시성 제어
	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		if (!scrollContainer) return;

		let lastScrollTop = 0;
		let hideTimer: NodeJS.Timeout;

		const handleScroll = () => {
			const scrollTop = scrollContainer.scrollTop;
			
			// 스크롤 상단 근처(50px 이내)이거나 위로 스크롤할 때 버튼 표시
			if (scrollTop < 50 || scrollTop < lastScrollTop) {
				setHeaderToggleVisible(true);
				
				// 기존 타이머 취소
				if (hideTimer) {
					clearTimeout(hideTimer);
				}
				
				// 3초 후 자동 숨김 (스크롤 상단이 아닌 경우만)
				if (scrollTop >= 50) {
					hideTimer = setTimeout(() => {
						setHeaderToggleVisible(false);
					}, 3000);
				}
			} else if (scrollTop > lastScrollTop && scrollTop > 100) {
				// 아래로 스크롤하고 100px 이상일 때 즉시 숨김
				setHeaderToggleVisible(false);
				if (hideTimer) {
					clearTimeout(hideTimer);
				}
			}

			lastScrollTop = scrollTop;
		};

		scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
		
		return () => {
			scrollContainer.removeEventListener('scroll', handleScroll);
			if (hideTimer) {
				clearTimeout(hideTimer);
			}
		};
	}, [setHeaderToggleVisible]);

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

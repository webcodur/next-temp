/* 
  파일명: /components/layout/main-layout.tsx
  기능: 메인 레이아웃의 루트 컴포넌트
  책임: 사이드바, 헤더, 콘텐츠 영역을 포함한 3단 구조의 레이아웃 제공
*/ // ------------------------------
'use client';
// react
import { ReactNode, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
// hooks
import { useLocale } from '@/hooks/useI18n';
import { useThemeKeyboard } from '@/hooks/useThemeKeyboard';
import { useAuth } from '@/hooks/useAuth';
// store
import { initPrimaryColorAtom } from '@/store/primary';
import { initTheme } from '@/store/theme';
import { sidebarCollapsedAtom } from '@/store/sidebar';
// data
import { defaults } from '@/data/sidebarConfig';
// components
import Login from '@/components/view/login/Login';
import PageHeader from '@/components/layout/PageHeader';
import Header from '@/components/layout/header/Header';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import SecondaryPanel from '@/components/layout/sidebar/unit/SecondaryPanel';
import { ToastProvider } from '@/components/ui/ui-effects/toast/Toast';

// #region 타입
interface MainLayoutProps {
	children: ReactNode;
}
// #endregion

/* 
 * [레이아웃 구조]
 * 이 컴포넌트는 '사이드바 + 헤더 + 콘텐츠'의 3단 구조를 가진다.
 * 전체 화면을 차지하는 최상위 div는 좌우로 Sidebar와 메인 콘텐츠 영역을 나눈다.
 * 메인 콘텐츠 영역은 상하로 Header와 실제 페이지 콘텐츠(children)로 구성된다.
 *
 * <div (h-screen, flex)>
 *   ├── <Sidebar />
 *   └── <div (flex-1, flex-col)>
 *         ├── <Header />
 *         └── <div (flex-1, flex)>
 *               ├── <SecondaryPanel />
 *               └── <main (flex-1)>
 *                     └── {children}
 *
 * [Overflow 관리 전략]
 * 레이아웃의 핵심은 스크롤 제어에 있다.
 * 1. 부모 컨테이너 (`overflow-hidden`): Header와 Main 영역을 감싸는 컨테이너들에 `overflow-hidden`을 적용하여,
 *    해당 영역 자체에서는 스크롤바가 생기지 않도록 막는다. 이는 스크롤 제어권을 자식 요소로 넘기기 위함이다.
 * 2. 콘텐츠 영역 (`overflow-y-auto` + `scrollbar-gutter-stable`): 실제 페이지 콘텐츠가 렌더링되는 `<main>` 태그에 
 *    `overflow-y-auto`를 적용하여 세로 스크롤을 허용하고, `scrollbar-gutter-stable` 클래스로 스크롤바 공간을 
 *    미리 확보한다. 이를 통해 콘텐츠의 양이 많아져도 레이아웃 시프트 없이 안정적인 스크롤 환경을 제공한다.
 *
 * 이 방식은 Header와 Sidebar를 화면에 고정한 채 콘텐츠 영역만 독립적으로 스크롤할 수 있게 하며,
 * 스크롤바 출현 시에도 레이아웃이 밀리지 않아 안정적인 사용자 경험을 제공한다.
 *
 * [반응형 SecondaryPanel 처리]
 * 화면 가로폭이 1024px 미만일 때는 SecondaryPanel이 오버레이 모드로 전환된다.
 * 오버레이 모드에서는 absolute positioning과 높은 z-index를 사용하여 다른 요소들 위에 표시된다.
 */

export function MainLayout({ children }: MainLayoutProps) {
	// #region 상태 및 훅
	const { isLoggedIn, isLoading } = useAuth();
	const [, initPrimaryColor] = useAtom(initPrimaryColorAtom);
	const { isRTL } = useLocale();
	const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);
	const [windowWidth, setWindowWidth] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [shouldShow, setShouldShow] = useState(false);
	// #endregion

	// #region 반응형 처리
	const MOBILE_BREAKPOINT = 1024;
	const isMobile = windowWidth < MOBILE_BREAKPOINT && windowWidth > 0;
	const showSecondaryPanelOverlay = isMobile && !isCollapsed;

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		
		setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// 애니메이션 상태 관리
	useEffect(() => {
		if (showSecondaryPanelOverlay) {
			setIsAnimating(true);
			requestAnimationFrame(() => {
				setShouldShow(true);
			});
		} else {
			setShouldShow(false);
			const timer = setTimeout(() => setIsAnimating(false), 300);
			return () => clearTimeout(timer);
		}
	}, [showSecondaryPanelOverlay]);
	// #endregion

	// #region 초기화 및 부가 효과
	useEffect(() => {
		// 테마 및 프라이머리 컬러 초기화
		initPrimaryColor();
    initTheme();
	}, [initPrimaryColor]);
	useThemeKeyboard();
	// #endregion

	// #region 렌더링
	// 로딩 중
	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen bg-surface-3">
				<div className="text-center">
					<div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
					<p className="text-text-secondary">로딩 중...</p>
				</div>
			</div>
		);
	}
	if (!isLoggedIn) return <Login />;
	return (
		<ToastProvider>
			<div className="flex h-screen bg-surface-3" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
			<Sidebar />
			<div className="flex overflow-hidden flex-col flex-1 h-screen">
				<Header />
				<div className="flex overflow-hidden relative flex-1">
					{/* Desktop SecondaryPanel */}
					{!isMobile && (
						<div 
							className={`flex-shrink-0 h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'overflow-hidden' : ''}`}
							style={{ width: isCollapsed ? '0px' : `${defaults.expandedWidth}px` }}>
							<div className={`h-full transition-transform duration-300 ease-in-out ${
								isCollapsed ? 'transform -translate-x-full' : 'transform translate-x-0'
							}`}
							style={{ width: `${defaults.expandedWidth}px` }}>
								<SecondaryPanel />
							</div>
						</div>
					)}

					{/* Mobile SecondaryPanel Overlay */}
					{(showSecondaryPanelOverlay || isAnimating) && (
						<>
							{/* Backdrop */}
							<div 
								className={`absolute inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out ${
									showSecondaryPanelOverlay ? 'opacity-100' : 'opacity-0'
								}`}
								onClick={() => setIsCollapsed(true)}
							/>
							{/* Overlay Panel */}
							<div 
								className={`absolute top-0 z-50 h-full shadow-xl transition-transform duration-300 ease-in-out bg-surface-2 ${
									isRTL ? 'right-0' : 'left-0'
								} ${
									shouldShow 
										? 'translate-x-0' 
										: isRTL 
											? 'translate-x-full' 
											: '-translate-x-full'
								}`}
								style={{ width: `${defaults.expandedWidth}px` }}>
								<SecondaryPanel />
							</div>
						</>
					)}

					<main className="overflow-y-auto flex-1 p-6 scrollbar-gutter-stable">
						<div className="p-8 mx-auto max-w-7xl rounded-lg bg-surface-1 neu-flat">
							<div className="mb-3">
								<PageHeader />
							</div>
                {children}
						</div>  
					</main>
				</div>
			</div>
		</div>
		</ToastProvider>
	);
	// #endregion
}
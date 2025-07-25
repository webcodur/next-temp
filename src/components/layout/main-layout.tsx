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
import { sidebarCollapsedAtom, endPanelWidthAtom } from '@/store/sidebar';
// components
import Login from '@/components/view/login/Login';
import ParkingLotSelectionPage from '@/components/view/parking-lot-selection/ParkingLotSelectionPage';
import { ParkingLotSelectionModal } from '@/components/view/parking-lot-selection/ParkingLotSelectionModal';
import PageWrapper from '@/components/layout/PageWrapper';
import Header from '@/components/layout/header/Header';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import SecondaryPanel from '@/components/layout/sidebar/unit/SecondaryPanel/SecondaryPanel';
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

export default function MainLayout({ children }: MainLayoutProps) {
	// #region 훅
	const { isLoggedIn, selectedParkingLotId } = useAuth();
	const { isRTL } = useLocale();
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const [endPanelWidth] = useAtom(endPanelWidthAtom);
	const [isAnimating, setIsAnimating] = useState(false);
	const [shouldShow, setShouldShow] = useState(false);

	// 테마 및 컬러 초기화
	useThemeKeyboard();
	const [, initPrimaryColor] = useAtom(initPrimaryColorAtom);
	useEffect(() => {
		initTheme();
		initPrimaryColor();
	}, [initPrimaryColor]);
	// #endregion

	// #region 애니메이션 처리
	const showSecondaryPanel = !isCollapsed;

	useEffect(() => {
		if (showSecondaryPanel) {
			setIsAnimating(true);
			requestAnimationFrame(() => {
				setShouldShow(true);
			});
		} else {
			setShouldShow(false);
			const timer = setTimeout(() => setIsAnimating(false), 100);
			return () => clearTimeout(timer);
		}
	}, [showSecondaryPanel]);
	// #endregion

	// #region 렌더링
	// 로그인하지 않은 경우
	if (!isLoggedIn) return <Login />;
	
	// 로그인했지만 selectedParkingLotId가 아직 설정되지 않은 경우 (로딩 중)
	if (selectedParkingLotId === null) return <Login />;
	
	// 슈퍼어드민(parkingLotId: 0)인 경우에만 현장선택 페이지 표시
	if (selectedParkingLotId === 0) {
		return <ParkingLotSelectionPage onSelectionComplete={() => {
			// 현장 선택 완료 후 추가 작업이 필요하면 여기에 추가
			console.log('현장 선택 완료:', selectedParkingLotId);
		}} />;
	}
	return (
		<ToastProvider>
			<div className="flex h-screen bg-surface-3" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
			<Sidebar />
			<div className="flex overflow-hidden flex-col flex-1 h-screen">
				<Header />
				<div className="flex overflow-hidden relative flex-1">
					{/* SecondaryPanel Overlay */}
					{(showSecondaryPanel || isAnimating) && (
						<>
							{/* Overlay Panel */}
							<div 
								className={`absolute top-0 z-50 h-full shadow-xl transition-transform duration-100 ease-in-out bg-surface-2 ${
									isRTL ? 'right-0' : 'left-0'
								} ${
									shouldShow 
										? 'translate-x-0' 
										: isRTL 
											? 'translate-x-full' 
											: '-translate-x-full'
								}`}
								style={{ width: `${endPanelWidth}px` }}>
								<SecondaryPanel />
							</div>
						</>
					)}

					<main className="overflow-y-auto flex-1 p-6 scrollbar-gutter-stable">
						<div className="p-8 mx-auto max-w-7xl rounded-lg bg-surface-1 neu-flat">
							<PageWrapper>
								{children}
							</PageWrapper>
						</div>  
					</main>
				</div>
			</div>
			
			{/* 현장 선택 모달 */}
			<ParkingLotSelectionModal />
		</div>
		</ToastProvider>
	);
	// #endregion
}
/* 
 * MainLayout 컴포넌트
 * 자세한 설명은 main-layout.md 참고
 */ 
'use client';
// react
import { ReactNode, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
// hooks
import { useLocale } from '@/hooks/useI18n';
import { useGlobalKeyboard } from '@/hooks/useGlobalKeyboard';
import { useAuth } from '@/hooks/useAuth';
// store
import { initPrimaryColorAtom } from '@/store/primary';
import { initTheme } from '@/store/theme';
import { sidebarCollapsedAtom, endPanelWidthAtom } from '@/store/ui';
// components
import Login from '@/components/view/_etc/login/Login';
import ParkingLotSelectionPage from '@/components/view/_etc/parking-lot-selection/ParkingLotSelectionPage';
import { ParkingLotSelectionModal } from '@/components/view/_etc/parking-lot-selection/ParkingLotSelectionModal';
import Header from '@/components/layout/header/Header';
import Footer from '@/components/layout/footer/Footer';
import Sidebar from '@/components/layout/sidebar/Sidebar';
import SecondaryPanel from '@/components/layout/sidebar/unit/SecondaryPanel/SecondaryPanel';
import { ToastProvider } from '@/components/ui/ui-effects/toast/Toast';

// #region 타입
interface MainLayoutProps {
	children: ReactNode;
}
// #endregion

// 상세 구조 및 동작 방식은 main-layout.md 참고
export default function MainLayout({ children }: MainLayoutProps) {
	// #region 훅
	const { isLoggedIn, selectedParkingLotId, refreshUserInfo } = useAuth();
	const { isRTL } = useLocale();
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const [endPanelWidth] = useAtom(endPanelWidthAtom);
	const [isAnimating, setIsAnimating] = useState(false);
	const [shouldShow, setShouldShow] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	// 전역 키보드 단축키 (테마 토글만)
	useGlobalKeyboard({ enableSidebarToggle: false });
	const [, initPrimaryColor] = useAtom(initPrimaryColorAtom);
	useEffect(() => {
		initTheme();
		initPrimaryColor();
	}, [initPrimaryColor]);

	// 화면 크기 감지 (1024px 기준)
	useEffect(() => {
		const checkScreenSize = () => {
			setIsDesktop(window.innerWidth >= 1024);
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	// 페이지 로드 시 토큰 확인 및 상태 동기화 (한 번만)
	useEffect(() => {
		if (isLoggedIn && !window.userInfoRefreshed) {
			refreshUserInfo();
			window.userInfoRefreshed = true;
		}
	}, [isLoggedIn, refreshUserInfo]);
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
			const timer = setTimeout(() => setIsAnimating(false), 300);
			return () => clearTimeout(timer);
		}
	}, [showSecondaryPanel]);
	// #endregion

	// #region 현장선택 완료 핸들러
	const handleParkingLotSelectionComplete = () => {
		// 선택 완료 후 필요한 추가 작업이 있다면 여기에 추가
		refreshUserInfo(); // 사용자 정보 새로고침
	};
	// #endregion

	// #region 렌더링 조건 분기
	// 1. 로그인하지 않은 경우 → 로그인 페이지
	if (!isLoggedIn) {
		return <Login />;
	}
	
	// 2. 로그인했지만 selectedParkingLotId가 null인 경우 → 토큰 로딩 중
	if (selectedParkingLotId === null) {
		return <Login />;
	}
	
	// 3. 최고관리자(selectedParkingLotId: 0)인 경우 → 현장선택 페이지
	if (selectedParkingLotId === 0) {
		return (
			<ParkingLotSelectionPage 
				onSelectionComplete={handleParkingLotSelectionComplete}
			/>
		);
	}
	// #endregion

	// #region 렌더링
	return (
		<ToastProvider>
			<div className="flex flex-col h-screen" dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
				<Header />
				<div className="flex overflow-hidden flex-1">
					<Sidebar />
					<div className="flex overflow-hidden relative flex-1">
						{/* PC 화면: 일반 flex layout으로 본문을 밀어내는 방식 */}
						<div 
							className={`flex-shrink-0 h-full shadow-xl transition-all duration-100 ease-in-out bg-serial-1 ${
								isDesktop && showSecondaryPanel ? 'opacity-100' : 'opacity-0'
							}`}
							style={{ 
								width: isDesktop && showSecondaryPanel ? `${endPanelWidth}px` : '0px' 
							}}>
							{isDesktop && showSecondaryPanel && <SecondaryPanel />}
						</div>

						{/* 태블릿 이하: 오버레이 방식 */}
						{!isDesktop && (showSecondaryPanel || isAnimating) && (
							<div 
								className="absolute top-0 z-50 h-full shadow-xl transition-transform duration-100 ease-in-out start-0 bg-serial-1"
								style={{ 
									width: `${endPanelWidth}px`,
									transform: `translateX(${shouldShow ? 'var(--translate-x-visible)' : 'var(--translate-x-hidden)'})`
								}}>
								<SecondaryPanel />
							</div>
						)}

						{/* 페이지 */}   
						<main className="overflow-y-auto flex-1 transition-all duration-100 ease-in-out scrollbar-gutter-stable bg-serial-5">
              {/* 페이지 컨테이너 기존 값: */}
              {/* <div className="p-10 mx-auto mt-10 max-w-7xl rounded-lg"> */}
              {/* 콘텐츠 */}
              <div className="px-[92px] mx-auto mt-12 max-w-[1656px] rounded-lg">
                {children}
              </div>  
              {/* 푸터 */}
							<div className="bg-serial-7">
								<Footer />
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
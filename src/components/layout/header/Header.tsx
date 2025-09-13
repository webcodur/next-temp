/* 
  파일명: /components/layout/header/Header.tsx
  기능: 메인 레이아웃의 헤더 컴포넌트
  책임: 로고, 브레드크럼, 헤더 버튼들을 포함한 상단 네비게이션 제공
*/ // ------------------------------
'use client';

import { memo, useState } from 'react';
import clsx from 'clsx';

import Breadcrumb from '@/components/layout/header/Breadcrumb';
import { GuideButton } from '@/components/layout/header/GuideButton';
import { ProfileButton } from '@/components/layout/header/ProfileButton';
import { SettingsButton } from '@/components/layout/header/SettingsButton';
import MenuSearch from '@/components/view/_etc/menu-search/MenuSearch';
import { useAuth } from '@/hooks/auth-hooks/useAuth/useAuth';
import { Search } from 'lucide-react';

import { Logo } from './Logo';
import { SiteSelectionButton } from './SiteSelectionButton';

const Header = memo(function Header() {
	// #region 상태
	const [isMenuSearchOpen, setIsMenuSearchOpen] = useState(false);
	const { getUserRoleId } = useAuth();
	// #endregion

	// #region 상수
	const buttonBase = 'h-10 flex items-center justify-center rounded-lg neu-raised hover:neu-inset transition-all duration-200';
	const squareButton = clsx(buttonBase, 'w-10');
	const currentUserRoleId = getUserRoleId();
	const isSuperAdmin = currentUserRoleId === 1; // 최고관리자 (SUPER_ADMIN)
	// #endregion

	// #region 핸들러
	const handleMenuSearchOpen = () => {
		setIsMenuSearchOpen(true);
	};

	const handleMenuSearchComplete = () => {
		setIsMenuSearchOpen(false);
	};
	// #endregion

	// #region 렌더링
	return (
		<>
			<header className="flex sticky top-0 z-50 flex-row justify-between items-center px-[28px] h-[72px] border-b bg-serial-0 border-border shrink-0">
				{/* Left: Breadcrumb */}
				<div className="flex gap-4 items-center">
					<div className="flex-shrink-0">
						<Logo />
					</div>
					<div className="w-px h-7 bg-border/50" />
					<Breadcrumb />
				</div>

				{/* Right: Buttons */}
				<div className="flex gap-3.5 items-center">
					{isSuperAdmin && <SiteSelectionButton className={squareButton} />}
					<button
						onClick={handleMenuSearchOpen}
						className={squareButton}
						title="메뉴 검색"
					>
						<Search size={18} className="neu-icon-inactive" />
					</button>
					<GuideButton className={squareButton} />
					<SettingsButton className={squareButton} />
					<ProfileButton className={squareButton} />
				</div>
			</header>

					{/* 메뉴 검색 모달 */}
		{isMenuSearchOpen && (
			<MenuSearch
				isModal={true}
				onSelectionComplete={handleMenuSearchComplete}
				onClose={handleMenuSearchComplete}
			/>
		)}
		</>
	);
	// #endregion
});

export default Header;

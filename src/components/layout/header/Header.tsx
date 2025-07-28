/* 
  파일명: /components/layout/header/Header.tsx
  기능: 메인 레이아웃의 헤더 컴포넌트
  책임: 로고, 브레드크럼, 헤더 버튼들을 포함한 상단 네비게이션 제공
*/ // ------------------------------
'use client';

import clsx from 'clsx';

import { Breadcrumb } from '@/components/layout/header/Breadcrumb';
import { GuideButton } from '@/components/layout/header/GuideButton';
import { ProfileButton } from '@/components/layout/header/ProfileButton';
import { SettingsButton } from '@/components/layout/header/SettingsButton';

import { Logo } from './Logo';
import { SearchButton } from './SearchButton';

export default function Header() {
	// #region 상수
	const buttonBase = 'h-9 flex items-center justify-center rounded-lg neu-raised hover:neu-inset transition-all duration-200';
	const squareButton = clsx(buttonBase, 'w-9');
	// #endregion

	// #region 렌더링
	return (
		<header className="flex sticky top-0 z-50 flex-row justify-between items-center px-6 h-16 border-b bg-serial-0 border-border shrink-0">
			{/* Left: Breadcrumb */}
			<div className="flex gap-4 items-center">
				<div className="flex-shrink-0">
					<Logo />
				</div>
				<div className="w-px h-6 bg-border/50" />
				<Breadcrumb />
			</div>

			{/* Right: Buttons */}
			<div className="flex gap-3 items-center">
				<SearchButton className={squareButton} />
				<GuideButton className={squareButton} />
				<SettingsButton className={squareButton} />
				<ProfileButton className={squareButton} />
			</div>
		</header>
	);
	// #endregion
}

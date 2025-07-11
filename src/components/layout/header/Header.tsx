'use client';

import { Breadcrumb } from '@/components/layout/header/Breadcrumb';
import { ProfileButton } from '@/components/layout/header/ProfileButton';
import { SettingsButton } from '@/components/layout/header/SettingsButton';
import { GuideButton } from '@/components/layout/header/GuideButton';
import { Logo } from './Logo';
import clsx from 'clsx';
import { SearchButton } from './SearchButton';

export function Header() {
	// 헤더 버튼 스타일
	const buttonBase = 'h-9 flex items-center justify-center rounded-lg neu-raised hover:neu-inset transition-all duration-200';
	const squareButton = clsx(buttonBase, 'w-9');

	return (
		<header className="flex sticky top-0 z-50 flex-row justify-between items-center px-6 h-16 border-b bg-surface-2 border-border shrink-0">
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
}

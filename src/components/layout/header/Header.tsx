'use client';

import { Breadcrumb } from '@/components/layout/header/Breadcrumb';
import { ProfileButton } from '@/components/layout/header/ProfileButton';
import { SettingsButton } from '@/components/layout/header/SettingsButton';
import { GuideButton } from '@/components/layout/header/GuideButton';
import clsx from 'clsx';

export function Header() {
	// 헤더 버튼 스타일
	const buttonBase = 'h-9 flex items-center justify-center rounded-lg neu-raised hover:neu-inset transition-all duration-200';
	const squareButton = clsx(buttonBase, 'w-9');

	return (
		<header className="flex flex-row items-center justify-between px-6 border-b bg-card border-border h-16">
			{/* Left: Breadcrumb */}
			<div className="flex items-center">
				<Breadcrumb />
			</div>

			{/* Right: Buttons */}
			<div className="flex items-center gap-3">
				<GuideButton className={squareButton} />
				<SettingsButton className={squareButton} />
				<ProfileButton className={squareButton} />
			</div>
		</header>
	);
}

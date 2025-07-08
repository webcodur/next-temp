'use client';

import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { Breadcrumb } from '@/components/layout/header/Breadcrumb';
import { ProfileButton } from '@/components/layout/header/ProfileButton';
import { SettingsButton } from '@/components/layout/header/SettingsButton';
import { GuideButton } from '@/components/layout/header/GuideButton';
import clsx from 'clsx';

export function Header() {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);

	// 사이드바 상태에 따른 브레드크럼브 위치 조정
	const breadcrumbMargin = isCollapsed ? 'ms-[50px]' : 'ms-0';

	// 헤더 버튼 스타일
	const buttonBase = 'h-9 flex items-center justify-center rounded-lg neu-raised hover:neu-inset transition-all duration-200';
	const squareButton = clsx(buttonBase, 'w-9');

	return (
		<header className="flex justify-between items-center px-6 h-16 border-b bg-card border-border">
			{/* Left Section */}
			<div
				className={`flex gap-4 items-center transition-all duration-300 ${breadcrumbMargin}`}>
				<Breadcrumb />
			</div>

			{/* Right Section */}
			<div className="flex gap-3 items-center">
				{/* 가이드 버튼 */}
				<GuideButton className={squareButton} />
				{/* 설정 버튼 */}
				<SettingsButton className={squareButton} />
				{/* 프로필 버튼 */}
				<ProfileButton className={squareButton} />
			</div>
		</header>
	);
}

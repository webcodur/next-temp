'use client';

import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { Breadcrumb } from '@/components/layout/header/Breadcrumb';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ProfileButton } from '@/components/layout/header/ProfileButton';

export function Header() {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);

	// 사이드바 상태에 따른 브레드크럼브 위치 조정
	const breadcrumbMargin = isCollapsed ? 'ml-[50px]' : 'ml-0';

	return (
		<header className="flex justify-between items-center px-6 h-16 border-b bg-card border-border">
			{/* Left Section */}
			<div
				className={`flex gap-4 items-center transition-all duration-300 ${breadcrumbMargin}`}>
				<Breadcrumb />
			</div>

			{/* Right Section */}
			<div className="flex gap-4 items-center">
				<LanguageSwitcher variant="header" />
				<ProfileButton />
			</div>
		</header>
	);
}

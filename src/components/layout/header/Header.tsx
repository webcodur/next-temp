'use client';

import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { Breadcrumb } from '@/components/layout/header/Breadcrumb';
import LanguageSwitcher from '@/components/ui/ui-input/language-switcher/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ui-layout/theme-toggle/ThemeToggle';
import { ProfileButton } from '@/components/layout/header/ProfileButton';
import dynamic from 'next/dynamic';
import clsx from 'clsx';

const PrimaryColorPicker = dynamic(
	() => import('@/components/layout/header/PrimaryColorPicker').then(mod => ({ default: mod.PrimaryColorPicker })),
	{
		ssr: false,
		loading: () => <div className="w-9 h-9" />
	}
);

export function Header() {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);

	// 사이드바 상태에 따른 브레드크럼브 위치 조정
	const breadcrumbMargin = isCollapsed ? 'ms-[50px]' : 'ms-0';

	// 헤더 버튼 스타일
	const buttonBase = 'h-9 flex items-center justify-center rounded-lg neu-raised hover:neu-inset transition-all duration-200';
	const squareButton = clsx(buttonBase, 'w-9');
	const flagButton = clsx(buttonBase, 'w-12');

	return (
		<header className="flex justify-between items-center px-6 h-16 border-b bg-card border-border">
			{/* Left Section */}
			<div
				className={`flex gap-4 items-center transition-all duration-300 ${breadcrumbMargin}`}>
				<Breadcrumb />
			</div>

			{/* Right Section */}
			<div className="flex gap-3 items-center">
				{/* 언어 선택 */}
				<LanguageSwitcher variant="header" className={flagButton} />
				{/* 브랜드 컬러 픽커 */}
				<PrimaryColorPicker className={squareButton} />
				{/* 테마 토글 */}
				<ThemeToggle variant="icon" showLabel={false} className={squareButton} />
				{/* 프로필 버튼 */}
				<ProfileButton className={squareButton} />
			</div>
		</header>
	);
}

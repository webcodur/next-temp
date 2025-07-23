/* 
  파일명: /components/layout/header/Breadcrumb.tsx
  기능: 헤더의 브레드크럼 네비게이션 컴포넌트
  책임: 현재 페이지 경로를 표시하고 반응형 드롭다운 메뉴 제공
*/ // ------------------------------
'use client';

import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';

import { menuData } from '@/data/menuData';
import {
	currentTopMenuAtom,
	currentMidMenuAtom,
	currentBotMenuAtom,
} from '@/store/sidebar';

// #region 타입
interface BreadcrumbItemProps {
	label: string;
	isCurrent?: boolean;
}
// #endregion

// #region 서브 컴포넌트
const BreadcrumbItem = ({ label, isCurrent = false }: BreadcrumbItemProps) => (
	<span
		className={`truncate ${
			isCurrent
				? 'font-medium text-foreground'
				: 'transition-colors text-muted-foreground hover:text-primary'
		}`}
	>
		{label}
	</span>
);

const Separator = () => (
	<ChevronRight className="flex-shrink-0 w-4 h-4 text-muted-foreground" />
);
// #endregion

export function Breadcrumb() {
	// #region 상태
	const [currentTopMenu, setCurrentTopMenu] = useAtom(currentTopMenuAtom);
	const [currentMidMenu, setCurrentMidMenu] = useAtom(currentMidMenuAtom);
	const [currentBotMenu, setCurrentBotMenu] = useAtom(currentBotMenuAtom);
	const pathname = usePathname();

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	// #endregion

	// #region 유틸리티
  // 경로에 따라 브레드크럼 아이템을 생성하는 함수
	const getBreadcrumbItems = () => {
		const items = [];

		if (currentTopMenu && menuData[currentTopMenu]) {
			items.push({
				label: menuData[currentTopMenu].key,
				href: '#',
			});

			if (currentMidMenu && menuData[currentTopMenu].midItems[currentMidMenu]) {
				items.push({
					label: menuData[currentTopMenu].midItems[currentMidMenu].key,
					href: '#',
				});

				if (currentBotMenu) {
					const botItem = menuData[currentTopMenu].midItems[
						currentMidMenu
					].botItems.find(item => item.key === currentBotMenu);
					if (botItem) {
						items.push({ label: currentBotMenu, href: botItem.href });
					}
				}
			}
		}
		// 경로가 갱신되지 않았을 경우, pathname에서 임시 이름 생성
		if (items.length === 1 && pathname !== '/') {
			const pageName =
				pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || '';
			if (pageName) {
				items.push({
					label: pageName.charAt(0).toUpperCase() + pageName.slice(1),
					href: pathname,
				});
			}
		}

		return items;
	};

  // 브레드크럼 아이템을 렌더링하는 함수
	const renderFullBreadcrumb = () => (
		<div className="flex items-center min-w-0 gap-2">
			<h2 className="text-lg font-semibold truncate text-foreground">
				{breadcrumbItems[0].label}
			</h2>
			<div className="flex items-center gap-2 overflow-hidden">
				{breadcrumbItems.slice(1).map((item, index) => (
					<div key={index} className="flex items-center flex-shrink-0 gap-2">
						<Separator />
						<BreadcrumbItem
							label={item.label}
							isCurrent={index === breadcrumbItems.length - 2}
						/>
					</div>
				))}
			</div>
		</div>
	);

  // 드롭다운 메뉴로 축약된 브레드크럼을 렌더링하는 함수
	const renderCollapsedBreadcrumb = () => (
		<DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
			<DropdownMenu.Trigger className="neu-flat hover:neu-inset transition-colors flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium">
				<span>메뉴 경로</span>
				<ChevronRight
					className={clsx(
						'w-4 h-4 text-muted-foreground transition-transform duration-200',
						isDropdownOpen && 'rotate-90',
					)}
				/>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					align="start"
					sideOffset={5}
					className="neu-flat bg-background rounded-lg p-2 min-w-[180px] shadow-lg animate-fadeIn z-50"
				>
					{breadcrumbItems.map((item, index) => (
						<DropdownMenu.Item
							key={index}
							className={`text-sm px-2 py-1.5 rounded-md cursor-pointer hover:neu-inset focus:outline-none transition-colors ${
								index === breadcrumbItems.length - 1
									? 'text-foreground font-medium'
									: 'text-muted-foreground'
							}`}
						>
							{item.label}
						</DropdownMenu.Item>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
	// #endregion

	// #region 효과
	useEffect(() => {
		const pathSegments = pathname.split('/').filter(Boolean);

		if (pathSegments.length === 0) {
			setCurrentTopMenu('');
			setCurrentMidMenu('');
			setCurrentBotMenu('');
			return;
		}

		for (const [topKey, topItem] of Object.entries(menuData)) {
			for (const [midKey, midItem] of Object.entries(topItem.midItems)) {
				for (const botItem of midItem.botItems) {
					if (botItem.href === pathname) {
						setCurrentTopMenu(topKey);
						setCurrentMidMenu(midKey);
						setCurrentBotMenu(botItem.key);
						return;
					}
				}
			}
		}
	}, [pathname, setCurrentTopMenu, setCurrentMidMenu, setCurrentBotMenu]);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsCollapsed(window.innerWidth < 1500);
		};
		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);
		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);
	// #endregion

	// #region 렌더링
	const breadcrumbItems = getBreadcrumbItems();

	if (breadcrumbItems.length <= 1) {
		return (
			<h2 className="text-lg font-semibold truncate text-foreground">
				{breadcrumbItems.length > 0 ? breadcrumbItems[0].label : '홈'}
			</h2>
		);
	}

	return (
		<nav aria-label="Breadcrumb" className="w-full">
			{isCollapsed ? renderCollapsedBreadcrumb() : renderFullBreadcrumb()}
		</nav>
	);
	// #endregion
}

'use client';

import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
	currentTopMenuAtom,
	currentMidMenuAtom,
	currentBotMenuAtom,
} from '@/store/sidebar';
import { menuData } from '@/data/menuData';
import { siteData } from '@/data/siteData';
import clsx from 'clsx';

// #region BreadcrumbItem 컴포넌트
interface BreadcrumbItemProps {
	label: string;
	isCurrent?: boolean;
}

const BreadcrumbItem = ({ label, isCurrent = false }: BreadcrumbItemProps) => (
	<span
		className={`truncate ${
			isCurrent
				? 'text-foreground font-medium'
				: 'text-muted-foreground hover:text-brand transition-colors'
		}`}
	>
		{label}
	</span>
);
// #endregion

export function Breadcrumb() {
	// #region 상태 및 훅 초기화
	const [currentTopMenu, setCurrentTopMenu] = useAtom(currentTopMenuAtom);
	const [currentMidMenu, setCurrentMidMenu] = useAtom(currentMidMenuAtom);
	const [currentBotMenu, setCurrentBotMenu] = useAtom(currentBotMenuAtom);
	const pathname = usePathname();

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	// #endregion

	// #region 페이지 경로 변경 시 breadcrumb 업데이트
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
						setCurrentBotMenu(botItem['kor-name']);
						return;
					}
				}
			}
		}
	}, [pathname, setCurrentTopMenu, setCurrentMidMenu, setCurrentBotMenu]);
	// #endregion

	// #region 브레드크럼 아이템 생성
	const getBreadcrumbItems = () => {
		const items = [{ label: siteData.name, href: '/' }];

		if (currentTopMenu && menuData[currentTopMenu]) {
			items.push({
				label: menuData[currentTopMenu]['kor-name'],
				href: '#',
			});

			if (currentMidMenu && menuData[currentTopMenu].midItems[currentMidMenu]) {
				items.push({
					label: menuData[currentTopMenu].midItems[currentMidMenu]['kor-name'],
					href: '#',
				});

				if (currentBotMenu) {
					const botItem = menuData[currentTopMenu].midItems[
						currentMidMenu
					].botItems.find(item => item['kor-name'] === currentBotMenu);
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

	const breadcrumbItems = getBreadcrumbItems();
	// #endregion

	// #region 너비 감지를 위한 레이아웃 이펙트
	useEffect(() => {
		const checkScreenSize = () => {
			setIsCollapsed(window.innerWidth < 1500);
		};

		checkScreenSize(); // 초기 렌더링 시 체크
		window.addEventListener('resize', checkScreenSize);

		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);
	// #endregion

	if (breadcrumbItems.length <= 1) {
		return (
			<h2 className="text-lg font-semibold text-foreground truncate">
				{breadcrumbItems.length > 0 ? breadcrumbItems[0].label : '홈'}
			</h2>
		);
	}

	const Separator = () => (
		<ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
	);

	const renderFullBreadcrumb = () => (
		<div className="flex items-center gap-2 min-w-0">
			<h2 className="text-lg font-semibold text-foreground truncate">
				{breadcrumbItems[0].label}
			</h2>
			<div className="flex items-center gap-2 overflow-hidden">
				{breadcrumbItems.slice(1).map((item, index) => (
					<div key={index} className="flex items-center gap-2 flex-shrink-0">
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

	const renderCollapsedBreadcrumb = () => (
		<DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
			<DropdownMenu.Trigger className="neu-raised hover:neu-inset transition-colors flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium">
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

	return (
		<nav aria-label="Breadcrumb" className="w-full">
			{isCollapsed ? renderCollapsedBreadcrumb() : renderFullBreadcrumb()}
		</nav>
	);
}

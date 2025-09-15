/*
  파일명: Breadcrumb.tsx
  기능: 현재 페이지 위치를 나타내는 브레드크럼 네비게이션 컴포넌트
  책임: 사용자의 현재 위치를 시각적으로 표시하고, 상위 페이지로의 네비게이션을 제공한다
*/

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { ChevronRight, Home } from 'lucide-react';


import { 
	currentTopMenuAtom, 
	currentMidMenuAtom, 
	currentBotMenuAtom
} from '@/store/ui';
import { menuData } from '@/data/menuData';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';

export default function Breadcrumb() {
	const pathname = usePathname();
	const [currentTopMenu, setCurrentTopMenu] = useAtom(currentTopMenuAtom);
	const [currentMidMenu, setCurrentMidMenu] = useAtom(currentMidMenuAtom);
	const [currentBotMenu, setCurrentBotMenu] = useAtom(currentBotMenuAtom);
	const t = useTranslations();


	// #region 효과
	React.useEffect(() => {
		const pathSegments = pathname.split('/').filter(Boolean);

		if (pathSegments.length === 0) {
			setCurrentTopMenu('');
			setCurrentMidMenu('');
			setCurrentBotMenu('');
			return;
		}

		// 먼저 정확한 경로 매칭 시도
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

		// 정확한 매칭이 없으면 부분 매칭 시도 (상세 페이지용)
		for (const [topKey, topItem] of Object.entries(menuData)) {
			for (const [midKey, midItem] of Object.entries(topItem.midItems)) {
				for (const botItem of midItem.botItems) {
					if (pathname.startsWith(botItem.href)) {
						setCurrentTopMenu(topKey);
						setCurrentMidMenu(midKey);
						setCurrentBotMenu(botItem.key);
						return;
					}
				}
			}
		}
	}, [pathname, setCurrentTopMenu, setCurrentMidMenu, setCurrentBotMenu]);
	// #endregion

	// 경로에 따라 브레드크럼 아이템을 생성하는 함수
	const getBreadcrumbItems = () => {
		const items: Array<{ label: string; href: string; isClickable?: boolean }> = [];

		// 홈 추가
		items.push({
			label: t('페이지_홈'),
			href: '/',
			isClickable: true,
		});

		if (currentTopMenu && menuData[currentTopMenu]) {
			items.push({
				label: t(currentTopMenu),
				href: '#',
				isClickable: false,
			});

			if (currentMidMenu && menuData[currentTopMenu].midItems[currentMidMenu]) {
				items.push({
					label: t(currentMidMenu),
					href: '#',
					isClickable: false,
				});

				if (currentBotMenu) {
					const botItem = menuData[currentTopMenu].midItems[
						currentMidMenu
					].botItems.find(item => item.key === currentBotMenu);
					if (botItem) {
						items.push({ 
							label: t(currentBotMenu), 
							href: botItem.href,
							isClickable: true 
						});
					}
				}
			}
		}



		return items;
	};

	const breadcrumbItems = getBreadcrumbItems();

	if (breadcrumbItems.length <= 1) {
		return null;
	}

	return (
		<nav className="hidden xl:flex items-center px-1 py-2 space-x-2 text-sm">
			{breadcrumbItems.map((item, index) => (
				<React.Fragment key={index}>
					{index === 0 ? (
						// 홈 아이콘
						<Link href={item.href} className="flex items-center transition-colors text-[hsl(var(--gray-8))] hover:text-[hsl(var(--gray-9))]">
							<Home size={18} />
						</Link>
					) : (
						<>
							<ChevronRight size={16} className="text-muted-foreground/50" />
							{item.isClickable && item.href !== pathname ? (
								<Link 
									href={item.href} 
									className="font-semibold transition-colors text-[hsl(var(--gray-8))] hover:text-[hsl(var(--gray-9))]"
								>
									{item.label}
								</Link>
							) : (
								<span className={pathname === item.href ? 'text-[hsl(var(--gray-9))] font-bold' : 'text-[hsl(var(--gray-8))] font-semibold'}>
									{item.label}
								</span>
							)}
						</>
					)}
				</React.Fragment>
			))}
		</nav>
	);
}

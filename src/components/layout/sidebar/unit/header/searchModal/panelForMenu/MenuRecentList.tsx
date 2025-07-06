'use client';

import React from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from '@/hooks/useI18n';
import { MenuRecentListProps } from '../types';

const MenuRecentList: React.FC<MenuRecentListProps> = ({
	recentMenus,
	onItemSelect,
}) => {
	const t = useTranslations();
	const { isRTL } = useLocale();

	if (recentMenus.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				<Menu className="mx-auto mb-3 w-12 h-12 text-muted-foreground/50" />
				<p>{t('최근_메뉴_없음')}</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<h3 className="mb-3 text-sm font-medium text-muted-foreground">{t('최근_메뉴_제목')}</h3>
			{recentMenus.map((recent, index) => (
				<div
					key={`recent-${recent.item.href}-${index}`}
					onClick={() => onItemSelect(recent)}
					className="p-4 rounded-lg border transition-all cursor-pointer border-border neu-flat hover:neu-inset">
					<div className={`flex gap-2 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
						<span className="px-2 py-1 font-mono text-xs rounded text-muted-foreground bg-muted">
							{index + 1}
						</span>
						<Menu className="w-4 h-4 text-muted-foreground shrink-0" />
						<div className={`flex flex-wrap gap-1 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
							<span className="text-sm font-medium text-foreground">
								{t(`메뉴_${recent.topKey}`)}
							</span>
							<ChevronRight className={`w-3 h-3 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
							<span className="text-sm text-muted-foreground">
								{t(`메뉴_${recent.midKey}`)}
							</span>
							<ChevronRight className={`w-3 h-3 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
							<span className="text-sm font-medium text-foreground">
								{t(`메뉴_${recent.item.key}`)}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default MenuRecentList; 
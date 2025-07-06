'use client';

import React from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import { useTranslations, useLocale } from '@/hooks/useI18n';
import { MenuSearchResultsProps } from '../types';

const MenuSearchResults: React.FC<MenuSearchResultsProps> = ({
	results,
	onItemSelect,
}) => {
	const t = useTranslations();
	const { isRTL } = useLocale();

	if (results.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				<Menu className="mx-auto mb-3 w-12 h-12 text-muted-foreground/50" />
				<p>{t('검색_결과_없음')}</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<h3 className="mb-3 text-sm font-medium text-muted-foreground">{t('검색_메뉴_결과_제목')}</h3>
			{results.map((result, index) => (
				<div
					key={`${result.type}-${result.topKey}-${result.midKey}-${index}`}
					onClick={() => onItemSelect(result)}
					className="p-4 rounded-lg border transition-all cursor-pointer border-border neu-flat hover:neu-inset">
					<div className={`flex gap-2 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
						<Menu className="w-4 h-4 text-muted-foreground shrink-0" />
						<div className={`flex flex-wrap gap-1 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
							<span className="text-sm font-medium text-foreground">
								{t(`메뉴_${result.topKey}`)}
							</span>
							<ChevronRight className={`w-3 h-3 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
							<span className="text-sm text-muted-foreground">
								{t(`메뉴_${result.midKey}`)}
							</span>
							{result.type === 'bot' && (
								<>
									<ChevronRight className={`w-3 h-3 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
									<span className="text-sm font-medium text-foreground">
										{t(`메뉴_${result.item.key}`)}
									</span>
								</>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default MenuSearchResults; 
'use client';

import React from 'react';
import { Building2, MapPin } from 'lucide-react';
import { useTranslations, useLocale } from '@/hooks/useI18n';
import { SiteRecentListProps } from '../types';

const SiteRecentList: React.FC<SiteRecentListProps> = ({
	recentSites,
	onItemSelect,
}) => {
	const t = useTranslations();
	const { isRTL } = useLocale();

	if (recentSites.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground">
				<Building2 className="mx-auto mb-3 w-12 h-12 text-muted-foreground/50" />
				<p>{t('최근_현장_없음')}</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<h3 className="mb-3 text-sm font-medium text-muted-foreground">{t('최근_현장_제목')}</h3>
			{recentSites.map((site, index) => (
				<div
					key={`recent-${site.id}-${index}`}
					onClick={() => onItemSelect(site)}
					className="p-4 rounded-lg border transition-all cursor-pointer border-border neu-flat hover:neu-inset">
					<div className={`flex gap-3 items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
						<span className="px-2 py-1 font-mono text-xs rounded text-muted-foreground bg-muted">
							{index + 1}
						</span>
						<Building2 className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
						<div className="flex-1 min-w-0">
							<h3 className="mb-1 font-medium text-foreground font-multilang">{site.name}</h3>
							<div className={`flex gap-1 items-center mb-1 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
								<MapPin className="w-4 h-4" />
								<span className="font-multilang">{site.address}</span>
							</div>
							{site.description && (
								<p className="text-sm text-muted-foreground/70 font-multilang">{site.description}</p>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default SiteRecentList; 
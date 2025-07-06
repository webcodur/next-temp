'use client';

import React, { useRef } from 'react';
import { X, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { useTranslations, useLocale } from '@/hooks/useI18n';
import { SiteSearchInputProps } from '../types';

const SiteSearchInput: React.FC<SiteSearchInputProps> = ({
	searchQuery,
	onSearchChange,
	onSearchClear,
}) => {
	const t = useTranslations();
	const { isRTL } = useLocale();
	const siteInputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="relative shrink-0">
			<Building2 className={`absolute top-1/2 w-5 h-5 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'end-3' : 'start-3'}`} />
			<input
				ref={siteInputRef}
				type="text"
				placeholder={t('검색_현장_플레이스홀더')}
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				className="py-3 w-full text-base rounded-lg border border-border neu-flat focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand ps-12 pe-12"
				dir={isRTL ? 'rtl' : 'ltr'}
			/>
			{searchQuery && (
				<Button
					variant="ghost"
					size="icon"
					onClick={onSearchClear}
					className={`absolute top-1/2 w-8 h-8 transform -translate-y-1/2 hover:bg-muted ${isRTL ? 'start-3' : 'end-3'}`}>
					<X className="w-4 h-4" />
				</Button>
			)}
		</div>
	);
};

export default SiteSearchInput; 
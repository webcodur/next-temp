'use client';

import React, { useRef } from 'react';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { useTranslations, useLocale } from '@/hooks/useI18n';
import { MenuSearchInputProps } from '../types';

const MenuSearchInput: React.FC<MenuSearchInputProps> = ({
	searchQuery,
	onSearchChange,
	onSearchClear,
}) => {
	const t = useTranslations();
	const { isRTL } = useLocale();
	const menuInputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="relative shrink-0">
			<Menu className={`absolute top-1/2 w-5 h-5 transform -translate-y-1/2 text-muted-foreground ${isRTL ? 'end-3' : 'start-3'}`} />
			<input
				ref={menuInputRef}
				type="text"
				placeholder={t('검색_메뉴_플레이스홀더')}
				value={searchQuery}
				onChange={(e) => onSearchChange(e.target.value)}
				className="py-3 w-full text-base rounded-lg border border-border neu-flat focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ps-12 pe-12"
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

export default MenuSearchInput; 
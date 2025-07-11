'use client';

import { useSetAtom } from 'jotai';
import { Search } from 'lucide-react';
import { useTranslations } from '@/hooks/useI18n';
import { searchModalOpenAtom } from '@/store/searchModal';

interface SearchButtonProps {
	className?: string;
}

export function SearchButton({ className }: SearchButtonProps) {
	const t = useTranslations();
	const setIsOpen = useSetAtom(searchModalOpenAtom);

	return (
		<button
			type="button"
			className={className}
			onClick={() => setIsOpen(true)}
			aria-label={t('헤더_메뉴검색')}
		>
			<Search size={20} />
		</button>
	);
} 
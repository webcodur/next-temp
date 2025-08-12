'use client';

import { useSetAtom } from 'jotai';
import { Building2 } from 'lucide-react';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';
import { parkingLotSelectionModalOpenAtom } from '@/store/ui';

interface SiteSelectionButtonProps {
	className?: string;
}

export function SiteSelectionButton({ className }: SiteSelectionButtonProps) {
	const t = useTranslations();
	const setIsOpen = useSetAtom(parkingLotSelectionModalOpenAtom);

	return (
		<button
			type="button"
			className={className}
			onClick={() => setIsOpen(true)}
			aria-label={t('헤더_현장선택')}
		>
			<Building2 size={23} />
		</button>
	);
} 
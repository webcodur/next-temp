'use client';

import React from 'react';
import { useColorSet } from '@/hooks/ui-hooks/useColorSet';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';
import { COLOR_SETS, type ColorSetKey } from '@/store/colorSet';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/ui-layout/modal/Modal';

interface ColorSetModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSetChange?: (colorSet: ColorSetKey) => void;
	className?: string;
}

export const ColorSetModal: React.FC<ColorSetModalProps> = ({
	isOpen,
	onClose,
	onSetChange,
	className = '',
}) => {
	const { colorSet: currentSet, setColorSet } = useColorSet();
	const t = useTranslations();

	const handleSetChange = (newSet: ColorSetKey) => {

		setColorSet(newSet);
		onSetChange?.(newSet);
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={t('설정_색상테마')}
			size="lg"
			className={className}
		>
			<div className="space-y-3 min-w-[400px] max-h-[60vh] overflow-y-auto">
				{Object.entries(COLOR_SETS).map(([key, colorSet]) => {
					const typedKey = key as ColorSetKey;
					const isSelected = currentSet === key;
					const primaryColor = colorSet.primary.light;
					const secondaryColor = colorSet.secondary.light;

					return (
						<button
							key={key}
							onClick={() => handleSetChange(typedKey)}
							className={cn(
								'w-full flex items-center gap-4 p-4 text-left transition-all duration-200 rounded-xl',
								'neu-flat hover:neu-raised focus:outline-hidden',
								isSelected && 'neu-inset bg-primary/5'
							)}
						>
							{/* 색상 미리보기 */}
							<div
								className="flex-shrink-0 w-10 h-10 rounded-full border border-border"
								style={{
									background: `linear-gradient(135deg, hsl(${primaryColor}) 0%, hsl(${secondaryColor}) 100%)`,
									boxShadow: isSelected 
										? `0 0 0 2px hsl(${primaryColor} / 0.3)`
										: 'none'
								}}
							/>
							
							{/* 색상 세트 정보 */}
							<div className="flex-1 min-w-0">
							<div className="mb-1 text-base font-medium text-foreground">
								{t(colorSet.name)}
							</div>
								<div className="text-xs text-muted-foreground">
									Primary: {primaryColor}
								</div>
								<div className="text-xs text-muted-foreground">
									Secondary: {secondaryColor}
								</div>
							</div>
							
							{/* 선택 표시 */}
							{isSelected && (
								<div className="flex-shrink-0 w-4 h-4 rounded-full animate-pulse bg-primary" />
							)}
						</button>
					);
				})}
			</div>
		</Modal>
	);
};

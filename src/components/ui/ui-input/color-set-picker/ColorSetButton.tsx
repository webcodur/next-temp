'use client';

import React, { useState } from 'react';
import { useColorSet } from '@/hooks/ui-hooks/useColorSet';
import { COLOR_SETS, type ColorSetKey } from '@/store/colorSet';
import { cn } from '@/lib/utils';
import { ColorSetModal } from './ColorSetModal';

interface ColorSetButtonProps {
	className?: string;
	onSetChange?: (colorSet: ColorSetKey) => void;
	compact?: boolean;
}

export const ColorSetButton: React.FC<ColorSetButtonProps> = ({
	className = '',
	onSetChange,
	compact = false,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { colorSet: currentSet } = useColorSet();

	const currentColorSet = COLOR_SETS[currentSet];
	const primaryColor = currentColorSet.primary.light;
	const secondaryColor = currentColorSet.secondary.light;

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			{/* 트리거 버튼 */}
			<button
				onClick={handleOpenModal}
				className={cn(
					'flex items-center neu-flat hover:neu-raised transition-all',
					compact 
						? 'justify-center rounded-xl p-2'
						: 'justify-between p-3 rounded-xl w-full'
				)}
			>
				{compact ? (
					/* 컴팩트 모드: 색상 미리보기만 */
					<div
						className="w-6 h-6 rounded-full border border-border/50"
						style={{
							background: `linear-gradient(135deg, hsl(${primaryColor}) 0%, hsl(${secondaryColor}) 100%)`
						}}
					/>
				) : (
					/* 일반 모드: 전체 정보 */
					<div className="flex items-center gap-3 w-full">
						{/* 현재 색상 미리보기 */}
						<div
							className="w-6 h-6 rounded-full border border-border/50"
							style={{
								background: `linear-gradient(135deg, hsl(${primaryColor}) 0%, hsl(${secondaryColor}) 100%)`
							}}
						/>
						<span className="text-sm font-medium text-foreground flex-1 text-left">
							{currentColorSet.name}
						</span>
					</div>
				)}
			</button>

			{/* 색상 선택 모달 */}
			<ColorSetModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSetChange={onSetChange}
				className={className}
			/>
		</>
	);
};

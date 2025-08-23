'use client';

import React, { useState } from 'react';
import { useColorSet } from '@/hooks/ui-hooks/useColorSet';
import { COLOR_SETS, type ColorSetKey } from '@/store/colorSet';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/ui-layout/modal/Modal';

interface ColorSetSelectorProps {
	className?: string;
	onSetChange?: (colorSet: ColorSetKey) => void;
	compact?: boolean;
}

export const ColorSetSelector: React.FC<ColorSetSelectorProps> = ({
	className = '',
	onSetChange,
	compact = false,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { colorSet: currentSet, setColorSet } = useColorSet();

	const currentColorSet = COLOR_SETS[currentSet];
	const primaryColor = currentColorSet.primary.light;
	const secondaryColor = currentColorSet.secondary.light;

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSetChange = (newSet: ColorSetKey) => {

		setColorSet(newSet);
		onSetChange?.(newSet);
	};

	return (
		<>
			{/* 트리거 버튼 */}
			<button
				onClick={handleOpenModal}
				className={cn(
					'flex items-center transition-all neu-flat hover:neu-raised',
					compact 
						? 'justify-center p-2 rounded-xl'
						: 'justify-between p-3 w-full rounded-xl',
					className
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
					<div className="flex gap-3 items-center w-full">
						{/* 현재 색상 미리보기 */}
						<div
							className="w-6 h-6 rounded-full border border-border/50"
							style={{
								background: `linear-gradient(135deg, hsl(${primaryColor}) 0%, hsl(${secondaryColor}) 100%)`
							}}
						/>
						<span className="flex-1 text-sm font-medium text-left text-foreground">
							{currentColorSet.name}
						</span>
					</div>
				)}
			</button>

			{/* 색상 선택 모달 */}
			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title="색상 테마 선택"
				size="lg"
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
										{colorSet.name}
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
		</>
	);
};

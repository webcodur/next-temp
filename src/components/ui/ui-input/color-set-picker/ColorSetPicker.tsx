'use client';

import React from 'react';
import { useColorSet } from '@/hooks/ui-hooks/useColorSet';
import { COLOR_SETS, type ColorSetKey } from '@/store/colorSet';
import { cn } from '@/lib/utils';

interface ColorSetPickerProps {
	className?: string;
	onSetChange?: (colorSet: ColorSetKey) => void;
	showLabels?: boolean;
}

export const ColorSetPicker: React.FC<ColorSetPickerProps> = ({
	className = '',
	onSetChange,
	showLabels = true,
}) => {
	const { colorSet: currentSet, setColorSet } = useColorSet();

	const handleSetChange = (newSet: ColorSetKey) => {
		console.log(`🎨 ColorSetPicker: ${currentSet} → ${newSet}`);
		setColorSet(newSet);
		onSetChange?.(newSet);
	};

	return (
		<div className={cn('space-y-4', className)}>
			{showLabels && (
				<div className="text-sm font-medium text-foreground">
					색상 테마 선택
				</div>
			)}
			
			<div className="grid grid-cols-2 gap-3">
				{Object.entries(COLOR_SETS).map(([key, colorSet]) => {
					const isSelected = currentSet === key;
					const typedKey = key as ColorSetKey;
					
					// 라이트 모드 색상을 기본으로 사용 (미리보기용)
					const primaryColor = colorSet.primary.light;
					const secondaryColor = colorSet.secondary.light;
					
					return (
						<button
							key={key}
							onClick={() => handleSetChange(typedKey)}
							className={cn(
								'group relative p-3 rounded-xl transition-all duration-200',
								'neu-flat border hover:shadow-lg focus:outline-hidden focus:neu-inset',
								isSelected && 'neu-inset shadow-inner'
							)}
						>
							{/* 그라데이션 미리보기 박스 */}
							<div
								className="mb-2 w-full h-16 rounded-lg transition-all duration-200 group-hover:scale-105"
								style={{
									background: `linear-gradient(135deg, hsl(${primaryColor}) 0%, hsl(${secondaryColor}) 100%)`,
									boxShadow: isSelected 
										? `inset 0 2px 4px rgba(0,0,0,0.1), 0 0 0 2px hsl(${primaryColor} / 0.3)`
										: `0 2px 4px rgba(0,0,0,0.1)`
								}}
							/>
							
							{/* 색상 세트 이름 */}
							<div className="text-sm font-medium transition-colors text-foreground group-hover:text-primary">
								{colorSet.name}
							</div>
							
							{/* HSL 값 표시 - 라이트/다크 모드별 */}
							<div className="text-xs text-muted-foreground mt-1 space-y-0.5">
								<div>P-L: {colorSet.primary.light}</div>
								<div>P-D: {colorSet.primary.dark}</div>
								<div>S-L: {colorSet.secondary.light}</div>
								<div>S-D: {colorSet.secondary.dark}</div>
							</div>
							
							{/* 선택 표시 */}
							{isSelected && (
								<div className="absolute top-2 right-2 w-3 h-3 rounded-full animate-pulse bg-primary" />
							)}
						</button>
					);
				})}
			</div>
			
			{/* 현재 선택된 세트 정보 */}
			<div className="p-4 rounded-lg border neu-flat">
				<div className="flex gap-3 items-center">
					<div
						className="w-8 h-8 rounded-full"
						style={{
							background: `linear-gradient(135deg, hsl(${COLOR_SETS[currentSet].primary.light}) 0%, hsl(${COLOR_SETS[currentSet].secondary.light}) 100%)`
						}}
					/>
					<div className="flex-1">
						<div className="text-sm font-medium text-foreground">
							선택된 테마: {COLOR_SETS[currentSet].name}
						</div>
						<div className="text-xs text-muted-foreground">
							Light: P:{COLOR_SETS[currentSet].primary.light} | S:{COLOR_SETS[currentSet].secondary.light}
						</div>
						<div className="text-xs text-muted-foreground">
							Dark: P:{COLOR_SETS[currentSet].primary.dark} | S:{COLOR_SETS[currentSet].secondary.dark}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}; 
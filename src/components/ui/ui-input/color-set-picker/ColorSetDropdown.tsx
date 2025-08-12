'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useColorSet } from '@/hooks/ui-hooks/useColorSet';
import { COLOR_SETS, type ColorSetKey } from '@/store/colorSet';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

interface ColorSetDropdownProps {
	className?: string;
	onSetChange?: (colorSet: ColorSetKey) => void;
	compact?: boolean;
}

export const ColorSetDropdown: React.FC<ColorSetDropdownProps> = ({
	className = '',
	onSetChange,
	compact = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const { colorSet: currentSet, setColorSet } = useColorSet();

	// 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node) &&
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSetChange = (newSet: ColorSetKey) => {
		console.log(`🎨 ColorSetDropdown: ${currentSet} → ${newSet}`);
		setColorSet(newSet);
		onSetChange?.(newSet);
		setIsOpen(false);
	};

	const currentColorSet = COLOR_SETS[currentSet];
	const primaryColor = currentColorSet.primary.light;
	const secondaryColor = currentColorSet.secondary.light;

	return (
		<div className={cn('relative', className)} ref={containerRef}>
			{/* 트리거 버튼 */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					'flex items-center transition-all neu-flat hover:neu-raised',
					compact 
						? 'justify-center p-2 rounded-xl'
						: 'justify-between p-3 w-full rounded-xl'
				)}
			>
				{compact ? (
					/* 컴팩트 모드: 색상 미리보기만 */
					<div
						className="w-6 h-6 rounded-full"
						style={{
							background: `linear-gradient(135deg, hsl(${primaryColor}) 0%, hsl(${secondaryColor}) 100%)`
						}}
					/>
				) : (
					/* 일반 모드: 전체 정보 */
					<>
						<div className="flex gap-3 items-center">
							{/* 현재 색상 미리보기 */}
							<div
								className="w-6 h-6 rounded-full"
								style={{
									background: `linear-gradient(135deg, hsl(${primaryColor}) 0%, hsl(${secondaryColor}) 100%)`
								}}
							/>
							<span className="text-sm font-medium text-foreground">
								{currentColorSet.name}
							</span>
						</div>
						<ChevronDown
							className={cn(
								'w-4 h-4 transition-transform text-muted-foreground',
								isOpen && 'rotate-180'
							)}
						/>
					</>
				)}
			</button>

			{/* 드롭다운 메뉴 */}
			{isOpen && typeof window !== 'undefined' && createPortal(
				<div
					ref={menuRef}
					className="fixed z-[9999] mt-2 rounded-xl ring-1 ring-black ring-opacity-5 shadow-lg neu-flat bg-background focus:outline-hidden"
					style={{
						top: (containerRef.current?.getBoundingClientRect().bottom ?? 0) + 8,
						left: containerRef.current?.getBoundingClientRect().left ?? 0,
						width: containerRef.current?.offsetWidth ?? 300,
					}}
				>
					<div className="py-2 rounded-xl bg-background">
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
										'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
										'hover:bg-primary/10',
										isSelected && 'bg-primary/5'
									)}
								>
									{/* 색상 미리보기 */}
									<div
										className="w-6 h-6 rounded-full border border-border"
										style={{
											background: `linear-gradient(135deg, hsl(${primaryColor}) 0%, hsl(${secondaryColor}) 100%)`
										}}
									/>
									<div className="flex-1">
										<div className="text-sm font-medium text-foreground">
											{colorSet.name}
										</div>
									</div>
									{/* 선택 표시 */}
									{isSelected && (
										<div className="w-2 h-2 rounded-full bg-primary" />
									)}
								</button>
							);
						})}
					</div>
				</div>,
				document.body
			)}
		</div>
	);
};
'use client';

import React from 'react';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from '@/hooks/useI18n';

//#region Types
export interface ListHighlightMarkerProps {
	index: number; // 인덱스 (0부터 시작)
	totalCount: number; // 총 아이템 수
	isSelected?: boolean; // 선택됨 여부 (active 상태)
	isHighlighted?: boolean; // 하이라이트됨 여부 (키보드 네비게이션)
	disabled?: boolean; // 비활성화 여부
	onClick?: () => void; // 클릭 핸들러
	colorVariant?: 'primary' | 'secondary'; // 색상 variant
	className?: string; // 커스텀 클래스명
	children: React.ReactNode;
}
//#endregion

//#region List Highlight Marker
const ListHighlightMarker: React.FC<ListHighlightMarkerProps> = ({
	index,
	totalCount,
	isSelected = false,
	isHighlighted = false,
	disabled = false,
	onClick,
	colorVariant = 'primary',
	className = '',
	children,
}) => {
	const { isRTL } = useLocale();
	const isActive = isSelected || isHighlighted;

	// 색상 variant에 따른 스타일
	const colorStyles = {
		bg: colorVariant === 'primary' ? 'bg-primary/5' : 'bg-secondary/5',
		borderActive: colorVariant === 'primary' ? 'border-primary' : 'border-secondary',
		text: colorVariant === 'primary' ? 'text-primary' : 'text-secondary',
		hoverBg: colorVariant === 'primary' ? 'hover:bg-primary/5' : 'hover:bg-secondary/5',
		hoverBorder: colorVariant === 'primary' ? 'hover:border-primary' : 'hover:border-secondary',
	};

	// RTL에 따른 색상 바 위치와 transform 방향 결정 (RTL 대응)
	const getBorderClass = () => {
		if (isRTL) {
			return isActive
				? `${colorStyles.bg} border-e-4 ${colorStyles.borderActive} -translate-x-1`
				: `hover:border-e-4 ${colorStyles.hoverBorder} hover:-translate-x-1 ${colorStyles.hoverBg}`;
		} else {
			return isActive
				? `${colorStyles.bg} border-s-4 ${colorStyles.borderActive} translate-x-1`
				: `hover:border-s-4 ${colorStyles.hoverBorder} hover:translate-x-1 ${colorStyles.hoverBg}`;
		}
	};

	return (
		<div
			className={cn(
				// 기본 스타일
				'relative flex items-center gap-3 px-4 py-3 cursor-pointer group',
				'transition-all duration-150 ease-in-out',

				// 호버 및 active 효과 (RTL 대응)
				getBorderClass(),

				// 비활성화 상태
				disabled && 'opacity-50 cursor-not-allowed pointer-events-none',

				className
			)}
			onClick={disabled ? undefined : onClick}>
			{/* 왼쪽 순번 표시 */}
			<span
				className={cn(
					'text-xs shrink-0 min-w-[40px] transition-colors duration-150',
					isActive ? 'text-foreground/80' : 'text-muted-foreground'
				)}>
				{index + 1}/{totalCount}
			</span>

			{/* 메인 콘텐츠 */}
			<div
				className={cn(
					'flex-1 min-w-0 transition-colors duration-150',
					isActive && 'text-foreground'
				)}>
				{children}
			</div>

			{/* 우측 아이콘 - hover와 active 상태에 따라 변화 */}
			<div className="relative w-4 h-4 shrink-0">
				{/* Plus 아이콘 - hover 시에만 보임 (active가 아닐 때) */}
				<Plus
					className={cn(
						'absolute inset-0 w-4 h-4 text-muted-foreground transition-all duration-200',
						'opacity-0 scale-75',
						!isActive && 'group-hover:opacity-100 group-hover:scale-100'
					)}
					strokeWidth={2}
				/>

				{/* Check 아이콘 - active 상태에서만 보임 */}
				<Check
					className={cn(
						`absolute inset-0 w-4 h-4 ${colorStyles.text} transition-all duration-200`,
						'transform',
						isActive
							? 'opacity-100 scale-100 rotate-0'
							: 'opacity-0 scale-75 rotate-45'
					)}
					strokeWidth={2.5}
				/>
			</div>
		</div>
	);
};
//#endregion

export default ListHighlightMarker;

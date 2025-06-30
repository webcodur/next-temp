'use client';

import React from 'react';
import { cn } from '@/lib/utils';

//#region Types
export interface ListHighlightMarkerProps {
	index: number; // 인덱스 (0부터 시작)
	totalCount: number; // 총 아이템 수
	isSelected?: boolean; // 선택됨 여부
	isHighlighted?: boolean; // 하이라이트됨 여부 (키보드 네비게이션)
	isHovered?: boolean; // 호버됨 여부
	disabled?: boolean; // 비활성화 여부
	onClick?: () => void; // 클릭 핸들러
	onMouseEnter?: () => void; // 마우스 엔터 핸들러
	onMouseLeave?: () => void; // 마우스 리브 핸들러
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
	isHovered = false,
	disabled = false,
	onClick,
	onMouseEnter,
	onMouseLeave,
	className = '',
	children,
}) => {
	const isActive = isHighlighted || isHovered || isSelected;

	// 새로운 마커 클래스 조합
	const itemClasses = cn(
		'marker-item',
		{
			'marker-active': isActive && !disabled,
			'marker-disabled': disabled,
		},
		className
	);

	return (
		<div
			className={itemClasses}
			onClick={disabled ? undefined : onClick}
			onMouseEnter={disabled ? undefined : onMouseEnter}
			onMouseLeave={disabled ? undefined : onMouseLeave}>
			<div className="flex flex-1 gap-2 items-center min-w-0">
				<span className="text-xs text-gray-400 shrink-0">
					{index + 1}/{totalCount}
				</span>
				<div className="flex-1 truncate">{children}</div>
			</div>
		</div>
	);
};
//#endregion

export default ListHighlightMarker;

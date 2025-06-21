'use client';

import React from 'react';
import { cn } from '@/lib/utils';

//#region Types
export interface ListHighlightMarkerProps {
	/** 인덱스 (0부터 시작) */
	index: number;
	/** 총 아이템 수 */
	totalCount: number;
	/** 선택됨 여부 */
	isSelected?: boolean;
	/** 하이라이트됨 여부 (키보드 네비게이션) */
	isHighlighted?: boolean;
	/** 호버됨 여부 */
	isHovered?: boolean;
	/** 비활성화 여부 */
	disabled?: boolean;
	/** 클릭 핸들러 */
	onClick?: () => void;
	/** 마우스 엔터 핸들러 */
	onMouseEnter?: () => void;
	/** 마우스 리브 핸들러 */
	onMouseLeave?: () => void;
	/** 커스텀 클래스명 */
	className?: string;
	/** 자식 컴포넌트 */
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
	const isEven = index % 2 === 0;

	// 전역 CSS 클래스 조합
	const itemClasses = cn(
		'list-item-zebra',
		isEven ? 'list-item-even' : 'list-item-odd',
		{
			'list-item-active': isActive && !disabled,
			'list-item-disabled': disabled,
			'list-item-hover': !isActive && !disabled,
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
				<span className="flex-shrink-0 text-xs text-gray-400">
					{index + 1}/{totalCount}
				</span>
				<div className="flex-1 truncate">
					{children}
				</div>
			</div>
		</div>
	);
};
//#endregion

export default ListHighlightMarker; 
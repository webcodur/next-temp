'use client';

import { useSetAtom, useAtomValue } from 'jotai';
import {
	endPanelWidthAtom,
	END_PANEL_MIN_WIDTH,
	END_PANEL_MAX_WIDTH,
	isResizingAtom,
	isSideResizeControlHoveredAtom,
} from '@/store/sidebar';
import { useCallback, useEffect, useRef } from 'react';
import { defaults } from '@/data/sidebarConfig';
import { GripVertical } from 'lucide-react';

export function SideResizeControl() {
	const setEndPanelWidth = useSetAtom(endPanelWidthAtom);
	const setIsResizing = useSetAtom(isResizingAtom);
	const setIsSideResizeControlHovered = useSetAtom(isSideResizeControlHoveredAtom);
	const isResizingState = useAtomValue(isResizingAtom);
	const isHoveredState = useAtomValue(isSideResizeControlHoveredAtom);
	const isResizing = useRef(false);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isResizing.current) return;

			// 사이드바 내부에서 끝 패널 크기 조정
			let newWidth = e.clientX - defaults.startColumnWidth;

			if (newWidth < END_PANEL_MIN_WIDTH) newWidth = END_PANEL_MIN_WIDTH;
			if (newWidth > END_PANEL_MAX_WIDTH) newWidth = END_PANEL_MAX_WIDTH;

			setEndPanelWidth(newWidth);
		},
		[setEndPanelWidth]
	);

	const handleMouseUp = useCallback(() => {
		isResizing.current = false;
		setIsResizing(false);
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
		document.body.style.cursor = 'auto';
		document.body.style.userSelect = 'auto';
	}, [handleMouseMove, setIsResizing]);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			isResizing.current = true;
			setIsResizing(true);
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
			document.body.style.cursor = 'col-resize';
			document.body.style.userSelect = 'none';
		},
		[handleMouseMove, handleMouseUp, setIsResizing]
	);

	useEffect(() => {
		return () => {
			// Cleanup listeners when component unmounts
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [handleMouseMove, handleMouseUp]);

	const isActive = isResizingState || isHoveredState;

	return (
		<div
			className="flex absolute top-0 z-50 justify-center items-center w-4 h-full end-0 cursor-col-resize"
			onMouseDown={handleMouseDown}
			onMouseEnter={() => setIsSideResizeControlHovered(true)}
			onMouseLeave={() => setIsSideResizeControlHovered(false)}
		>
			{/* 세로선 배경 */}
			<div
				className={`absolute -end-0.5 top-0 h-full w-0.5 transition-all duration-200 ${
					isActive ? 'bg-primary opacity-60' : 'bg-border/20 opacity-40'
				} blur-[0.5px] shadow-sm`}
			/>
			
			{/* end 측 음영 효과 */}
			<div
				className={`absolute -end-1 top-0 h-full w-2 transition-all duration-200 ${
					isActive ? 'bg-gradient-to-r from-primary/10 to-primary/20' : 'bg-gradient-to-r from-border/5 to-border/10'
				} blur-sm pointer-events-none`}
			/>
			
			{/* 드래그 핸들 아이콘 */}
			<GripVertical
				className={`h-6 w-auto transition-colors duration-200 relative z-10 ${
					isActive ? 'text-primary' : 'text-border/70'
				}`}
			/>
		</div>
	);
} 
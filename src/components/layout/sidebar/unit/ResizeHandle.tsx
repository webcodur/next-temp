'use client';

import { useSetAtom, useAtomValue } from 'jotai';
import {
	rPanelWidthAtom,
	R_PANEL_MIN_WIDTH,
	R_PANEL_MAX_WIDTH,
	isResizingAtom,
	isResizeHandleHoveredAtom,
} from '@/store/sidebar';
import { useCallback, useEffect, useRef } from 'react';
import { defaults } from '@/data/sidebarConfig';
import { GripVertical } from 'lucide-react';
export function ResizeHandle() {
	const setRPanelWidth = useSetAtom(rPanelWidthAtom);
	const setIsResizing = useSetAtom(isResizingAtom);
	const setIsResizeHandleHovered = useSetAtom(isResizeHandleHoveredAtom);
	const isResizingState = useAtomValue(isResizingAtom);
	const isHoveredState = useAtomValue(isResizeHandleHoveredAtom);
	const isResizing = useRef(false);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isResizing.current) return;

			// 사이드바 내부에서 우측 패널 크기 조정
			let newWidth = e.clientX - defaults.leftColumnWidth;

			if (newWidth < R_PANEL_MIN_WIDTH) newWidth = R_PANEL_MIN_WIDTH;
			if (newWidth > R_PANEL_MAX_WIDTH) newWidth = R_PANEL_MAX_WIDTH;

			setRPanelWidth(newWidth);
		},
		[setRPanelWidth]
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
			className="absolute top-0 end-0 h-full w-4 cursor-col-resize z-50 flex items-center justify-center"
			onMouseDown={handleMouseDown}
			onMouseEnter={() => setIsResizeHandleHovered(true)}
			onMouseLeave={() => setIsResizeHandleHovered(false)}
		>
			<GripVertical
				className={`h-6 w-auto transition-colors duration-200 ${
					isActive ? 'text-brand' : 'text-border/70'
				}`}
			/>
		</div>
	);
} 
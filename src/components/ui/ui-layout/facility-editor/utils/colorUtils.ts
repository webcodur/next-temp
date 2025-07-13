// 색상 계산 관련 유틸리티 함수

import {
	FacilityLayout,
	EditorState,
	FACILITY_COLORS,
	GridObject,
} from '@/types/facility';

export const getCellColor = (
	layout: FacilityLayout,
	editorState: EditorState,
	x: number,
	y: number
): string => {
	const obj = layout.objects.find(
		(o) => o.position.x === x && o.position.y === y
	);

	// 선택된 셀의 배경색만 변경 (현재 위치는 border로만 표시)
	if (editorState.selectedCells.some((cell) => cell.x === x && cell.y === y)) {
		return FACILITY_COLORS.selected;
	}

	// 셀에 객체가 있는 경우 해당 타입의 색상 반환
	if (obj) {
		if (obj.type === 'seat') return FACILITY_COLORS.seat;
		if (obj.type === 'space') return FACILITY_COLORS.space;
		if (obj.type === 'object') return FACILITY_COLORS.object;
	}

	// 빈 셀은 space 색상 (빈 셀 없이 전부 빈공간으로 시작)
	return FACILITY_COLORS.space;
};

export const getTextColor = (obj: GridObject | undefined): string => {
	return obj?.type === 'space' ? '#666' : '#fff';
};

export const isCurrentPosition = (
	editorState: EditorState,
	x: number,
	y: number
): boolean => {
	return (
		editorState.currentPosition.x === x && editorState.currentPosition.y === y
	);
};

export const isSelected = (
	editorState: EditorState,
	x: number,
	y: number
): boolean => {
	return editorState.selectedCells.some((cell) => cell.x === x && cell.y === y);
};

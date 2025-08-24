// 시설별 좌석 예약 시스템 에디터 관련 타입

import { FacilityLayout, GridCell, ENUM_ObjectType } from './core';

export interface EditorState {
	mode: 'sector' | 'naming';
	selectedCells: GridCell[];
	currentPosition: { x: number; y: number };
	currentObjectType: ENUM_ObjectType;
	history: FacilityLayout[];
	historyIndex: number;
	isLocked: boolean;
}

export interface AdminEditorProps {
	layout: FacilityLayout;
	onLayoutChange: (layout: FacilityLayout) => void;
	onSave: (layout: FacilityLayout) => void;
}

export interface KeyboardHandlers {
	onPlaceObject: (type: ENUM_ObjectType, position: { x: number; y: number }) => void;
	onDeleteObject: (position: { x: number; y: number }) => void;
	onUndo: () => void;
	onRedo: () => void;
	onStartNaming: () => void;
	onMoveCursor: (dx: number, dy: number, isSelecting: boolean) => void;
	onCycleObjectType: () => void;
	onMoveToNextNaming: (reverse: boolean) => void;
}

export interface MouseHandlers {
	onCellClick: (x: number, y: number) => void;
	onCellHover: (x: number, y: number) => void;
}

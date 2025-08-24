// #region 기본 타입
export interface Position {
	x: number;
	y: number;
}

export type ENUM_CellType = 'empty' | 'seat' | 'object';

export interface GridCell {
	x: number;
	y: number;
	type: ENUM_CellType;
	name: string;
}
// #endregion

// #region 레이아웃 타입
export interface FacilityLayout {
	gridSize: {
		width: number;
		height: number;
	};
	cells: GridCell[];
	cellSize: number; // 셀 크기 추가
}
// #endregion

// #region 에디터 상태
export interface EditorState {
	selectedTool: ENUM_CellType;
	selectedCells: Position[];
	lastSelectedCell: Position | null;
	isDragging: boolean;
	dragStart: Position | null;
	dragEnd: Position | null;
	history: FacilityLayout[];
	historyIndex: number;
}
// #endregion

// #region 유틸리티 함수 타입
export interface EditorActions {
	setCellType: (position: Position, type: ENUM_CellType) => void;
	setCellsType: (positions: Position[], type: ENUM_CellType) => void;
	setCellName: (position: Position, name: string) => void;
	selectCell: (
		position: Position,
		addToSelection?: boolean,
		rangeSelect?: boolean
	) => void;
	selectCells: (positions: Position[]) => void;
	clearSelection: () => void;
	clearCell: (position: Position) => void;
	clearCells: (positions: Position[]) => void;
	undo: () => void;
	redo: () => void;
	setCellSize: (size: number) => void; // 셀 크기 변경
	setGridSize: (width: number, height: number) => void; // 그리드 크기 변경
}
// #endregion

// #region 상수
export const DEFAULT_CELL_SIZE = 40;
export const MIN_CELL_SIZE = 20;
export const MAX_CELL_SIZE = 80;
export const DEFAULT_GRID_SIZE = { width: 20, height: 15 };
export const MIN_GRID_SIZE = { width: 5, height: 5 };
export const MAX_GRID_SIZE = { width: 50, height: 50 };
export const MAX_HISTORY_SIZE = 50;
// #endregion

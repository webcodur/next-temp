/* 
  파일명: /hooks/useFacilityEditor.ts
  기능: 시설 레이아웃 편집기 관리 훅
  책임: 그리드 편집, 셀 타입 변경, 히스토리 관리, 키보드/마우스 이벤트 처리
  
  주요 기능:
  - 그리드 셀 편집 및 타입 변경 (주차, 벽, 기둥, 출입구)
  - 실행취소/다시실행 히스토리 관리 (최대 50개)
  - 마우스 드래그 다중 선택 및 편집
  - 키보드 단축키 지원 (Ctrl+Z/Y, Delete, 숫자키)
  - 선택 영역 표시 및 관리
*/ // ------------------------------

import { useState, useCallback } from 'react';
import {
	FacilityLayout,
	EditorState,
	Position,
	CellType,
	EditorActions,
	DEFAULT_GRID_SIZE,
	DEFAULT_CELL_SIZE,
	MIN_CELL_SIZE,
	MAX_CELL_SIZE,
	MIN_GRID_SIZE,
	MAX_GRID_SIZE,
	MAX_HISTORY_SIZE,
} from '@/types/facility-editor';

// #region 초기 상태 생성
const createInitialLayout = (): FacilityLayout => ({
	gridSize: DEFAULT_GRID_SIZE,
	cells: [],
	cellSize: DEFAULT_CELL_SIZE,
});

const createInitialEditorState = (): EditorState => ({
	selectedTool: 'seat',
	selectedCells: [],
	lastSelectedCell: null,
	isDragging: false,
	dragStart: null,
	dragEnd: null,
	history: [createInitialLayout()],
	historyIndex: 0,
});
// #endregion

// #region 유틸리티 함수
const generateDefaultName = (type: CellType, position: Position): string => {
	switch (type) {
		case 'seat':
			return `${String.fromCharCode(65 + position.y)}${position.x + 1}`;
		case 'object':
			return `사물${position.x + 1}`;
		default:
			return '';
	}
};

const addToHistory = (
	history: FacilityLayout[],
	historyIndex: number,
	newLayout: FacilityLayout
): { newHistory: FacilityLayout[]; newIndex: number } => {
	const truncatedHistory = history.slice(0, historyIndex + 1);
	const newHistory = [...truncatedHistory, newLayout];

	if (newHistory.length > MAX_HISTORY_SIZE) {
		newHistory.shift();
		return { newHistory, newIndex: newHistory.length - 1 };
	}

	return { newHistory, newIndex: newHistory.length - 1 };
};

const positionsEqual = (a: Position, b: Position): boolean =>
	a.x === b.x && a.y === b.y;

const isPositionInArray = (
	position: Position,
	positions: Position[]
): boolean => positions.some((p) => positionsEqual(p, position));

// 그리드 크기 변경 시 범위 밖 셀 제거
const filterCellsInBounds = (
	cells: Array<{ x: number; y: number; type: CellType; name: string }>,
	gridSize: { width: number; height: number }
): Array<{ x: number; y: number; type: CellType; name: string }> => {
	return cells.filter(
		(cell) =>
			cell.x >= 0 &&
			cell.x < gridSize.width &&
			cell.y >= 0 &&
			cell.y < gridSize.height
	);
};
// #endregion

// #region 메인 훅
export const useFacilityEditor = (initialLayout?: FacilityLayout) => {
	const [layout, setLayout] = useState<FacilityLayout>(
		initialLayout || createInitialLayout()
	);
	const [editorState, setEditorState] = useState<EditorState>(() => ({
		...createInitialEditorState(),
		history: [initialLayout || createInitialLayout()],
	}));

	const canUndo = editorState.historyIndex > 0;
	const canRedo = editorState.historyIndex < editorState.history.length - 1;

	// 단일 셀 타입 설정
	const setCellType = useCallback(
		(position: Position, type: CellType) => {
			const newLayout = { ...layout };
			const existingCellIndex = newLayout.cells.findIndex((cell) =>
				positionsEqual(cell, position)
			);

			if (type === 'empty') {
				if (existingCellIndex !== -1) {
					newLayout.cells.splice(existingCellIndex, 1);
				}
			} else {
				const newCell = {
					x: position.x,
					y: position.y,
					type,
					name: generateDefaultName(type, position),
				};

				if (existingCellIndex !== -1) {
					newLayout.cells[existingCellIndex] = newCell;
				} else {
					newLayout.cells.push(newCell);
				}
			}

			const { newHistory, newIndex } = addToHistory(
				editorState.history,
				editorState.historyIndex,
				newLayout
			);

			setLayout(newLayout);
			setEditorState((prev) => ({
				...prev,
				history: newHistory,
				historyIndex: newIndex,
			}));
		},
		[layout, editorState.history, editorState.historyIndex]
	);

	// 다중 셀 타입 설정
	const setCellsType = useCallback(
		(positions: Position[], type: CellType) => {
			const newLayout = { ...layout };

			positions.forEach((position) => {
				const existingCellIndex = newLayout.cells.findIndex((cell) =>
					positionsEqual(cell, position)
				);

				if (type === 'empty') {
					if (existingCellIndex !== -1) {
						newLayout.cells.splice(existingCellIndex, 1);
					}
				} else {
					const newCell = {
						x: position.x,
						y: position.y,
						type,
						name: generateDefaultName(type, position),
					};

					if (existingCellIndex !== -1) {
						newLayout.cells[existingCellIndex] = newCell;
					} else {
						newLayout.cells.push(newCell);
					}
				}
			});

			const { newHistory, newIndex } = addToHistory(
				editorState.history,
				editorState.historyIndex,
				newLayout
			);

			setLayout(newLayout);
			setEditorState((prev) => ({
				...prev,
				history: newHistory,
				historyIndex: newIndex,
			}));
		},
		[layout, editorState.history, editorState.historyIndex]
	);

	// 셀 이름 설정
	const setCellName = useCallback(
		(position: Position, name: string) => {
			const newLayout = { ...layout };
			const cellIndex = newLayout.cells.findIndex((cell) =>
				positionsEqual(cell, position)
			);

			if (cellIndex !== -1) {
				newLayout.cells[cellIndex].name = name;

				const { newHistory, newIndex } = addToHistory(
					editorState.history,
					editorState.historyIndex,
					newLayout
				);

				setLayout(newLayout);
				setEditorState((prev) => ({
					...prev,
					history: newHistory,
					historyIndex: newIndex,
				}));
			}
		},
		[layout, editorState.history, editorState.historyIndex]
	);

	// 셀 크기 변경
	const setCellSize = useCallback(
		(size: number) => {
			const clampedSize = Math.max(
				MIN_CELL_SIZE,
				Math.min(MAX_CELL_SIZE, size)
			);
			const newLayout = { ...layout, cellSize: clampedSize };

			const { newHistory, newIndex } = addToHistory(
				editorState.history,
				editorState.historyIndex,
				newLayout
			);

			setLayout(newLayout);
			setEditorState((prev) => ({
				...prev,
				history: newHistory,
				historyIndex: newIndex,
			}));
		},
		[layout, editorState.history, editorState.historyIndex]
	);

	// 그리드 크기 변경
	const setGridSize = useCallback(
		(width: number, height: number) => {
			const clampedWidth = Math.max(
				MIN_GRID_SIZE.width,
				Math.min(MAX_GRID_SIZE.width, width)
			);
			const clampedHeight = Math.max(
				MIN_GRID_SIZE.height,
				Math.min(MAX_GRID_SIZE.height, height)
			);

			const newGridSize = { width: clampedWidth, height: clampedHeight };
			const filteredCells = filterCellsInBounds(layout.cells, newGridSize);

			const newLayout = {
				...layout,
				gridSize: newGridSize,
				cells: filteredCells,
			};

			const { newHistory, newIndex } = addToHistory(
				editorState.history,
				editorState.historyIndex,
				newLayout
			);

			setLayout(newLayout);
			setEditorState((prev) => ({
				...prev,
				history: newHistory,
				historyIndex: newIndex,
				selectedCells: prev.selectedCells.filter(
					(pos) => pos.x < clampedWidth && pos.y < clampedHeight
				),
			}));
		},
		[layout, editorState.history, editorState.historyIndex]
	);

	// 셀 선택 (단일/다중/범위 선택 지원)
	const selectCell = useCallback(
		(position: Position, addToSelection = false, rangeSelect = false) => {
			setEditorState((prev) => {
				let newSelectedCells: Position[];

				if (rangeSelect && prev.lastSelectedCell) {
					// 범위 선택
					const startX = Math.min(prev.lastSelectedCell.x, position.x);
					const endX = Math.max(prev.lastSelectedCell.x, position.x);
					const startY = Math.min(prev.lastSelectedCell.y, position.y);
					const endY = Math.max(prev.lastSelectedCell.y, position.y);

					const rangePositions: Position[] = [];
					for (let y = startY; y <= endY; y++) {
						for (let x = startX; x <= endX; x++) {
							rangePositions.push({ x, y });
						}
					}
					newSelectedCells = rangePositions;
				} else if (addToSelection) {
					// 추가 선택 (Ctrl+클릭)
					const isAlreadySelected = isPositionInArray(
						position,
						prev.selectedCells
					);

					if (isAlreadySelected) {
						newSelectedCells = prev.selectedCells.filter(
							(cell) => !positionsEqual(cell, position)
						);
					} else {
						newSelectedCells = [...prev.selectedCells, position];
					}
				} else {
					// 단일 선택
					newSelectedCells = [position];
				}

				return {
					...prev,
					selectedCells: newSelectedCells,
					lastSelectedCell: position,
				};
			});
		},
		[]
	);

	// 다중 셀 선택
	const selectCells = useCallback((positions: Position[]) => {
		setEditorState((prev) => ({
			...prev,
			selectedCells: positions,
			lastSelectedCell: positions[positions.length - 1] || null,
		}));
	}, []);

	// 선택 해제
	const clearSelection = useCallback(() => {
		setEditorState((prev) => ({
			...prev,
			selectedCells: [],
			lastSelectedCell: null,
		}));
	}, []);

	// 셀 지우기 (단일)
	const clearCell = useCallback(
		(position: Position) => {
			setCellType(position, 'empty');
		},
		[setCellType]
	);

	// 셀 지우기 (다중)
	const clearCells = useCallback(
		(positions: Position[]) => {
			setCellsType(positions, 'empty');
		},
		[setCellsType]
	);

	// 실행취소
	const undo = useCallback(() => {
		if (canUndo) {
			const newIndex = editorState.historyIndex - 1;
			const previousLayout = editorState.history[newIndex];

			setLayout(previousLayout);
			setEditorState((prev) => ({
				...prev,
				historyIndex: newIndex,
			}));
		}
	}, [canUndo, editorState.history, editorState.historyIndex]);

	// 다시실행
	const redo = useCallback(() => {
		if (canRedo) {
			const newIndex = editorState.historyIndex + 1;
			const nextLayout = editorState.history[newIndex];

			setLayout(nextLayout);
			setEditorState((prev) => ({
				...prev,
				historyIndex: newIndex,
			}));
		}
	}, [canRedo, editorState.history, editorState.historyIndex]);

	// 도구 선택
	const setSelectedTool = useCallback((tool: CellType) => {
		setEditorState((prev) => ({
			...prev,
			selectedTool: tool,
		}));
	}, []);

	// 셀 클릭 처리 (Ctrl, Shift 키 지원)
	const handleCellClick = useCallback(
		(position: Position, ctrlKey = false, shiftKey = false) => {
			// 드래그 중일 때는 클릭 처리하지 않음
			if (editorState.isDragging) return;

			if (ctrlKey) {
				// Ctrl+클릭: 추가 선택
				selectCell(position, true, false);
			} else if (shiftKey) {
				// Shift+클릭: 범위 선택
				selectCell(position, false, true);
			} else {
				// 일반 클릭: 선택만 (타입 변경 제거)
				selectCell(position, false, false);
			}
		},
		[editorState.isDragging, selectCell]
	);

	// 우클릭 처리 (빈 공간 만들기)
	const handleCellRightClick = useCallback(
		(position: Position) => {
			setCellType(position, 'empty');
		},
		[setCellType]
	);

	// 드래그 시작 처리
	const handleDragStart = useCallback((position: Position) => {
		setEditorState((prev) => ({
			...prev,
			isDragging: true,
			dragStart: position,
			dragEnd: null,
			selectedCells: [], // 기존 선택 영역 초기화
			lastSelectedCell: null, // 마지막 선택 셀 초기화
		}));
	}, []);

	// 드래그 중 처리
	const handleDragMove = useCallback((position: Position) => {
		setEditorState((prev) => {
			if (!prev.isDragging || !prev.dragStart) return prev;

			return {
				...prev,
				dragEnd: position,
			};
		});
	}, []);

	// 드래그 종료 처리
	const handleDragEnd = useCallback(() => {
		setEditorState((prev) => {
			if (!prev.isDragging || !prev.dragStart) {
				return {
					...prev,
					isDragging: false,
					dragStart: null,
					dragEnd: null,
				};
			}

			// dragEnd가 null이면 단일 셀 선택
			if (!prev.dragEnd) {
				return {
					...prev,
					selectedCells: [prev.dragStart],
					lastSelectedCell: prev.dragStart,
					isDragging: false,
					dragStart: null,
					dragEnd: null,
				};
			}

			// 드래그 영역의 모든 셀 선택
			const startX = Math.min(prev.dragStart.x, prev.dragEnd.x);
			const endX = Math.max(prev.dragStart.x, prev.dragEnd.x);
			const startY = Math.min(prev.dragStart.y, prev.dragEnd.y);
			const endY = Math.max(prev.dragStart.y, prev.dragEnd.y);

			const draggedPositions: Position[] = [];
			for (let y = startY; y <= endY; y++) {
				for (let x = startX; x <= endX; x++) {
					draggedPositions.push({ x, y });
				}
			}

			return {
				...prev,
				selectedCells: draggedPositions,
				lastSelectedCell: prev.dragEnd,
				isDragging: false,
				dragStart: null,
				dragEnd: null,
			};
		});
	}, []);

	// 키보드 네비게이션
	const handleNavigate = useCallback(
		(dx: number, dy: number, extend: boolean) => {
			setEditorState((prev) => {
				const currentPos = prev.lastSelectedCell || { x: 0, y: 0 };
				const newX = Math.max(
					0,
					Math.min(layout.gridSize.width - 1, currentPos.x + dx)
				);
				const newY = Math.max(
					0,
					Math.min(layout.gridSize.height - 1, currentPos.y + dy)
				);
				const newPosition = { x: newX, y: newY };

				if (extend) {
					// Shift+방향키: 범위 확장
					const startPos =
						prev.selectedCells.length > 0 ? prev.selectedCells[0] : currentPos;

					const minX = Math.min(startPos.x, newX);
					const maxX = Math.max(startPos.x, newX);
					const minY = Math.min(startPos.y, newY);
					const maxY = Math.max(startPos.y, newY);

					const rangePositions: Position[] = [];
					for (let y = minY; y <= maxY; y++) {
						for (let x = minX; x <= maxX; x++) {
							rangePositions.push({ x, y });
						}
					}

					return {
						...prev,
						selectedCells: rangePositions,
						lastSelectedCell: newPosition,
					};
				} else {
					// 일반 방향키: 단일 선택 이동
					return {
						...prev,
						selectedCells: [newPosition],
						lastSelectedCell: newPosition,
					};
				}
			});
		},
		[layout.gridSize]
	);

	// 액션 객체
	const actions: EditorActions = {
		setCellType,
		setCellsType,
		setCellName,
		selectCell,
		selectCells,
		clearSelection,
		clearCell,
		clearCells,
		undo,
		redo,
		setCellSize,
		setGridSize,
	};

	return {
		layout,
		editorState,
		canUndo,
		canRedo,
		actions,
		setSelectedTool,
		handleCellClick,
		handleCellRightClick,
		handleDragStart,
		handleDragMove,
		handleDragEnd,
		handleNavigate,
	};
};
// #endregion

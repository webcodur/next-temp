// 에디터 상태 관리 커스텀 훅

import { useState } from 'react';
import { FacilityLayout, EditorState, ENUM_ObjectType } from '@/types/facility';

export const useEditorState = (layout: FacilityLayout) => {
	const [editorState, setEditorState] = useState<EditorState>({
		mode: 'sector',
		selectedCells: [],
		currentPosition: { x: 0, y: 0 },
		currentObjectType: 'seat',
		history: [layout],
		historyIndex: 0,
		isLocked: false,
	});

	const setMode = (mode: EditorState['mode']) => {
		setEditorState((prev) => ({
			...prev,
			mode,
			selectedCells: [],
		}));
	};

	const toggleLock = () => {
		setEditorState((prev) => ({
			...prev,
			isLocked: !prev.isLocked,
		}));
	};

	const setCurrentPosition = (position: { x: number; y: number }) => {
		setEditorState((prev) => ({
			...prev,
			currentPosition: position,
		}));
	};

	const setSelectedCells = (cells: EditorState['selectedCells']) => {
		setEditorState((prev) => ({
			...prev,
			selectedCells: cells,
		}));
	};

	const cycleObjectType = () => {
		const types: ENUM_ObjectType[] = ['seat', 'space', 'object'];
		const currentIndex = types.indexOf(editorState.currentObjectType);
		const nextIndex = (currentIndex + 1) % types.length;

		setEditorState((prev) => ({
			...prev,
			currentObjectType: types[nextIndex],
		}));
	};

	const moveCursor = (dx: number, dy: number, isSelecting: boolean) => {
		const newX = Math.max(
			0,
			Math.min(layout.gridSize.width - 1, editorState.currentPosition.x + dx)
		);
		const newY = Math.max(
			0,
			Math.min(layout.gridSize.height - 1, editorState.currentPosition.y + dy)
		);

		setEditorState((prev) => {
			const newPosition = { x: newX, y: newY };
			let newSelectedCells = [...prev.selectedCells];

			if (isSelecting) {
				const cell = { x: newX, y: newY, isOccupied: false };
				const cellIndex = newSelectedCells.findIndex(
					(c) => c.x === newX && c.y === newY
				);
				if (cellIndex === -1) {
					newSelectedCells.push(cell);
				}
			} else {
				newSelectedCells = [];
			}

			return {
				...prev,
				currentPosition: newPosition,
				selectedCells: newSelectedCells,
			};
		});
	};

	return {
		editorState,
		setEditorState,
		setMode,
		toggleLock,
		setCurrentPosition,
		setSelectedCells,
		cycleObjectType,
		moveCursor,
	};
};

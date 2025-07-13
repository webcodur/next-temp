// 히스토리 관리 커스텀 훅

import { FacilityLayout } from '@/types/facility';
import { useEditorState } from './useEditorState';

export const useHistory = (
	layout: FacilityLayout,
	onLayoutChange: (layout: FacilityLayout) => void
) => {
	const { editorState, setEditorState } = useEditorState(layout);

	const addToHistory = (newLayout: FacilityLayout) => {
		setEditorState((prev) => ({
			...prev,
			history: [...prev.history.slice(0, prev.historyIndex + 1), newLayout],
			historyIndex: prev.historyIndex + 1,
		}));
	};

	const undo = () => {
		if (editorState.historyIndex > 0) {
			const prevLayout = editorState.history[editorState.historyIndex - 1];
			onLayoutChange(prevLayout);
			setEditorState((prev) => ({
				...prev,
				historyIndex: prev.historyIndex - 1,
			}));
		}
	};

	const redo = () => {
		if (editorState.historyIndex < editorState.history.length - 1) {
			const nextLayout = editorState.history[editorState.historyIndex + 1];
			onLayoutChange(nextLayout);
			setEditorState((prev) => ({
				...prev,
				historyIndex: prev.historyIndex + 1,
			}));
		}
	};

	const canUndo = editorState.historyIndex > 0;
	const canRedo = editorState.historyIndex < editorState.history.length - 1;

	return {
		addToHistory,
		undo,
		redo,
		canUndo,
		canRedo,
	};
};

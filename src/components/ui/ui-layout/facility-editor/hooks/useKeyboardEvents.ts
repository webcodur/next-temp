// 키보드 이벤트 처리 커스텀 훅

import { useEffect } from 'react';
import { EditorState, ENUM_ObjectType } from '@/types/facility';

interface KeyboardEventHandlers {
	onPlaceObject: (type: ENUM_ObjectType) => void;
	onDeleteObject: () => void;
	onUndo: () => void;
	onRedo: () => void;
	onStartNaming: () => void;
	onMoveCursor: (dx: number, dy: number, isSelecting: boolean) => void;
	onCycleObjectType: () => void;
	onMoveToNextNaming: (reverse: boolean) => void;
	onToggleHelp: () => void;
}

export const useKeyboardEvents = (
	editorState: EditorState,
	isModalOpen: boolean,
	handlers: KeyboardEventHandlers
) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// 잠금 모드에서는 모든 키보드 입력 차단
			if (editorState.isLocked) {
				return;
			}

			// 모달이 열려있을 때는 키보드 이벤트 처리하지 않음
			if (isModalOpen) {
				return;
			}

			switch (e.key) {
				case 'ArrowUp':
					e.preventDefault();
					handlers.onMoveCursor(0, -1, e.shiftKey);
					break;
				case 'ArrowDown':
					e.preventDefault();
					handlers.onMoveCursor(0, 1, e.shiftKey);
					break;
				case 'ArrowLeft':
					e.preventDefault();
					handlers.onMoveCursor(-1, 0, e.shiftKey);
					break;
				case 'ArrowRight':
					e.preventDefault();
					handlers.onMoveCursor(1, 0, e.shiftKey);
					break;
				case 'q':
				case 'Q':
					// 이름 편집 모드에서는 q,w,e 키를 모달 열기로 처리
					if (editorState.mode === 'naming') {
						handlers.onStartNaming();
						return;
					}
					e.preventDefault();
					handlers.onPlaceObject('seat');
					break;
				case 'w':
				case 'W':
					if (editorState.mode === 'naming') {
						handlers.onStartNaming();
						return;
					}
					e.preventDefault();
					handlers.onPlaceObject('space');
					break;
				case 'e':
				case 'E':
					if (editorState.mode === 'naming') {
						handlers.onStartNaming();
						return;
					}
					e.preventDefault();
					handlers.onPlaceObject('object');
					break;
				case 'x':
				case 'X':
					if (editorState.mode === 'naming') {
						return; // 이름 모드에서는 삭제 금지
					}
					e.preventDefault();
					handlers.onDeleteObject();
					break;
				case ' ':
					if (editorState.mode === 'naming') {
						handlers.onStartNaming();
						return;
					}
					e.preventDefault();
					handlers.onCycleObjectType();
					break;
				case 'Tab':
					e.preventDefault();
					if (editorState.mode === 'naming') {
						handlers.onMoveToNextNaming(e.shiftKey);
					}
					break;
				case 'Enter':
					e.preventDefault();
					if (editorState.mode === 'naming') {
						handlers.onStartNaming();
					}
					break;
				case 'z':
					if (e.ctrlKey) {
						e.preventDefault();
						handlers.onUndo();
					}
					break;
				case 'y':
					if (e.ctrlKey) {
						e.preventDefault();
						handlers.onRedo();
					}
					break;
				case 'F1':
					e.preventDefault();
					handlers.onToggleHelp();
					break;
				default:
					// 이름 편집 모드에서 일반 문자 입력시 모달 열기
					if (editorState.mode === 'naming' && e.key.length === 1) {
						handlers.onStartNaming();
					}
					break;
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [editorState, isModalOpen, handlers]);
};

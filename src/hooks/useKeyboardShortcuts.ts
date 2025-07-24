/* 
  파일명: /hooks/useKeyboardShortcuts.ts
  기능: 키보드 단축키 관리 훅
  책임: 에디터 키보드 이벤트 처리, 단축키 조합 감지
  
  주요 기능:
  - Ctrl+Z (실행취소), Ctrl+Y (다시실행)
  - Delete (선택 영역 삭제)
  - 숫자키 1-5 (셀 타입 변경)
  - 전역 키보드 이벤트 리스너 관리
*/ // ------------------------------

import { useEffect } from 'react';
import { Position, CellType } from '@/types/facility-editor';

// #region 타입 정의
interface KeyboardShortcutHandlers {
	onUndo: () => void;
	onRedo: () => void;
	onDelete: () => void;
	onSetSelectedCellsType: (type: CellType) => void;
	onNavigate: (dx: number, dy: number, extend: boolean) => void;
}

interface UseKeyboardShortcutsProps {
	isModalOpen: boolean;
	selectedCells: Position[];
	handlers: KeyboardShortcutHandlers;
}
// #endregion

// #region 메인 훅
export const useKeyboardShortcuts = ({
	isModalOpen,
	selectedCells,
	handlers,
}: UseKeyboardShortcutsProps) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// 모달이 열려있거나 입력 필드에 포커스가 있으면 단축키 무시
			if (
				isModalOpen ||
				document.activeElement?.tagName === 'INPUT' ||
				document.activeElement?.tagName === 'TEXTAREA'
			) {
				return;
			}

			// Ctrl 키 조합
			if (e.ctrlKey) {
				switch (e.key) {
					case 'z':
						if (e.shiftKey) {
							// Ctrl+Shift+Z: 다시실행
							e.preventDefault();
							handlers.onRedo();
						} else {
							// Ctrl+Z: 실행취소
							e.preventDefault();
							handlers.onUndo();
						}
						break;
					default:
						break;
				}
				return;
			}

			// 일반 키
			switch (e.key) {
				case 'ArrowUp':
					e.preventDefault();
					handlers.onNavigate(0, -1, e.shiftKey);
					break;

				case 'ArrowDown':
					e.preventDefault();
					handlers.onNavigate(0, 1, e.shiftKey);
					break;

				case 'ArrowLeft':
					e.preventDefault();
					handlers.onNavigate(-1, 0, e.shiftKey);
					break;

				case 'ArrowRight':
					e.preventDefault();
					handlers.onNavigate(1, 0, e.shiftKey);
					break;

				case 'Delete':
				case 'Backspace':
					// 선택된 셀이 있을 때만 삭제
					if (selectedCells.length > 0) {
						e.preventDefault();
						handlers.onDelete();
					}
					break;

				case '1':
					// 선택된 셀들을 좌석으로 변경
					if (selectedCells.length > 0) {
						e.preventDefault();
						handlers.onSetSelectedCellsType('seat');
					}
					break;

				case '2':
					// 선택된 셀들을 사물로 변경
					if (selectedCells.length > 0) {
						e.preventDefault();
						handlers.onSetSelectedCellsType('object');
					}
					break;

				case '3':
					// 선택된 셀들을 빈 공간으로 변경
					if (selectedCells.length > 0) {
						e.preventDefault();
						handlers.onSetSelectedCellsType('empty');
					}
					break;

				default:
					break;
			}
		};

		// 키보드 이벤트 리스너 등록
		window.addEventListener('keydown', handleKeyDown);

		// 정리 함수
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isModalOpen, selectedCells, handlers]);
};
// #endregion

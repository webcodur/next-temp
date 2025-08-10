import { useState, useCallback } from 'react';

interface UseContentModalReturn {
	isOpen: boolean;
	content: string | null;
	openModal: (content: string) => void;
	closeModal: () => void;
	setContent: (content: string | null) => void;
}

export const useContentModal = (): UseContentModalReturn => {
	// #region 상태
	const [content, setContent] = useState<string | null>(null);
	// #endregion

	// #region 핸들러
	const openModal = useCallback((newContent: string) => {
		setContent(newContent);
	}, []);

	const closeModal = useCallback(() => {
		setContent(null);
	}, []);
	// #endregion

	// #region 계산된 값
	const isOpen = content !== null;
	// #endregion

	return {
		isOpen,
		content,
		openModal,
		closeModal,
		setContent,
	};
};

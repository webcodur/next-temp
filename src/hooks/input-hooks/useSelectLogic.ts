import { useState, useRef, useEffect, useCallback } from 'react';

// 기본 Option 타입 정의
interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

export const useSelectLogic = (
	options: Option[],
	value: string | undefined,
	onChange: ((value: string) => void) | undefined
) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const containerRef = useRef<HTMLDivElement>(null);
	const selectedOption = options.find((option) => option.value === value);

	const handleOptionSelect = useCallback(
		(option: Option) => {
			if (option.disabled) return;
			onChange?.(option.value);
			setIsOpen(false);
		},
		[onChange]
	);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isOpen) return;

			const keyActionMap: Record<string, () => void> = {
				ArrowDown: () =>
					setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1)),
				ArrowUp: () => setHighlightedIndex((prev) => Math.max(prev - 1, 0)),
				Enter: () => {
					if (highlightedIndex >= 0)
						handleOptionSelect(options[highlightedIndex]);
				},
				Escape: () => setIsOpen(false),
			};

			if (keyActionMap[event.key]) {
				event.preventDefault();
				keyActionMap[event.key]();
			}
		};

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;

			// 컨테이너 내부 클릭 체크
			if (containerRef.current && containerRef.current.contains(target)) {
				return;
			}

			// Portal 내부 클릭 체크 (dropdown이 Portal로 렌더링됨)
			const portalRoot = document.getElementById('portal-root');
			if (portalRoot && portalRoot.contains(target)) {
				return;
			}

			// 외부 클릭으로 판단하여 닫기
			setIsOpen(false);
		};

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, highlightedIndex, options.length, handleOptionSelect, options]);

	useEffect(() => {
		if (!isOpen) setHighlightedIndex(-1);
	}, [isOpen]);

	return {
		isOpen,
		setIsOpen,
		highlightedIndex,
		containerRef,
		selectedOption,
		handleOptionSelect,
	};
};

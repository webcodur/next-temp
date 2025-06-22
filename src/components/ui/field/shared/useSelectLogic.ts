import { useState, useRef, useEffect, useCallback } from 'react';
import { Option } from '../core/types';

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
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
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

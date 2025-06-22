'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
	Option,
	SortDirection,
	FieldSelectComponentProps,
	FieldSortSelectComponentProps,
} from './types';
import { STYLES } from './styles';
import { ListHighlightMarker } from '@/components/ui/list-highlight-marker';

//#region Sort Direction Toggle
const SortDirectionToggle: React.FC<{
	direction: SortDirection;
	onDirectionChange: (direction: SortDirection) => void;
	disabled?: boolean;
}> = ({ direction, onDirectionChange, disabled = false }) => {
	const isAsc = direction === 'asc';

	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				if (!disabled) {
					onDirectionChange(isAsc ? 'desc' : 'asc');
				}
			}}
			disabled={disabled}
			title={isAsc ? '내림차순으로 변경' : '오름차순으로 변경'}
			className={`${STYLES.button} w-5 h-5 flex-shrink-0`}>
			{isAsc ? (
				<ArrowUp className="w-3 h-3" />
			) : (
				<ArrowDown className="w-3 h-3" />
			)}
		</button>
	);
};
//#endregion

//#region Select Logic Hook
const useSelectLogic = (
	options: Option[],
	value: string | undefined,
	onChange: ((value: string) => void) | undefined
) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [hoveredIndex, setHoveredIndex] = useState(-1);

	const selectRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((option) => option.value === value);

	const handleOptionSelect = useCallback(
		(option: Option) => {
			if (option.disabled) return;
			onChange?.(option.value);
			setIsOpen(false);
			setHighlightedIndex(-1);
			setHoveredIndex(-1);
		},
		[onChange]
	);

	useEffect(() => {
		const closeDropdown = () => {
			setIsOpen(false);
			setHighlightedIndex(-1);
			setHoveredIndex(-1);
		};

		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				closeDropdown();
			}
		};

		const handleKeyDown = (event: Event) => {
			const keyEvent = event as globalThis.KeyboardEvent;
			if (!isOpen) return;

			switch (keyEvent.key) {
				case 'ArrowDown':
					keyEvent.preventDefault();
					setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
					break;
				case 'ArrowUp':
					keyEvent.preventDefault();
					setHighlightedIndex((prev) => Math.max(prev - 1, 0));
					break;
				case 'Enter':
					keyEvent.preventDefault();
					if (highlightedIndex >= 0 && options[highlightedIndex]) {
						handleOptionSelect(options[highlightedIndex]);
					}
					break;
				case 'Escape':
					closeDropdown();
					break;
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, highlightedIndex, options, handleOptionSelect]);

	return {
		isOpen,
		setIsOpen,
		highlightedIndex,
		setHighlightedIndex,
		hoveredIndex,
		setHoveredIndex,
		selectRef,
		selectedOption,
		handleOptionSelect,
	};
};
//#endregion

//#region Select Dropdown
const SelectDropdown: React.FC<{
	isOpen: boolean;
	options: Option[];
	selectedValue?: string;
	highlightedIndex: number;
	hoveredIndex: number;
	setHoveredIndex: (index: number) => void;
	handleOptionSelect: (option: Option) => void;
	maxHeight: number;
}> = ({
	isOpen,
	options,
	selectedValue,
	highlightedIndex,
	hoveredIndex,
	setHoveredIndex,
	handleOptionSelect,
	maxHeight,
}) => {
	if (!isOpen) return null;

	return (
		<div className="absolute z-50 top-full left-0 right-0 mt-1">
			<div
				className={`${STYLES.dropdown} border border-gray-200 rounded-lg shadow-lg overflow-hidden`}
				style={{ maxHeight: `${maxHeight}px` }}>
				<div className="overflow-y-auto">
					{options.map((option, index) => {
						const isSelected = selectedValue === option.value;
						const isHighlighted = index === highlightedIndex;
						const isHovered = index === hoveredIndex;

						return (
							<ListHighlightMarker
								key={option.value}
								index={index}
								totalCount={options.length}
								isSelected={isSelected}
								isHighlighted={isHighlighted || isHovered}
								disabled={option.disabled}
								onClick={() => handleOptionSelect(option)}
								onMouseEnter={() => setHoveredIndex(index)}
								className="px-3 py-2 cursor-pointer transition-colors duration-150">
								<span className={option.disabled ? 'text-gray-400' : ''}>
									{option.label}
								</span>
							</ListHighlightMarker>
						);
					})}
				</div>
			</div>
		</div>
	);
};
//#endregion

//#region FieldSelect
export const FieldSelect: React.FC<FieldSelectComponentProps> = ({
	label,
	placeholder = '선택하세요',
	value,
	onChange,
	options,
	disabled = false,
	className = '',
	maxHeight = 200,
}) => {
	const {
		isOpen,
		setIsOpen,
		highlightedIndex,
		hoveredIndex,
		setHoveredIndex,
		selectRef,
		selectedOption,
		handleOptionSelect,
	} = useSelectLogic(options, value, onChange);

	return (
		<div className={`space-y-2 ${className}`}>
			{label && (
				<label className="block text-sm font-medium text-gray-700">
					{label}
				</label>
			)}
			<div ref={selectRef} className="relative">
				<button
					type="button"
					className={`${STYLES.input} w-full flex items-center justify-between ${
						disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
					}`}
					onClick={() => !disabled && setIsOpen(!isOpen)}
					disabled={disabled}
					aria-expanded={isOpen}
					aria-haspopup="listbox">
					<span className={selectedOption ? '' : 'text-gray-500'}>
						{selectedOption?.label || placeholder}
					</span>
					<ChevronDown
						className={`w-4 h-4 transition-transform duration-200 ${
							isOpen ? 'rotate-180' : ''
						}`}
					/>
				</button>

				<SelectDropdown
					isOpen={isOpen}
					options={options}
					selectedValue={value}
					highlightedIndex={highlightedIndex}
					hoveredIndex={hoveredIndex}
					setHoveredIndex={setHoveredIndex}
					handleOptionSelect={handleOptionSelect}
					maxHeight={maxHeight}
				/>
			</div>
		</div>
	);
};
//#endregion

//#region FieldSortSelect
export const FieldSortSelect: React.FC<FieldSortSelectComponentProps> = ({
	label,
	placeholder = '정렬 기준 선택',
	value,
	onChange,
	options,
	disabled = false,
	className = '',
	maxHeight = 200,
	sortDirection = 'asc',
	onSortDirectionChange,
}) => {
	const {
		isOpen,
		setIsOpen,
		highlightedIndex,
		hoveredIndex,
		setHoveredIndex,
		selectRef,
		selectedOption,
		handleOptionSelect,
	} = useSelectLogic(options, value, onChange);

	return (
		<div className={`space-y-2 ${className}`}>
			{label && (
				<label className="block text-sm font-medium text-gray-700">
					{label}
				</label>
			)}
			<div ref={selectRef} className="relative">
				<button
					type="button"
					className={`${STYLES.input} w-full flex items-center justify-between ${
						disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
					}`}
					onClick={() => !disabled && setIsOpen(!isOpen)}
					disabled={disabled}
					aria-expanded={isOpen}
					aria-haspopup="listbox">
					<span className={selectedOption ? '' : 'text-gray-500'}>
						{selectedOption?.label || placeholder}
					</span>
					<div className="flex items-center gap-1">
						{onSortDirectionChange && (
							<SortDirectionToggle
								direction={sortDirection}
								onDirectionChange={onSortDirectionChange}
								disabled={disabled}
							/>
						)}
						<ChevronDown
							className={`w-4 h-4 transition-transform duration-200 ${
								isOpen ? 'rotate-180' : ''
							}`}
						/>
					</div>
				</button>

				<SelectDropdown
					isOpen={isOpen}
					options={options}
					selectedValue={value}
					highlightedIndex={highlightedIndex}
					hoveredIndex={hoveredIndex}
					setHoveredIndex={setHoveredIndex}
					handleOptionSelect={handleOptionSelect}
					maxHeight={maxHeight}
				/>
			</div>
		</div>
	);
};
//#endregion

'use client';

import React, {
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback,
} from 'react';
import { X, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import {
	Option,
	FieldMultiSelectComponentProps,
	FieldFilterSelectComponentProps,
	FieldSortSelectComponentProps,
} from './types';
import { STYLES } from './styles';

//#region Select Logic Hook
const useSelectLogic = (
	options: Option[],
	multiple: boolean,
	value: string | string[] | undefined,
	onChange: ((value: string) => void) | ((value: string[]) => void) | undefined
) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [hoveredIndex, setHoveredIndex] = useState(-1);
	const [inputValue, setInputValue] = useState('');

	const selectRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const filteredOptions = useMemo(
		() =>
			!inputValue
				? options
				: options.filter((option) =>
						option.label.toLowerCase().includes(inputValue.toLowerCase())
					),
		[options, inputValue]
	);

	const selectedValues = multiple
		? (value as string[]) || []
		: value
			? [value as string]
			: [];
	const selectedOptions = options.filter((option) =>
		selectedValues.includes(option.value)
	);

	const handleOptionSelect = useCallback(
		(option: Option) => {
			if (option.disabled) return;

			if (multiple) {
				const currentValues = (value as string[]) || [];
				const newValues = currentValues.includes(option.value)
					? currentValues.filter((v) => v !== option.value)
					: [...currentValues, option.value];
				(onChange as (value: string[]) => void)?.(newValues);
			} else {
				(onChange as (value: string) => void)?.(option.value);
				setInputValue(option.label);
				setIsOpen(false);
				setHighlightedIndex(-1);
				setHoveredIndex(-1);
			}
		},
		[multiple, value, onChange]
	);

	useEffect(() => {
		if (!multiple) {
			const selected = options.find((option) => option.value === value);
			setInputValue(isOpen ? inputValue : selected?.label || '');
		}
	}, [value, options, multiple, isOpen, inputValue]);

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
				if (!multiple) {
					const selected = options.find((option) => option.value === value);
					setInputValue(selected?.label || '');
				}
			}
		};

		const handleKeyDown = (event: Event) => {
			const keyEvent = event as globalThis.KeyboardEvent;
			if (!isOpen) return;

			switch (keyEvent.key) {
				case 'ArrowDown':
					keyEvent.preventDefault();
					setHighlightedIndex((prev) =>
						Math.min(prev + 1, filteredOptions.length - 1)
					);
					break;
				case 'ArrowUp':
					keyEvent.preventDefault();
					setHighlightedIndex((prev) => Math.max(prev - 1, 0));
					break;
				case 'Enter':
					keyEvent.preventDefault();
					const targetOption =
						filteredOptions[highlightedIndex] ||
						(filteredOptions.length === 1 ? filteredOptions[0] : null);
					if (targetOption) handleOptionSelect(targetOption);
					break;
				case 'Escape':
					closeDropdown();
					break;
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [
		isOpen,
		highlightedIndex,
		filteredOptions,
		multiple,
		value,
		options,
		handleOptionSelect,
	]);

	return {
		isOpen,
		setIsOpen,
		highlightedIndex,
		hoveredIndex,
		setHoveredIndex,
		inputValue,
		setInputValue,
		selectRef,
		inputRef,
		filteredOptions,
		selectedValues,
		selectedOptions,
		handleOptionSelect,
	};
};
//#endregion

//#region Select Dropdown
const SelectDropdown: React.FC<{
	isOpen: boolean;
	filteredOptions: Option[];
	selectedValues: string[];
	highlightedIndex: number;
	hoveredIndex: number;
	setHoveredIndex: (index: number) => void;
	handleOptionSelect: (option: Option) => void;
	maxHeight: number;
	multiple: boolean;
}> = ({
	isOpen,
	filteredOptions,
	selectedValues,
	highlightedIndex,
	hoveredIndex,
	setHoveredIndex,
	handleOptionSelect,
	maxHeight,
	multiple,
}) => {
	if (!isOpen) return null;

	return (
		<div className={STYLES.dropdown} style={{ maxHeight }}>
			<div className="overflow-auto" style={{ maxHeight }}>
				{filteredOptions.length === 0 ? (
					<div className="px-3 py-1.5 font-medium text-center text-gray-500 text-sm">
						검색 결과가 없습니다
					</div>
				) : (
					filteredOptions.map((option, index) => {
						const isSelected = selectedValues.includes(option.value);
						const isHighlighted = index === highlightedIndex;
						const isHovered = index === hoveredIndex;
						const isActive = isHighlighted || isHovered || isSelected;

						return (
							<div
								key={option.value}
								className={`${STYLES.option} ${
									option.disabled
										? 'text-gray-400 cursor-not-allowed opacity-50'
										: isActive
											? 'bg-white text-gray-700 shadow-sm'
											: 'text-gray-700 hover:bg-gray-100'
								}`}
								onClick={() => handleOptionSelect(option)}
								onMouseEnter={() => setHoveredIndex(index)}
								onMouseLeave={() => setHoveredIndex(-1)}>
								<span className="truncate">{option.label}</span>
								{isSelected && multiple && (
									<div className="flex items-center justify-center w-5 h-5 text-xs font-bold text-gray-600 bg-gray-200 rounded-full">
										✓
									</div>
								)}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};
//#endregion

//#region Multi Select
export const FieldMultiSelect: React.FC<FieldMultiSelectComponentProps> = ({
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
		inputValue,
		setInputValue,
		selectRef,
		inputRef,
		filteredOptions,
		selectedValues,
		selectedOptions,
		handleOptionSelect,
	} = useSelectLogic(options, true, value, onChange);

	const Tag = ({
		option,
		onRemove,
	}: {
		option: Option;
		onRemove: () => void;
	}) => (
		<span className={STYLES.tag}>
			<span className="truncate max-w-[60px]">{option.label}</span>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
				className={`${STYLES.button} w-4 h-4`}>
				<X className="w-2.5 h-2.5" />
			</button>
		</span>
	);

	return (
		<div className={`relative ${className}`} ref={selectRef}>
			<div className={`flex items-start justify-between ${STYLES.fieldHeaderHeight}`}>
				{label && (
					<label className="text-sm font-medium text-gray-700 leading-6">
						{label}
					</label>
				)}
				{selectedOptions.length > 0 && (
					<div className="flex flex-wrap gap-1 max-w-[60%]">
						{selectedOptions.slice(0, 2).map((option) => (
							<Tag
								key={option.value}
								option={option}
								onRemove={() => {
									const newValues = (value || []).filter(
										(v) => v !== option.value
									);
									onChange?.(newValues);
								}}
							/>
						))}
						{selectedOptions.length > 2 && (
							<span className="px-1.5 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md flex items-center justify-center">
								+{selectedOptions.length - 2}
							</span>
						)}
					</div>
				)}
			</div>

			<div
				className={`relative flex items-center py-2 h-8 pl-10 pr-4 ${STYLES.container} ${
					disabled ? 'opacity-60 cursor-not-allowed' : ''
				}`}
				onClick={() => !disabled && inputRef.current?.focus()}
				tabIndex={-1}>
				<div className="absolute transform -translate-y-1/2 left-3 top-1/2">
					<Filter className="w-4 h-4 text-gray-500" />
				</div>

				<div className="flex items-center flex-1 min-w-0">
					<input
						ref={inputRef}
						type="text"
						value={inputValue}
						onChange={(e) => {
							setInputValue(e.target.value);
						}}
						onFocus={() => setIsOpen(true)}
						placeholder={
							selectedOptions.length > 0 ? '추가 검색...' : placeholder
						}
						disabled={disabled}
						className="flex-1 min-w-0 text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none focus:ring-0"
						style={{ minWidth: '100px' }}
					/>
				</div>
			</div>

			<div className="relative">
				<SelectDropdown
					isOpen={isOpen}
					filteredOptions={filteredOptions}
					selectedValues={selectedValues}
					highlightedIndex={highlightedIndex}
					hoveredIndex={hoveredIndex}
					setHoveredIndex={setHoveredIndex}
					handleOptionSelect={handleOptionSelect}
					maxHeight={maxHeight}
					multiple={true}
				/>
			</div>
		</div>
	);
};
//#endregion

//#region Filter Select
export const FieldFilterSelect: React.FC<FieldFilterSelectComponentProps> = ({
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
		inputValue,
		setInputValue,
		selectRef,
		inputRef,
		filteredOptions,
		selectedValues,
		selectedOptions,
		handleOptionSelect,
	} = useSelectLogic(options, false, value, onChange);

	return (
		<div className={`relative ${className}`} ref={selectRef}>
			<div className={`flex items-center justify-between ${STYLES.fieldHeaderHeight}`}>
				{label && (
					<label className="text-sm font-medium text-gray-700 leading-6">
						{label}
					</label>
				)}
			</div>

			<div
				className={`relative flex items-center py-2 h-8 pl-10 pr-4 ${STYLES.container} ${
					disabled ? 'opacity-60 cursor-not-allowed' : ''
				}`}
				onClick={() => !disabled && inputRef.current?.focus()}
				tabIndex={-1}>
				<div className="absolute transform -translate-y-1/2 left-3 top-1/2">
					<Filter className="w-4 h-4 text-gray-500" />
				</div>

				<div className="flex items-center flex-1 min-w-0">
					<input
						ref={inputRef}
						type="text"
						value={inputValue}
						onChange={(e) => {
							setInputValue(e.target.value);
							if (!e.target.value) onChange?.('');
						}}
						onFocus={() => setIsOpen(true)}
						placeholder={placeholder}
						disabled={disabled}
						className="flex-1 min-w-0 font-medium text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none focus:ring-0"
						style={{ minWidth: '100px' }}
					/>
				</div>

				{selectedOptions.length > 0 && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							onChange?.('');
							setInputValue('');
						}}
						className={`${STYLES.button} w-5 h-5 ml-2 flex-shrink-0`}>
						<X className="w-3 h-3" />
					</button>
				)}
			</div>

			<div className="relative">
				<SelectDropdown
					isOpen={isOpen}
					filteredOptions={filteredOptions}
					selectedValues={selectedValues}
					highlightedIndex={highlightedIndex}
					hoveredIndex={hoveredIndex}
					setHoveredIndex={setHoveredIndex}
					handleOptionSelect={handleOptionSelect}
					maxHeight={maxHeight}
					multiple={false}
				/>
			</div>
		</div>
	);
};
//#endregion

//#region Sort Select
export const FieldSortSelect: React.FC<FieldSortSelectComponentProps> = ({
	label,
	placeholder = '정렬 기준 선택',
	value,
	onChange,
	options,
	disabled = false,
	className = '',
	maxHeight = 200,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [hoveredIndex, setHoveredIndex] = useState(-1);
	const selectRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((option) => option.value === value);

	const handleOptionSelect = useCallback((option: Option) => {
		if (option.disabled) return;
		onChange?.(option.value);
		setIsOpen(false);
		setHighlightedIndex(-1);
		setHoveredIndex(-1);
	}, [onChange]);

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
					const targetOption =
						options[highlightedIndex] ||
						(options.length === 1 ? options[0] : null);
					if (targetOption) handleOptionSelect(targetOption);
					break;
				case 'Escape':
					closeDropdown();
					break;
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, highlightedIndex, options, handleOptionSelect]);

	return (
		<div className={`relative ${className}`} ref={selectRef}>
			<div className={`flex items-center justify-between ${STYLES.fieldHeaderHeight}`}>
				{label && (
					<label className="text-sm font-medium text-gray-700 leading-6">
						{label}
					</label>
				)}
			</div>

			<div
				className={`relative flex items-center justify-between py-2 h-8 pl-10 pr-4 cursor-pointer ${STYLES.container} ${
					disabled ? 'opacity-60 cursor-not-allowed' : ''
				}`}
				onClick={() => !disabled && setIsOpen(!isOpen)}
				tabIndex={0}>
				<div className="absolute transform -translate-y-1/2 left-3 top-1/2">
					<ArrowUpDown className="w-4 h-4 text-gray-500" />
				</div>

				<span
					className={`flex-1 ${
						selectedOption ? 'text-gray-800' : 'text-gray-500'
					} font-medium truncate`}>
					{selectedOption?.label || placeholder}
				</span>

				<ChevronDown
					className={`w-4 h-4 text-gray-500 transition-transform ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</div>

			<div className="relative">
				{isOpen && (
					<div className={STYLES.dropdown} style={{ maxHeight }}>
						<div className="overflow-auto" style={{ maxHeight }}>
							{options.map((option, index) => {
								const isSelected = option.value === value;
								const isHighlighted = index === highlightedIndex;
								const isHovered = index === hoveredIndex;
								const isActive = isHighlighted || isHovered || isSelected;

								return (
									<div
										key={option.value}
										className={`${STYLES.option} ${
											option.disabled
												? 'text-gray-400 cursor-not-allowed opacity-50'
												: isActive
													? 'bg-white text-gray-700 shadow-sm'
													: 'text-gray-700 hover:bg-gray-100'
										}`}
										onClick={() => handleOptionSelect(option)}
										onMouseEnter={() => setHoveredIndex(index)}
										onMouseLeave={() => setHoveredIndex(-1)}>
										<span className="truncate">{option.label}</span>
										{isSelected && (
											<div className="flex items-center justify-center w-5 h-5 text-xs font-bold text-gray-600 bg-gray-200 rounded-full">
												✓
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
//#endregion 
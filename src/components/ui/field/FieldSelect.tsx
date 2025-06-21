'use client';

import React, {
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback,
} from 'react';
import { X, Filter, ArrowUpDown, ChevronDown, Edit, List, ArrowUp, ArrowDown } from 'lucide-react';
import {
	Option,
	SelectMode,
	SortDirection,
	FieldMultiSelectComponentProps,
	FieldFilterSelectComponentProps,
	FieldSortSelectComponentProps,
} from './types';
import { STYLES } from './styles';
import { ListHighlightMarker } from '@/components/ui/list-highlight-marker';

//#region Mode Toggle Indicator
const ModeToggleIndicator: React.FC<{
	mode: SelectMode;
	onModeChange: (mode: SelectMode) => void;
	disabled?: boolean;
}> = ({ mode, onModeChange, disabled = false }) => {
	const isDropdown = mode === 'dropdown';
	
	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				if (!disabled) {
					onModeChange(isDropdown ? 'combobox' : 'dropdown');
				}
			}}
			disabled={disabled}
			title={isDropdown ? '콤보박스로 전환 (검색 모드)' : '드롭다운으로 전환 (선택 모드)'}
			className={`${STYLES.button} w-5 h-5 flex-shrink-0`}>
			{isDropdown ? (
				<List className="w-3 h-3" />  // 드롭다운 = 리스트 아이콘
			) : (
				<Edit className="w-3 h-3" />  // 콤보박스 = 연필 아이콘
			)}
		</button>
	);
};
//#endregion

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
				<ArrowUp className="w-3 h-3" />  // 오름차순 = 위쪽 화살표
			) : (
				<ArrowDown className="w-3 h-3" />  // 내림차순 = 아래쪽 화살표
			)}
		</button>
	);
};
//#endregion

//#region Select Logic Hook
const useSelectLogic = (
	options: Option[],
	multiple: boolean,
	value: string | string[] | undefined,
	onChange: ((value: string) => void) | ((value: string[]) => void) | undefined,
	mode: SelectMode = 'dropdown'
) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [hoveredIndex, setHoveredIndex] = useState(-1);
	const [inputValue, setInputValue] = useState('');

	const selectRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const filteredOptions = useMemo(
		() => {
			// 드롭다운 모드에서는 항상 전체 옵션 표시
			if (mode === 'dropdown') {
				return options;
			}
			// 콤보박스 모드에서만 입력값에 따른 필터링 적용
			return !inputValue
				? options
				: options.filter((option) =>
						option.label.toLowerCase().includes(inputValue.toLowerCase())
					);
		},
		[options, inputValue, mode]
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
			// 드롭다운 모드에서는 항상 선택된 값으로 설정, 콤보박스 모드에서만 입력값 유지
			if (mode === 'dropdown') {
				setInputValue(selected?.label || '');
			} else {
				setInputValue(isOpen ? inputValue : selected?.label || '');
			}
		}
	}, [value, options, multiple, isOpen, inputValue, mode]);

	// 모드 변경 시 inputValue 초기화
	useEffect(() => {
		if (mode === 'dropdown') {
			const selected = options.find((option) => option.value === value);
			setInputValue(selected?.label || '');
		}
	}, [mode, value, options]);

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
					<div className="px-3 py-1.5 text-center text-gray-500 text-sm">
						검색 결과가 없습니다
					</div>
				) : (
					filteredOptions.map((option, index) => {
						const isSelected = selectedValues.includes(option.value);
						const isHighlighted = index === highlightedIndex;
						const isHovered = index === hoveredIndex;

						return (
							<ListHighlightMarker
								key={option.value}
								index={index}
								totalCount={filteredOptions.length}
								isSelected={isSelected}
								isHighlighted={isHighlighted}
								isHovered={isHovered}
								disabled={option.disabled}
								onClick={() => handleOptionSelect(option)}
								onMouseEnter={() => setHoveredIndex(index)}
								onMouseLeave={() => setHoveredIndex(-1)}>
								<div className="flex items-center justify-between w-full">
									<span className="truncate">{option.label}</span>
									{isSelected && multiple && (
										<div className="flex justify-center items-center w-5 h-5 text-xs font-bold text-gray-600 bg-gray-200 rounded-full ml-2">
											✓
										</div>
									)}
								</div>
							</ListHighlightMarker>
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
	mode = 'dropdown',
	onModeChange,
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
	} = useSelectLogic(options, true, value, onChange, mode);

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
					<label className="text-sm font-medium leading-6 text-gray-700">
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
				<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
					<Filter className="w-4 h-4 text-gray-500" />
				</div>

				<div className="flex flex-1 items-center min-w-0">
					{mode === 'combobox' ? (
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
							spellCheck={false}
							autoComplete="off"
							className="flex-1 min-w-0 placeholder-gray-400 text-gray-800 bg-transparent focus:outline-none focus:ring-0"
							style={{ minWidth: '100px' }}
						/>
					) : (
						<span
							className={`flex-1 ${
								selectedOptions.length > 0 ? 'text-gray-800' : 'text-gray-500'
							} truncate cursor-pointer`}
							onClick={() => !disabled && setIsOpen(!isOpen)}>
							{selectedOptions.length > 0 
								? `${selectedOptions.length}개 선택됨`
								: placeholder
							}
						</span>
					)}
				</div>

				<div className="flex gap-1 items-center ml-2">
					{onModeChange && (
						<ModeToggleIndicator
							mode={mode}
							onModeChange={onModeChange}
							disabled={disabled}
						/>
					)}
					
					{mode === 'dropdown' ? (
						<button
							onClick={() => !disabled && setIsOpen(!isOpen)}
							disabled={disabled}
							className={`${STYLES.button} w-5 h-5 flex-shrink-0`}>
							<ChevronDown className="w-3 h-3" />
						</button>
					) : (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onChange?.([]);
								setInputValue('');
							}}
							disabled={selectedOptions.length === 0}
							className={`${STYLES.button} w-5 h-5 flex-shrink-0 ${
								selectedOptions.length === 0 ? 'opacity-40 cursor-not-allowed' : ''
							}`}>
							<X className="w-3 h-3" />
						</button>
					)}
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
	mode = 'dropdown',
	onModeChange,
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
	} = useSelectLogic(options, false, value, onChange, mode);

	return (
		<div className={`relative ${className}`} ref={selectRef}>
			<div className={`flex items-center justify-between ${STYLES.fieldHeaderHeight}`}>
				{label && (
					<label className="text-sm font-medium leading-6 text-gray-700">
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
				<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
					<Filter className="w-4 h-4 text-gray-500" />
				</div>

				<div className="flex flex-1 items-center min-w-0">
					{mode === 'combobox' ? (
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
							spellCheck={false}
							autoComplete="off"
							className="flex-1 min-w-0 placeholder-gray-400 text-gray-800 bg-transparent focus:outline-none focus:ring-0"
							style={{ minWidth: '100px' }}
						/>
					) : (
						<span
							className={`flex-1 ${
								selectedOptions[0] ? 'text-gray-800' : 'text-gray-500'
							} truncate cursor-pointer`}
							onClick={() => !disabled && setIsOpen(!isOpen)}>
							{selectedOptions[0]?.label || placeholder}
						</span>
					)}
				</div>

				<div className="flex gap-1 items-center ml-2">
					{onModeChange && (
						<ModeToggleIndicator
							mode={mode}
							onModeChange={onModeChange}
							disabled={disabled}
						/>
					)}
					
					{mode === 'dropdown' ? (
						<button
							onClick={() => !disabled && setIsOpen(!isOpen)}
							disabled={disabled}
							className={`${STYLES.button} w-5 h-5 flex-shrink-0`}>
							<ChevronDown className="w-3 h-3" />
						</button>
					) : (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onChange?.('');
								setInputValue('');
							}}
							disabled={selectedOptions.length === 0}
							className={`${STYLES.button} w-5 h-5 flex-shrink-0 ${
								selectedOptions.length === 0 ? 'opacity-40 cursor-not-allowed' : ''
							}`}>
							<X className="w-3 h-3" />
						</button>
					)}
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
	sortDirection = 'asc',
	onSortDirectionChange,
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
					<label className="text-sm font-medium leading-6 text-gray-700">
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
				<div className="absolute left-3 top-1/2 transform -translate-y-1/2">
					<ArrowUpDown className="w-4 h-4 text-gray-500" />
				</div>

				<div className="flex flex-1 items-center gap-2 min-w-0">
					<span
						className={`${
							selectedOption ? 'text-gray-800' : 'text-gray-500'
						} truncate cursor-pointer`}>
						{selectedOption?.label || placeholder}
					</span>
					{selectedOption && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								if (!disabled && onSortDirectionChange) {
									onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc');
								}
							}}
							disabled={disabled || !onSortDirectionChange}
							className={`text-xs text-gray-400 flex-shrink-0 hover:text-gray-600 transition-colors ${
								disabled || !onSortDirectionChange ? 'cursor-default' : 'cursor-pointer'
							}`}
							title="정렬 방향 변경">
							({sortDirection === 'asc' ? '오름차순' : '내림차순'})
						</button>
					)}
				</div>

				<div className="flex gap-1 items-center">
					{onSortDirectionChange && (
						<SortDirectionToggle
							direction={sortDirection}
							onDirectionChange={onSortDirectionChange}
							disabled={disabled}
						/>
					)}
					
					<button
						onClick={() => !disabled && setIsOpen(!isOpen)}
						disabled={disabled}
						className={`${STYLES.button} w-5 h-5 flex-shrink-0`}>
						<ChevronDown
							className={`w-3 h-3 transition-transform ${
								isOpen ? 'rotate-180' : ''}`}
						/>
					</button>
				</div>
			</div>

			<div className="relative">
				<SelectDropdown
					isOpen={isOpen}
					filteredOptions={options}
					selectedValues={value ? [value] : []}
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
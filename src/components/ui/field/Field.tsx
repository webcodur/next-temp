'use client';

import React, {
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback,
	ChangeEvent,
	KeyboardEvent,
} from 'react';
import { Search, X, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';

//#region Types & Interfaces
export interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

interface BaseFieldProps {
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

interface FieldTextProps extends BaseFieldProps {
	type: 'text';
	value: string;
	onChange: (value: string) => void;
	onEnterPress?: () => void;
	onClear?: () => void;
	inputType?: string;
	size?: 'sm' | 'md' | 'lg';
	showSearchIcon?: boolean;
	showClearButton?: boolean;
}

interface FieldMultiSelectProps extends BaseFieldProps {
	type: 'multi-select';
	value?: string[];
	onChange?: (value: string[]) => void;
	options: Option[];
	maxHeight?: number;
}

interface FieldFilterSelectProps extends BaseFieldProps {
	type: 'filter-select';
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
}

interface FieldSortSelectProps extends BaseFieldProps {
	type: 'sort-select';
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
}

type FieldProps =
	| FieldTextProps
	| FieldMultiSelectProps
	| FieldFilterSelectProps
	| FieldSortSelectProps;
//#endregion

//#region Styles
const STYLES = {
	container:
		'neu-flat bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:neu-inset transition-all duration-200',
	dropdown:
		'neu-raised absolute z-50 w-full mt-2 overflow-hidden bg-gray-50 rounded-2xl',
	option:
		'mx-2 my-0.5 px-4 py-2 rounded-xl cursor-pointer flex items-center justify-between font-medium',
	tag: 'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg',
	button:
		'flex items-center justify-center neu-raised rounded-full text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-0',
};
//#endregion

//#region Text Field Component
const FieldTextComponent: React.FC<FieldTextProps> = ({
	label,
	placeholder,
	value,
	onChange,
	onEnterPress,
	onClear,
	inputType = 'text',
	className = '',
	size = 'md',
	showSearchIcon = false,
	showClearButton = true,
	disabled = false,
}) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && onEnterPress) {
			onEnterPress();
		}
	};

	const handleClear = () => {
		onChange('');
		onClear?.();
	};

	const sizeStyles = {
		sm: 'px-3 py-2 text-sm h-8',
		md: 'px-4 py-2.5 text-sm h-10',
		lg: 'px-4 py-3 text-base h-11',
	};

	return (
		<div className="flex flex-col">
			{label && (
				<label className="mb-2 text-sm font-medium text-gray-700">
					{label}
				</label>
			)}
			<div className="relative">
				{showSearchIcon && (
					<Search className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
				)}

				<input
					type={inputType}
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					className={`
						w-full ${STYLES.container}
						text-gray-800 placeholder-gray-400 
						${sizeStyles[size]}
						${showSearchIcon ? 'pl-10' : ''}
						${showClearButton && value ? 'pr-10' : ''}
						${disabled ? 'opacity-60 cursor-not-allowed' : ''}
						${className}
					`}
				/>

				{showClearButton && value && (
					<button
						onClick={handleClear}
						className={`absolute flex items-center justify-center w-5 h-5 text-gray-500 transition-colors transform -translate-y-1/2 rounded-full right-3 top-1/2 ${STYLES.button}`}
						type="button">
						<X className="w-3 h-3" />
					</button>
				)}
			</div>
		</div>
	);
};
//#endregion

//#region Select Base Component
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
					<div className="px-4 py-6 font-medium text-center text-gray-500">
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
											? 'neu-inset text-gray-700 bg-white'
											: 'neu-raised text-gray-600'
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

//#region Multi Select Component
const FieldMultiSelectComponent: React.FC<FieldMultiSelectProps> = ({
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
			<span className="truncate max-w-[80px]">{option.label}</span>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
				className={`${STYLES.button} w-5 h-5`}>
				<X className="w-3 h-3" />
			</button>
		</span>
	);

	return (
		<div className={`relative ${className}`} ref={selectRef}>
			{label && (
				<label className="mb-2 text-sm font-medium text-gray-700">
					{label}
				</label>
			)}

			<div
				className={`relative flex items-center py-2.5 h-10 pl-10 pr-4 ${STYLES.container} ${
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
						className="flex-1 min-w-0 font-medium text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none focus:ring-0"
						style={{ minWidth: '100px' }}
					/>
				</div>
			</div>

			{selectedOptions.length > 0 && (
				<div className="flex flex-wrap gap-2 mt-3">
					{selectedOptions.map((option) => (
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
				</div>
			)}

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
	);
};
//#endregion

//#region Filter Select Component
const FieldFilterSelectComponent: React.FC<FieldFilterSelectProps> = ({
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
			{label && (
				<label className="mb-2 text-sm font-medium text-gray-700">
					{label}
				</label>
			)}

			<div
				className={`relative flex items-center py-2.5 h-10 pl-10 pr-4 ${STYLES.container} ${
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
	);
};
//#endregion

//#region Sort Select Component
const FieldSortSelectComponent: React.FC<FieldSortSelectProps> = ({
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

	const handleOptionSelect = (option: Option) => {
		if (option.disabled) return;
		onChange?.(option.value);
		setIsOpen(false);
		setHighlightedIndex(-1);
		setHoveredIndex(-1);
	};

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
	}, [isOpen, highlightedIndex, options]);

	return (
		<div className={`relative ${className}`} ref={selectRef}>
			{label && (
				<label className="mb-2 text-sm font-medium text-gray-700">
					{label}
				</label>
			)}

			<div
				className={`relative flex items-center justify-between py-2.5 h-10 pl-10 pr-4 cursor-pointer ${STYLES.container} ${
					disabled ? 'opacity-60 cursor-not-allowed' : ''
				}`}
				onClick={() => !disabled && setIsOpen(!isOpen)}
				tabIndex={0}>
				<div className="absolute transform -translate-y-1/2 left-3 top-1/2">
					<ArrowUpDown className="w-4 h-4 text-gray-500" />
				</div>

				<span
					className={`flex-1 ${
						selectedOption ? 'text-gray-800' : 'text-gray-400'
					} font-medium truncate`}>
					{selectedOption?.label || placeholder}
				</span>

				<ChevronDown
					className={`w-4 h-4 text-gray-500 transition-transform ${
						isOpen ? 'rotate-180' : ''
					}`}
				/>
			</div>

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
												? 'neu-inset text-gray-700 bg-white'
												: 'neu-raised text-gray-600'
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
	);
};
//#endregion

//#region Main Field Component
export const Field: React.FC<FieldProps> = (props) => {
	switch (props.type) {
		case 'text':
			return <FieldTextComponent {...props} />;
		case 'multi-select':
			return <FieldMultiSelectComponent {...props} />;
		case 'filter-select':
			return <FieldFilterSelectComponent {...props} />;
		case 'sort-select':
			return <FieldSortSelectComponent {...props} />;
		default:
			return null;
	}
};

// 개별 컴포넌트 export
export const FieldText: React.FC<Omit<FieldTextProps, 'type'>> = (props) => (
	<Field {...props} type="text" />
);

export const FieldMultiSelect: React.FC<Omit<FieldMultiSelectProps, 'type'>> = (
	props
) => <Field {...props} type="multi-select" />;

export const FieldFilterSelect: React.FC<
	Omit<FieldFilterSelectProps, 'type'>
> = (props) => <Field {...props} type="filter-select" />;

export const FieldSortSelect: React.FC<Omit<FieldSortSelectProps, 'type'>> = (
	props
) => <Field {...props} type="sort-select" />;
//#endregion

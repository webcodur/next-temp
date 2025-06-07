'use client';

import React, {
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback,
} from 'react';
import { X } from 'lucide-react';

export interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

interface SingleSelectProps {
	multiple?: false;
	value?: string;
	onChange?: (value: string) => void;
}

interface MultiSelectProps {
	multiple: true;
	value?: string[];
	onChange?: (value: string[]) => void;
}

type SelectProps = {
	label?: string;
	placeholder?: string;
	options: Option[];
	searchable?: boolean;
	disabled?: boolean;
	className?: string;
	maxHeight?: number;
} & (SingleSelectProps | MultiSelectProps);

// 공통 스타일 상수
const STYLES = {
	container: 'neu-flat bg-gray-50 rounded-2xl focus:outline-none focus:ring-0',
	dropdown:
		'neu-raised absolute z-50 w-full mt-2 overflow-hidden bg-gray-50 rounded-2xl',
	option:
		'mx-2 my-1 px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between font-medium',
	tag: 'neu-inset inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 bg-white rounded-lg',
	button:
		'neu-raised flex items-center justify-center rounded-full focus:outline-none focus:ring-0',
};

export const Select: React.FC<SelectProps> = ({
	label,
	placeholder = '선택하세요',
	options,
	searchable = false,
	disabled = false,
	className = '',
	maxHeight = 200,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const [hoveredIndex, setHoveredIndex] = useState(-1);
	const [inputValue, setInputValue] = useState('');

	const selectRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// 검색 필터링
	const filteredOptions = useMemo(
		() =>
			!searchable || !inputValue
				? options
				: options.filter((option) =>
						option.label.toLowerCase().includes(inputValue.toLowerCase())
					),
		[options, inputValue, searchable]
	);

	// props 구조 분해 (useCallback 최적화를 위해)
	const { multiple, value, onChange } = props;

	// 선택된 값들과 옵션들
	const selectedValues = multiple ? value || [] : value ? [value] : [];
	const selectedOptions = options.filter((option) =>
		selectedValues.includes(option.value)
	);

	// 옵션 선택 처리 (useEffect보다 먼저 선언)
	const handleOptionSelect = useCallback(
		(option: Option) => {
			if (option.disabled) return;

			if (multiple) {
				const currentValues = value || [];
				const newValues = currentValues.includes(option.value)
					? currentValues.filter((v) => v !== option.value)
					: [...currentValues, option.value];
				onChange?.(newValues);
			} else {
				onChange?.(option.value);
				if (searchable) setInputValue(option.label);
				setIsOpen(false);
				setHighlightedIndex(-1);
				setHoveredIndex(-1);
			}
		},
		[multiple, value, onChange, searchable]
	);

	// 입력값 동기화 (searchable 단일 선택)
	useEffect(() => {
		if (searchable && !multiple) {
			const selected = options.find((option) => option.value === value);
			setInputValue(isOpen ? inputValue : selected?.label || '');
		}
	}, [value, options, searchable, multiple, isOpen, inputValue]);

	// 외부 클릭과 키보드 이벤트 처리
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
				if (searchable && !multiple) {
					const selected = options.find((option) => option.value === value);
					setInputValue(selected?.label || '');
				}
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isOpen) return;

			switch (event.key) {
				case 'ArrowDown':
					event.preventDefault();
					setHighlightedIndex((prev) =>
						Math.min(prev + 1, filteredOptions.length - 1)
					);
					break;
				case 'ArrowUp':
					event.preventDefault();
					setHighlightedIndex((prev) => Math.max(prev - 1, 0));
					break;
				case 'Enter':
					event.preventDefault();
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
		searchable,
		multiple,
		value,
		options,
		handleOptionSelect,
	]);

	// 태그 컴포넌트
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
				className={`${STYLES.button} w-3 h-3`}>
				<X className="w-2 h-2" />
			</button>
		</span>
	);

	// 옵션 아이템 컴포넌트
	const OptionItem = ({ option, index }: { option: Option; index: number }) => {
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
	};

	return (
		<div className={`relative ${className}`} ref={selectRef}>
			{label && (
				<label className="block mb-3 text-sm font-medium text-gray-700">
					{label}
				</label>
			)}

			{/* 입력/선택 영역 */}
			<div
				className={`px-4 py-3 ${STYLES.container} ${
					disabled
						? 'opacity-60 cursor-not-allowed'
						: searchable
							? ''
							: 'cursor-pointer'
				}`}
				onClick={() =>
					!disabled &&
					(searchable ? inputRef.current?.focus() : setIsOpen(!isOpen))
				}
				tabIndex={searchable ? -1 : 0}>
				<div className="flex flex-wrap items-center flex-1 gap-1 max-h-[52px] overflow-hidden">
					{/* 다중 선택 태그들 */}
					{multiple && selectedOptions.length > 0 && (
						<div className="flex flex-wrap flex-1 min-w-0 gap-1">
							{selectedOptions.slice(0, 3).map((option) => (
								<Tag
									key={option.value}
									option={option}
									onRemove={() => {
										if (multiple) {
											const newValues = (value || []).filter(
												(v) => v !== option.value
											);
											onChange?.(newValues);
										}
									}}
								/>
							))}
							{selectedOptions.length > 3 && (
								<span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg">
									+{selectedOptions.length - 3}
								</span>
							)}
						</div>
					)}

					{/* 검색 입력 또는 선택된 값 표시 */}
					{searchable ? (
						<input
							ref={inputRef}
							type="text"
							value={inputValue}
							onChange={(e) => {
								setInputValue(e.target.value);
								if (!e.target.value && !multiple) onChange?.('');
							}}
							onFocus={() => setIsOpen(true)}
							placeholder={
								multiple && selectedOptions.length > 0
									? '추가 검색...'
									: placeholder
							}
							disabled={disabled}
							className="flex-1 min-w-0 font-medium text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none focus:ring-0"
							style={{ minWidth: '100px' }}
						/>
					) : (
						<span
							className={`${selectedOptions.length === 0 ? 'text-gray-400' : 'text-gray-700'} font-medium`}>
							{selectedOptions.length === 0
								? placeholder
								: multiple
									? selectedOptions.length === 1
										? selectedOptions[0].label
										: `${selectedOptions.length}개 선택됨`
									: selectedOptions[0].label}
						</span>
					)}
				</div>

				{/* X 버튼 (단일 선택 시) */}
				{!multiple && selectedOptions.length > 0 && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							onChange?.('');
							if (searchable) setInputValue('');
						}}
						className={`${STYLES.button} w-4 h-4`}>
						<X className="w-4 h-4 text-gray-500" />
					</button>
				)}
			</div>

			{/* 드롭다운 옵션 */}
			{isOpen && (
				<div className={STYLES.dropdown} style={{ maxHeight }}>
					<div className="overflow-auto" style={{ maxHeight }}>
						{filteredOptions.length === 0 ? (
							<div className="px-4 py-6 font-medium text-center text-gray-500">
								검색 결과가 없습니다
							</div>
						) : (
							filteredOptions.map((option, index) => (
								<OptionItem key={option.value} option={option} index={index} />
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

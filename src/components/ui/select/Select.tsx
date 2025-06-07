'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
	container:
		'bg-gray-50 rounded-2xl transition-all duration-200 ease-out focus:outline-none focus:ring-0',
	dropdown:
		'absolute z-50 w-full mt-2 overflow-hidden transition-all duration-200 bg-gray-50 rounded-2xl',
	option:
		'mx-2 my-1 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 flex items-center justify-between font-medium',
	tag: 'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 transition-all duration-200 bg-white rounded-lg',
	button:
		'flex items-center justify-center transition-all duration-200 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-0',
	boxShadow: {
		normal: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.9)',
		inset:
			'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.9)',
		disabled:
			'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.8)',
		dropdown:
			'6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.9)',
		tagInset:
			'inset 1px 1px 2px rgba(0,0,0,0.08), inset -1px -1px 2px rgba(255,255,255,0.9)',
		optionInset:
			'inset 2px 2px 4px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.9)',
	},
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

	// 선택된 값들과 옵션들
	const selectedValues = props.multiple
		? props.value || []
		: props.value
			? [props.value]
			: [];
	const selectedOptions = options.filter((option) =>
		selectedValues.includes(option.value)
	);

	// 입력값 동기화 (searchable 단일 선택)
	useEffect(() => {
		if (searchable && !props.multiple) {
			const selected = options.find((option) => option.value === props.value);
			setInputValue(isOpen ? inputValue : selected?.label || '');
		}
	}, [props.value, options, searchable, props.multiple, isOpen]);

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
				if (searchable && !props.multiple) {
					const selected = options.find(
						(option) => option.value === props.value
					);
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
		props.multiple,
		props.value,
		options,
	]);

	// 옵션 선택 처리
	const handleOptionSelect = (option: Option) => {
		if (option.disabled) return;

		if (props.multiple) {
			const currentValues = props.value || [];
			const newValues = currentValues.includes(option.value)
				? currentValues.filter((v) => v !== option.value)
				: [...currentValues, option.value];
			props.onChange?.(newValues);
		} else {
			props.onChange?.(option.value);
			if (searchable) setInputValue(option.label);
			setIsOpen(false);
			setHighlightedIndex(-1);
			setHoveredIndex(-1);
		}
	};

	// 공통 박스 스타일
	const getBoxShadow = (type: keyof typeof STYLES.boxShadow) => ({
		boxShadow: STYLES.boxShadow[type],
		outline: 'none',
	});

	// 태그 컴포넌트
	const Tag = ({
		option,
		onRemove,
	}: {
		option: Option;
		onRemove: () => void;
	}) => (
		<span className={STYLES.tag} style={getBoxShadow('tagInset')}>
			<span className="truncate max-w-[80px]">{option.label}</span>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onRemove();
				}}
				className={`${STYLES.button} w-3 h-3`}
				style={getBoxShadow('tagInset')}>
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
				className={`${STYLES.option} ${
					option.disabled
						? 'text-gray-400 cursor-not-allowed opacity-50'
						: isActive
							? 'text-gray-700 bg-white'
							: 'text-gray-600 hover:text-gray-700 hover:bg-white'
				}`}
				onClick={() => handleOptionSelect(option)}
				onMouseEnter={() => setHoveredIndex(index)}
				onMouseLeave={() => setHoveredIndex(-1)}
				style={isActive && !option.disabled ? getBoxShadow('optionInset') : {}}>
				<span>{option.label}</span>
				{isSelected && props.multiple && (
					<div
						className="flex items-center justify-center w-5 h-5 text-xs font-bold text-gray-600 rounded-full"
						style={getBoxShadow('tagInset')}>
						✓
					</div>
				)}
			</div>
		);
	};

	// 메인 렌더링
	return (
		<div className={`relative ${className}`} ref={selectRef}>
			{label && (
				<label className="block mb-3 text-sm font-medium text-gray-700">
					{label}
				</label>
			)}

			{/* 입력/선택 영역 */}
			<div
				className={`relative flex items-center min-h-[48px] px-4 py-3 ${STYLES.container} ${
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
				tabIndex={searchable ? -1 : 0}
				style={getBoxShadow(
					disabled ? 'disabled' : isOpen ? 'inset' : 'normal'
				)}>
				<div className="flex flex-wrap items-center flex-1 gap-1 max-h-[52px] overflow-hidden">
					{/* 다중 선택 태그들 */}
					{props.multiple && selectedOptions.length > 0 && (
						<div className="flex flex-wrap flex-1 min-w-0 gap-1">
							{selectedOptions.slice(0, 3).map((option) => (
								<Tag
									key={option.value}
									option={option}
									onRemove={() => {
										if (props.multiple) {
											const newValues = (props.value || []).filter(
												(v) => v !== option.value
											);
											props.onChange?.(newValues);
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

					{/* 검색 입력 필드 또는 표시 값 */}
					{searchable ? (
						<input
							ref={inputRef}
							type="text"
							value={inputValue}
							onChange={(e) => {
								setInputValue(e.target.value);
								setIsOpen(true);
								setHighlightedIndex(-1);
								if (!e.target.value && !props.multiple) props.onChange?.('');
							}}
							onFocus={() => setIsOpen(true)}
							placeholder={
								props.multiple && selectedOptions.length > 0
									? '추가 검색...'
									: placeholder
							}
							disabled={disabled}
							className="flex-1 min-w-0 font-medium text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none focus:ring-0"
							style={{ outline: 'none', boxShadow: 'none' }}
						/>
					) : (
						<span
							className={`${selectedOptions.length === 0 ? 'text-gray-400' : 'text-gray-700'} font-medium`}>
							{selectedOptions.length === 0
								? placeholder
								: props.multiple
									? selectedOptions.length === 1
										? selectedOptions[0].label
										: `${selectedOptions.length}개 선택됨`
									: selectedOptions[0]?.label}
						</span>
					)}
				</div>

				{/* X 버튼 (단일 선택 시) */}
				{!props.multiple && selectedOptions.length > 0 && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							props.onChange?.('');
							if (searchable) setInputValue('');
						}}
						className={`${STYLES.button} w-6 h-6 ml-2`}
						style={getBoxShadow('normal')}>
						<X className="w-4 h-4 text-gray-500" />
					</button>
				)}
			</div>

			{/* 드롭다운 옵션 */}
			{isOpen && (
				<div
					className={STYLES.dropdown}
					style={{ ...getBoxShadow('dropdown'), maxHeight }}>
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

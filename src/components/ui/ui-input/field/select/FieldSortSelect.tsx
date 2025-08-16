'use client';

import React, { useRef } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { FieldSortSelectComponentProps } from '../core/types';
import { FIELD_STYLES, FIELD_CONSTANTS } from '../core/config';
import { SelectDropdown } from './SelectDropdown';
import { useSelectLogic } from '../../../../../hooks/useSelectLogic';

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
	showAllOption = true,
	allOptionLabel = FIELD_CONSTANTS.DEFAULT_ALL_OPTION_LABEL,
	allOptionValue = FIELD_CONSTANTS.DEFAULT_ALL_OPTION_VALUE,
}) => {
	const inputRef = useRef<HTMLButtonElement>(null); // 내부 button ref 추가
	
	// "전체" 옵션 추가한 최종 옵션 리스트
	const finalOptions = showAllOption 
		? [{ value: allOptionValue, label: allOptionLabel }, ...options]
		: options;

	const {
		isOpen,
		setIsOpen,
		highlightedIndex,
		containerRef,
		selectedOption,
		handleOptionSelect,
	} = useSelectLogic(finalOptions, value, onChange);

	const handleSelect = (selectedValue: string) => {
		const option = finalOptions.find((opt) => opt.value === selectedValue);
		if (option) {
			handleOptionSelect(option);
		}
	};

	const handleSortToggle = (e: React.MouseEvent) => {
		e.stopPropagation();
		onSortDirectionChange?.(sortDirection === 'asc' ? 'desc' : 'asc');
	};

	const toggleDropdown = () => {
		if (!disabled) {
			setIsOpen(!isOpen);
		}
	};

	return (
		<div ref={containerRef} className={`${FIELD_STYLES.fieldWrapper} ${className}`}>
			{label && <label className={FIELD_STYLES.label}>{label}</label>}

			<div className="relative">
				<button
					type="button"
					onClick={handleSortToggle}
					disabled={disabled}
					className={`${FIELD_STYLES.sortIcon} ${disabled ? FIELD_STYLES.disabled : ''}`}>
											<ArrowUpDown className="w-4 h-4 neu-icon-active" />
				</button>

				<button
					ref={inputRef}
					type="button"
					onClick={toggleDropdown}
					disabled={disabled}
					className={`
						w-full text-start
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						ps-10 pe-10
						${disabled ? FIELD_STYLES.disabled : 'cursor-pointer'}
						${isOpen ? 'neu-flat-focus' : ''}
					`}>
					<span className="flex flex-1 items-center">
						<span className={`font-multilang ${selectedOption ? 'font-medium' : ''}`}>
							{selectedOption ? selectedOption.label : placeholder}
						</span>
						{selectedOption && (
							<span
								onClick={handleSortToggle}
								className="text-xs cursor-pointer ms-2 font-multilang text-muted-foreground">
								{sortDirection === 'asc' ? '오름차순' : '내림차순'}
							</span>
						)}
					</span>

					                                <ChevronDown
                                        className={`
                                                ${FIELD_STYLES.endIcon}
                                                								neu-icon-active
                                                
                                                ${isOpen ? 'rotate-180' : ''}
                                        `}
					/>
				</button>

				<SelectDropdown
					isOpen={isOpen}
					options={finalOptions}
					selectedValue={value}
					onSelect={handleSelect}
					highlightedIndex={highlightedIndex}
					maxHeight={maxHeight}
					triggerRef={inputRef as React.RefObject<HTMLElement>}
				/>
			</div>
		</div>
	);
};

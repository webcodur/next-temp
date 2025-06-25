'use client';

import React from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { FieldSortSelectComponentProps } from '../core/types';
import { FIELD_STYLES } from '../core/config';
import { SelectDropdown } from './SelectDropdown';
import { useSelectLogic } from '../shared/useSelectLogic';

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
		containerRef,
		selectedOption,
		handleOptionSelect,
	} = useSelectLogic(options, value, onChange);

	const handleSelect = (selectedValue: string) => {
		const option = options.find((opt) => opt.value === selectedValue);
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
		<div ref={containerRef} className={`relative space-y-1 ${className}`}>
			{label && <label className={FIELD_STYLES.label}>{label}</label>}

			<div className="relative">
				<button
					type="button"
					onClick={handleSortToggle}
					disabled={disabled}
					className={`${FIELD_STYLES.sortIcon} ${disabled ? FIELD_STYLES.disabled : ''} z-10`}>
					<ArrowUpDown className="h-4 w-4" />
				</button>

				<button
					type="button"
					onClick={toggleDropdown}
					disabled={disabled}
					className={`
						w-full text-left
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						pl-10 pr-10
						${disabled ? FIELD_STYLES.disabled : 'cursor-pointer'}
					`}>
					<span className="flex flex-1 items-center">
						<span className={selectedOption ? 'font-medium' : ''}>
							{selectedOption ? selectedOption.label : placeholder}
						</span>
						{selectedOption && (
							<span className="ml-2 text-xs text-gray-400">
								{sortDirection === 'asc' ? '오름차순' : '내림차순'}
							</span>
						)}
					</span>

					<ChevronDown
						className={`
							${FIELD_STYLES.rightIcon}
							transition-transform
							${isOpen ? 'rotate-180' : ''}
						`}
					/>
				</button>

				<SelectDropdown
					isOpen={isOpen}
					options={options}
					selectedValue={value}
					onSelect={handleSelect}
					highlightedIndex={highlightedIndex}
					maxHeight={maxHeight}
				/>
			</div>
		</div>
	);
};

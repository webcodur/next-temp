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
					<ArrowUpDown className="w-4 h-4 neu-icon-inactive hover:neu-icon-active" />
				</button>

				<button
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
								className="ms-2 text-xs transition-colors cursor-pointer font-multilang text-muted-foreground hover:text-foreground">
								{sortDirection === 'asc' ? '오름차순' : '내림차순'}
							</span>
						)}
					</span>

					                                <ChevronDown
                                        className={`
                                                ${FIELD_STYLES.endIcon}
                                                neu-icon-inactive hover:neu-icon-active
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

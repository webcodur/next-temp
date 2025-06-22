'use client';

import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { FieldSortSelectComponentProps } from '../core/types';
import { FIELD_STYLES } from '../core/config';
import { SelectDropdown } from './SelectDropdown';

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
	const selectedOption = options.find((option) => option.value === value);

	const handleSelect = (selectedValue: string) => {
		onChange?.(selectedValue);
		setIsOpen(false);
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
		<div className={`relative space-y-1 ${className}`}>
			{label && (
				<label className="block text-sm font-medium text-gray-800 mb-1">
					{label}
				</label>
			)}

			<div className="relative">
				<button
					type="button"
					onClick={handleSortToggle}
					disabled={disabled}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-60 z-10">
					<ArrowUpDown className="h-4 w-4" />
				</button>

				<button
					type="button"
					onClick={toggleDropdown}
					disabled={disabled}
					className={`
						w-full text-left
						${FIELD_STYLES.container}
						px-3 py-2 text-sm h-8
						pl-10 pr-10
						font-medium
						${selectedOption ? 'text-gray-800' : 'text-gray-700 placeholder-gray-700'}
						${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
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
							absolute right-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2 transition-transform duration-200
							${isOpen ? 'rotate-180' : ''}
						`}
					/>
				</button>

				<SelectDropdown
					isOpen={isOpen}
					options={options}
					selectedValue={value}
					onSelect={handleSelect}
					maxHeight={maxHeight}
				/>
			</div>
		</div>
	);
};

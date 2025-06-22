'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FieldSelectComponentProps } from '../core/types';
import { FIELD_STYLES } from '../core/config';
import { SelectDropdown } from './SelectDropdown';

export const FieldSelect: React.FC<FieldSelectComponentProps> = ({
	label,
	placeholder = '선택하세요',
	value,
	onChange,
	options,
	maxHeight = 200,
	leftIcon,
	disabled = false,
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const selectedOption = options.find((option) => option.value === value);

	const handleSelect = (selectedValue: string) => {
		onChange?.(selectedValue);
		setIsOpen(false);
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
					onClick={toggleDropdown}
					disabled={disabled}
					className={`
						w-full text-left
						${FIELD_STYLES.container}
						px-3 py-2 text-sm h-8
						${leftIcon ? 'pl-10' : 'pl-3'}
						pr-10
						font-medium
						${selectedOption ? 'text-gray-800' : 'text-gray-700 placeholder-gray-700'}
						${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
					`}>
					{leftIcon && (
						<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700">
							{leftIcon}
						</span>
					)}

					<span className="block truncate">
						{selectedOption ? selectedOption.label : placeholder}
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

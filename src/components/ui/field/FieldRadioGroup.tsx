'use client';

import React from 'react';
import { FieldRadioGroupComponentProps } from './types';
import { STYLES } from './styles';

export const FieldRadioGroup: React.FC<FieldRadioGroupComponentProps> = ({
	label,
	value,
	onChange,
	options,
	disabled = false,
	className = '',
	layout = 'vertical',
}) => {
	const handleChange = (optionValue: string) => {
		if (disabled) return;
		onChange?.(optionValue);
	};

	return (
		<div className={`relative ${className}`}>
			<div className={`flex items-center justify-between ${STYLES.fieldHeaderHeight}`}>
				{label && (
					<label className="text-sm font-medium text-gray-700 leading-6">
						{label}
					</label>
				)}
			</div>

			<div className={`flex min-h-[2rem] ${layout === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-4'}`}>
				{options.map((option) => {
					const isSelected = option.value === value;
					const isDisabled = disabled || option.disabled;

					return (
						<div
							key={option.value}
							className={`flex items-center h-8 ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
							onClick={() => !isDisabled && handleChange(option.value)}>
							<div
								className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 border transition-all duration-200 ${
									isSelected
										? 'neu-inset bg-white border-gray-400 shadow-inner'
										: 'neu-raised bg-white border-gray-300 shadow-md hover:shadow-lg'
								}`}>
								{isSelected && (
									<div className="w-3 h-3 bg-gray-900 rounded-full"></div>
								)}
							</div>
							<span className={`text-sm font-medium ${isSelected ? 'text-gray-800' : 'text-gray-700'}`}>
								{option.label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}; 
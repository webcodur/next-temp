'use client';

import React from 'react';

interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

interface FieldRadioGroupProps {
	label?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	disabled?: boolean;
	className?: string;
	layout?: 'horizontal' | 'vertical';
}

export const FieldRadioGroup: React.FC<FieldRadioGroupProps> = ({
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

	const handleKeyDown = (optionValue: string) => (e: React.KeyboardEvent) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			handleChange(optionValue);
		}
	};

	return (
		<div className={`relative ${className}`}>
			<div className="flex items-center justify-between h-6">
				{label && (
					<label className="text-sm font-medium text-gray-700 leading-6">
						{label}
					</label>
				)}
			</div>

			<div
				className={`flex min-h-[2rem] ${layout === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-4'}`}>
				{options.map((option) => {
					const isSelected = option.value === value;
					const isDisabled = disabled || option.disabled;

					return (
						<div
							key={option.value}
							className={`flex items-center h-8 ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
							onClick={() => !isDisabled && handleChange(option.value)}
							onKeyDown={handleKeyDown(option.value)}
							tabIndex={isDisabled ? -1 : 0}
							role="radio"
							aria-checked={isSelected}>
							<div
								className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 border transition-all duration-200 focus-within:neu-inset ${
									isSelected
										? 'neu-inset bg-white border-gray-400 shadow-inner'
										: 'neu-raised bg-white border-gray-300 shadow-md hover:shadow-lg'
								}`}>
								{isSelected && (
									<div className="w-3 h-3 bg-gray-900 rounded-full"></div>
								)}
							</div>
							<span
								className={`text-sm font-medium ${isSelected ? 'text-gray-800' : 'text-gray-700'}`}>
								{option.label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

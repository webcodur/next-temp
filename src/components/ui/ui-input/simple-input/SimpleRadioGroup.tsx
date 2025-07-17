'use client';

import React from 'react';

interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

interface SimpleRadioGroupProps {
	label?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	disabled?: boolean;
	className?: string;
	layout?: 'horizontal' | 'vertical';
}

export const SimpleRadioGroup: React.FC<SimpleRadioGroupProps> = ({
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
			<div className="flex justify-between items-center h-6">
				{label && (
					<label className="text-sm font-medium leading-6 text-foreground">
						{label}
					</label>
				)}
			</div>

			<div className={`flex min-h-8 ${layout === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-4 justify-between'}`}>
				{options.map((option) => {
					const isSelected = option.value === value;
					const isDisabled = disabled || option.disabled;

					return (
						<div
							key={option.value}
							className={`flex items-center h-8 p-2 rounded-lg border border-transparent transition-all duration-200 ${
								layout === 'horizontal' ? 'flex-1' : ''
							} ${
								isDisabled 
									? 'opacity-60 cursor-not-allowed' 
									: 'cursor-pointer hover:bg-muted/70 hover:border-muted hover:shadow-md hover:scale-[1.01]'
							}`}
							onClick={() => !isDisabled && handleChange(option.value)}
							onKeyDown={handleKeyDown(option.value)}
							tabIndex={isDisabled ? -1 : 0}
							role="radio"
							aria-checked={isSelected}>
							<div
								className={`w-6 h-6 flex items-center justify-center rounded-full me-3 border transition-all duration-200 focus-within:neu-inset ${
									isSelected
										? 'shadow-inner neu-inset bg-primary/10 border-primary/30'
										: 'shadow-md neu-raised bg-background border-border hover:shadow-lg'
								}`}>
								{isSelected && (
									<div className="w-3 h-3 rounded-full shadow-sm bg-primary"></div>
								)}
							</div>
							<span
								className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
								{option.label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}; 
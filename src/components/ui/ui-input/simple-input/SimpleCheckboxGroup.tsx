'use client';

import React from 'react';
import { Check, Minus } from 'lucide-react';

interface CheckboxOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface SimpleCheckboxGroupProps {
	label?: string;
	value?: string[];
	onChange?: (value: string[]) => void;
	options: CheckboxOption[];
	disabled?: boolean;
	colorVariant?: 'primary' | 'secondary';
	className?: string;
	indeterminate?: boolean;
	layout?: 'horizontal' | 'vertical';
}

export const SimpleCheckboxGroup: React.FC<SimpleCheckboxGroupProps> = ({
	label,
	value = [],
	onChange,
	options,
	disabled = false,
	colorVariant = 'primary',
	className = '',
	indeterminate = false,
	layout = 'vertical',
}) => {

	// 색상 variant에 따른 스타일
	const colorStyles = {
		hoverBg: colorVariant === 'primary' ? 'hover:bg-primary/10' : 'hover:bg-secondary/10',
		hoverBorder: colorVariant === 'primary' ? 'hover:border-primary/30' : 'hover:border-secondary/30',
		hoverShadow: colorVariant === 'primary' ? 'hover:shadow-primary/20' : 'hover:shadow-secondary/20',
		checkedBg: colorVariant === 'primary' ? 'bg-primary/10' : 'bg-secondary/10',
		checkedBorder: colorVariant === 'primary' ? 'border-primary/30' : 'border-secondary/30',
		iconColor: colorVariant === 'primary' ? 'text-primary' : 'text-secondary',
		textColor: colorVariant === 'primary' ? 'text-primary' : 'text-secondary',
	};

	const handleChange = (optionValue: string, checked: boolean) => {
		if (disabled) return;
		
		const newValue = checked
			? [...value, optionValue]
			: value.filter(v => v !== optionValue);
		
		onChange?.(newValue);
	};

	const handleKeyDown = (optionValue: string, checked: boolean) => (e: React.KeyboardEvent) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			handleChange(optionValue, !checked);
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

			<div className={`flex min-h-11 ${layout === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-4 justify-between'}`}>
				{options.map((option) => {
					const isChecked = value.includes(option.value);
					const isDisabled = disabled || option.disabled;
					const showIndeterminate = indeterminate && !isChecked;

					return (
						<div
							key={option.value}
							className={`flex items-center h-11 p-2 rounded-lg border border-transparent transition-all duration-200 ${
								layout === 'horizontal' ? 'flex-1' : ''
							} ${
								isDisabled 
									? 'opacity-60 cursor-not-allowed' 
									: `cursor-pointer ${colorStyles.hoverBg} ${colorStyles.hoverBorder} hover:shadow-lg ${colorStyles.hoverShadow} hover:scale-[1.02] hover:neu-flat`
							}`}
							onClick={() => !isDisabled && handleChange(option.value, !isChecked)}
							onKeyDown={handleKeyDown(option.value, isChecked)}
							tabIndex={isDisabled ? -1 : 0}
							role="checkbox"
							aria-checked={showIndeterminate ? 'mixed' : isChecked}>
							<div className="relative">
								<input
									type="checkbox"
									checked={isChecked}
									onChange={() => handleChange(option.value, !isChecked)}
									disabled={isDisabled}
									className="sr-only"
								/>
								<div
									className={`w-6 h-6 flex items-center justify-center rounded-md transition-all duration-200 border focus-within:neu-inset ${
										isChecked || showIndeterminate
											? `neu-inset ${colorStyles.checkedBg} ${colorStyles.checkedBorder} shadow-inner`
											: 'neu-raised bg-background border-border shadow-md hover:shadow-lg'
									}`}>
									{showIndeterminate ? (
										<Minus className={`w-4 h-4 ${colorStyles.iconColor}`} />
									) : isChecked ? (
										<Check className={`w-4 h-4 ${colorStyles.iconColor}`} />
									) : null}
								</div>
							</div>
							<span
								className={`ml-3 text-sm font-medium ${isChecked ? colorStyles.textColor : 'text-muted-foreground'}`}>
								{option.label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}; 
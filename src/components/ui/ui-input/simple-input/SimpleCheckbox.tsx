'use client';

import React, { useRef, useEffect } from 'react';
import { Check, Minus } from 'lucide-react';

interface SimpleCheckboxProps {
	label?: string;
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	indeterminate?: boolean;
	disabled?: boolean;
	className?: string;
}

export const SimpleCheckbox: React.FC<SimpleCheckboxProps> = ({
	label,
	checked = false,
	onChange,
	indeterminate = false,
	disabled = false,
	className = '',
}) => {
	const checkboxRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (checkboxRef.current) {
			checkboxRef.current.indeterminate = indeterminate;
		}
	}, [indeterminate]);

	const handleChange = () => {
		if (disabled) return;
		onChange?.(!checked);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			handleChange();
		}
	};

	const isChecked = indeterminate ? false : checked;

	return (
		<div className={`relative ${className}`}>
			{label && (
				<div className="flex justify-between items-center h-6">
					<label className="text-sm font-medium leading-6 text-foreground">
						{label}
					</label>
				</div>
			)}

			<div
				className={`flex items-center ${label ? 'h-11' : 'h-6'} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
				onClick={handleChange}
				onKeyDown={handleKeyDown}
				tabIndex={disabled ? -1 : 0}
				role="checkbox"
				aria-checked={indeterminate ? 'mixed' : isChecked}>
				<div className="relative">
					<input
						ref={checkboxRef}
						type="checkbox"
						checked={isChecked}
						onChange={handleChange}
						disabled={disabled}
						className="sr-only"
					/>
					<div
						className={`w-6 h-6 flex items-center justify-center rounded-md transition-all duration-200 border focus-within:neu-inset ${
							isChecked || indeterminate
								? 'neu-inset bg-primary/10 border-primary/30 shadow-inner'
								: 'neu-raised bg-background border-border shadow-md hover:shadow-lg'
						}`}>
						{indeterminate ? (
							<Minus className="w-4 h-4 text-primary" />
						) : isChecked ? (
							<Check className="w-4 h-4 text-primary" />
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}; 
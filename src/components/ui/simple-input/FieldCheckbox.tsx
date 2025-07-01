'use client';

import React, { useRef, useEffect } from 'react';
import { Check, Minus } from 'lucide-react';

interface FieldCheckboxProps {
	label?: string;
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	indeterminate?: boolean;
	disabled?: boolean;
	className?: string;
}

export const FieldCheckbox: React.FC<FieldCheckboxProps> = ({
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
			<div className="flex items-center justify-between h-6">
				{label && (
					<label className="text-sm font-medium text-foreground leading-6">
						{label}
					</label>
				)}
			</div>

			<div
				className={`flex items-center h-8 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
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
								? 'neu-inset bg-background border-border shadow-inner'
								: 'neu-raised bg-background border-border shadow-md hover:shadow-lg'
						}`}>
						{indeterminate ? (
							<Minus className="w-4 h-4 text-foreground" />
						) : isChecked ? (
							<Check className="w-4 h-4 text-foreground" />
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

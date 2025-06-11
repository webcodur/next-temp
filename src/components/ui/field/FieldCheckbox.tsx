'use client';

import React, { useRef, useEffect } from 'react';
import { Check, Minus } from 'lucide-react';
import { FieldCheckboxComponentProps } from './types';
import { STYLES } from './styles';

export const FieldCheckbox: React.FC<FieldCheckboxComponentProps> = ({
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

	const isChecked = indeterminate ? false : checked;

	return (
		<div className={`relative ${className}`}>
			<div className={`flex items-center justify-between ${STYLES.fieldHeaderHeight}`}>
				{label && (
					<label className="text-sm font-medium text-gray-700 leading-6">
						{label}
					</label>
				)}
			</div>

			<div
				className={`flex items-center h-8 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
				onClick={handleChange}>
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
						className={`w-6 h-6 flex items-center justify-center rounded-md transition-all duration-200 border ${
							isChecked || indeterminate
								? 'neu-inset bg-white border-gray-400 shadow-inner'
								: 'neu-raised bg-white border-gray-300 shadow-md hover:shadow-lg'
						}`}>
						{indeterminate ? (
							<Minus className="w-4 h-4 text-gray-900" />
						) : isChecked ? (
							<Check className="w-4 h-4 text-gray-900" />
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
}; 
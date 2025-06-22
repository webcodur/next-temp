'use client';

import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Type } from 'lucide-react';
import { FieldTextComponentProps } from '../core/types';
import { FIELD_STYLES } from '../core/config';
import { ClearButton } from '../shared/ClearButton';

export const FieldText: React.FC<FieldTextComponentProps> = ({
	label,
	placeholder,
	value,
	onChange,
	onEnterPress,
	onClear,
	inputType = 'text',
	className = '',
	size = 'sm',
	showClearButton = true,
	disabled = false,
}) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && onEnterPress) {
			onEnterPress();
		}
	};

	const handleClear = () => {
		onChange('');
		onClear?.();
	};

	const sizeStyles = {
		sm: 'px-3 py-2 text-sm h-8',
		md: 'px-4 py-2.5 text-sm h-10',
		lg: 'px-4 py-3 text-base h-11',
	};

	return (
		<div className={`space-y-1 ${className}`}>
			{label && (
				<label className="block mb-1 text-sm font-medium text-gray-800">
					{label}
				</label>
			)}

			<div className="relative">
				<Type className="absolute left-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2" />

				<input
					type={inputType}
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					spellCheck={false}
					autoComplete="off"
					className={`
						w-full
						${FIELD_STYLES.container}
						${sizeStyles[size]}
						pl-10
						${showClearButton && value ? 'pr-10' : 'pr-3'}
						font-medium
						placeholder-gray-700 text-gray-800
						${disabled ? 'opacity-60 cursor-not-allowed' : ''}
					`}
				/>

				{showClearButton && value && <ClearButton onClick={handleClear} />}
			</div>
		</div>
	);
};

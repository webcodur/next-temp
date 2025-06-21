'use client';

import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Search, X, Type } from 'lucide-react';
import { FieldTextComponentProps } from './types';
import { STYLES } from './styles';

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
	showSearchIcon = false,
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
		<div className="flex flex-col">
			<div className={`flex items-center justify-between ${STYLES.fieldHeaderHeight}`}>
				{label && (
					<label className="text-sm font-medium leading-6 text-gray-700">
						{label}
					</label>
				)}
			</div>
			<div className="relative">
				{showSearchIcon ? (
					<Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-500 transform -translate-y-1/2" />
				) : (
					<Type className="absolute left-3 top-1/2 w-4 h-4 text-gray-500 transform -translate-y-1/2" />
				)}

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
						w-full ${STYLES.container}
						text-gray-800 placeholder-gray-400 font-medium
						${sizeStyles[size]}
						pl-10
						${showClearButton && value ? 'pr-10' : ''}
						${disabled ? 'opacity-60 cursor-not-allowed' : ''}
						${className}
					`}
				/>

				{showClearButton && value && (
					<button
						onClick={handleClear}
						className={`absolute flex items-center justify-center w-5 h-5 text-gray-500 transition-colors transform -translate-y-1/2 rounded-full right-3 top-1/2 ${STYLES.button}`}
						type="button">
						<X className="w-3 h-3" />
					</button>
				)}
			</div>
		</div>
	);
}; 
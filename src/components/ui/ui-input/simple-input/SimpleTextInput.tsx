'use client';

import React, { useState, useRef } from 'react';
import { Type } from 'lucide-react';

interface SimpleTextInputProps {
	label?: string;
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	type?: 'text' | 'email' | 'password' | 'number';
}

export const SimpleTextInput: React.FC<SimpleTextInputProps> = ({
	label,
	value = '',
	onChange,
	placeholder = '텍스트를 입력하세요',
	disabled = false,
	className = '',
	type = 'text',
}) => {
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFocus = () => {
		if (disabled) return;
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		onChange?.(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled) return;

		if (e.key === 'Escape') {
			inputRef.current?.blur();
		}
	};

	return (
		<div className={`relative ${className}`}>
			<div className="flex justify-between items-center">
				{label && (
					<label className="text-sm font-medium leading-6 text-foreground">
						{label}
					</label>
				)}
			</div>

			<div
				className={`relative flex items-center h-8 px-3 border rounded-lg transition-all duration-200 ${
					isFocused
						? 'shadow-inner neu-inset border-primary/30'
						: 'shadow-md neu-flat border-border hover:shadow-lg'
				} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}`}>
				
				{/* 왼쪽 텍스트 아이콘 */}
				<Type className="flex-shrink-0 mr-3 w-4 h-4 text-muted-foreground" />

				{/* 중앙 입력 필드 */}
				<input
					ref={inputRef}
					type={type}
					value={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					className="flex-1 text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground text-foreground"
				/>
			</div>
		</div>
	);
}; 
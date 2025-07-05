'use client';

import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Search, X, Type } from 'lucide-react';
import { FieldTextComponentProps } from '../core/types';
import { FIELD_STYLES } from '../core/config';

export const FieldText: React.FC<FieldTextComponentProps> = ({
	label,
	placeholder = '텍스트를 입력하세요',
	value,
	onChange,
	onEnterPress,
	onClear,
	showSearchIcon = false,
	showClearButton = true,
	className = '',
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

	// 아이콘 결정: showSearchIcon이 true면 Search, 아니면 기본 Type 아이콘
	const LeftIcon = showSearchIcon ? Search : Type;

	return (
		<div className={`space-y-1 ${className}`}>
			{label && <label className={FIELD_STYLES.label}>{label}</label>}

			<div className="relative">
				<LeftIcon className={`${FIELD_STYLES.leftIcon} neu-icon-inactive`} />

				<input
					type="text"
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					className={`
						w-full
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						ps-10
						${showClearButton && value ? 'pe-10' : ''}
						${disabled ? FIELD_STYLES.disabled : ''}
					`}
				/>

				{showClearButton && value && (
					<button
						onClick={handleClear}
						className={`${FIELD_STYLES.rightIcon} ${FIELD_STYLES.clearButton}`}
						type="button">
						<X className="neu-icon-inactive hover:neu-icon-active w-3 h-3" />
					</button>
				)}
			</div>
		</div>
	);
};

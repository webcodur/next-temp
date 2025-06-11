'use client';

import React from 'react';
import { FieldToggleSwitchComponentProps } from './types';
import { STYLES } from './styles';

export const FieldToggleSwitch: React.FC<FieldToggleSwitchComponentProps> = ({
	label,
	checked = false,
	onChange,
	size = 'xl',
	disabled = false,
	className = '',
}) => {
	const handleChange = () => {
		if (disabled) return;
		onChange?.(!checked);
	};

	const sizeStyles = {
		sm: {
			track: 'w-8 h-4',
			thumb: 'w-3 h-3',
			translate: checked ? 'translate-x-4' : 'translate-x-0.5',
		},
		md: {
			track: 'w-10 h-5',
			thumb: 'w-4 h-4',
			translate: checked ? 'translate-x-5' : 'translate-x-0.5',
		},
		lg: {
			track: 'w-12 h-6',
			thumb: 'w-5 h-5',
			translate: checked ? 'translate-x-6' : 'translate-x-0.5',
		},
		xl: {
			track: 'w-16 h-8',
			thumb: 'w-7 h-7',
			translate: checked ? 'translate-x-8' : 'translate-x-0.5',
		},
	};

	const currentSize = sizeStyles[size];

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
						type="checkbox"
						checked={checked}
						onChange={handleChange}
						disabled={disabled}
						className="sr-only"
					/>
					{/* 트랙 */}
					<div
						className={`${currentSize.track} relative rounded-full transition-all duration-200 border ${
							checked
								? 'neu-inset bg-blue-100 border-blue-300 shadow-inner'
								: 'neu-flat bg-gray-100 border-gray-300 shadow-sm hover:shadow-md'
						}`}>
						{/* 썸 */}
						<div
							className={`${currentSize.thumb} absolute top-1/2 -translate-y-1/2 neu-raised bg-white border border-gray-200 rounded-full shadow-lg transition-transform duration-200 ${currentSize.translate} ${
								checked ? 'border-blue-200' : 'border-gray-300'
							}`}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}; 
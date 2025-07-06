'use client';

import React, { useState, useRef } from 'react';
import { List, ChevronDown } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { SelectDropdown } from './SelectDropdown';
import { useLocale } from '@/hooks/useI18n';

interface FieldSelectProps {
	id: string;
	label?: string;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: Array<{ value: string; label: string }>;
	className?: string;
	disabled?: boolean;
	startIcon?: React.ReactNode;
	onFocus?: () => void;
	onBlur?: () => void;
}

const FieldSelect: React.FC<FieldSelectProps> = ({
	id,
	label,
	placeholder = '선택하세요',
	value = '',
	onChange,
	options,
	className = '',
	disabled = false,
	startIcon,
	onFocus,
	onBlur,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const selectRef = useRef<HTMLDivElement>(null);
	const { isRTL } = useLocale();

	const selectedOption = options.find(option => option.value === value);

	const handleSelect = (optionValue: string) => {
		onChange?.(optionValue);
		setIsOpen(false);
	};

	return (
		<div className={`relative ${className}`}>
			{label && (
				<label htmlFor={id} className={FIELD_STYLES.label}>
					{label}
				</label>
			)}
			<div className="relative" ref={selectRef}>
				<div
					className={`
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						${isRTL ? 'pe-12 ps-12' : 'pl-12 pr-12'}
						${isFocused ? 'ring-2 ring-primary' : ''}
						${disabled ? FIELD_STYLES.disabled : 'cursor-pointer'}
						w-full bg-transparent flex items-center justify-between
					`}
					onClick={() => !disabled && setIsOpen(!isOpen)}
					onFocus={() => {
						setIsFocused(true);
						onFocus?.();
					}}
					onBlur={() => {
						setIsFocused(false);
						onBlur?.();
					}}
				>
					<span className={`${FIELD_STYLES.startIcon}`}>
						{startIcon || <List className="neu-icon-inactive w-4 h-4" />}
					</span>
					<span className={`${selectedOption ? 'text-foreground' : 'text-muted-foreground'}`}>
						{selectedOption ? selectedOption.label : placeholder}
					</span>
					<ChevronDown 
						className={`
							${FIELD_STYLES.endIcon}
							w-4 h-4 transition-transform
							${isOpen ? 'rotate-180' : ''}
						`}
					/>
				</div>
				
				{isOpen && (
					<SelectDropdown
						isOpen={isOpen}
						options={options}
						selectedValue={value}
						onSelect={handleSelect}
						maxHeight={200}
					/>
				)}
			</div>
		</div>
	);
};

export default FieldSelect;

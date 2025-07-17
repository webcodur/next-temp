'use client';

import React, { useState, useRef, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

interface DropdownOption {
	value: string;
	label: string;
	disabled?: boolean;
}

interface SimpleDropdownProps {
	label?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: DropdownOption[];
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
	label,
	value,
	onChange,
	options,
	placeholder = '선택하세요',
	disabled = false,
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find(option => option.value === value);

	// 외부 클릭 시 드롭다운 닫기
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleToggle = () => {
		if (disabled) return;
		setIsOpen(!isOpen);
	};

	const handleSelect = (optionValue: string) => {
		if (disabled) return;
		onChange?.(optionValue);
		setIsOpen(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled) return;

		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			setIsOpen(!isOpen);
		} else if (e.key === 'Escape') {
			setIsOpen(false);
		} else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault();
			if (!isOpen) {
				setIsOpen(true);
				return;
			}

			const currentIndex = options.findIndex(option => option.value === value);
			let nextIndex;

			if (e.key === 'ArrowDown') {
				nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
			} else {
				nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
			}

			const nextOption = options[nextIndex];
			if (nextOption && !nextOption.disabled) {
				onChange?.(nextOption.value);
			}
		}
	};

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			<div className="flex justify-between items-center h-6">
				{label && (
					<label className="text-sm font-medium leading-6 text-foreground">
						{label}
					</label>
				)}
			</div>

			<div
				className={`relative flex items-center h-8 px-3 border rounded-xl transition-all duration-200 focus-within:neu-inset ${
					isOpen
						? 'neu-inset border-primary/30 shadow-inner'
						: 'neu-raised border-border shadow-md hover:shadow-lg'
				} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
				onClick={handleToggle}
				onKeyDown={handleKeyDown}
				tabIndex={disabled ? -1 : 0}
				role="combobox"
				aria-expanded={isOpen}
				aria-haspopup="listbox">
				
				{/* 왼쪽 리스트 아이콘 */}
				<List className="w-4 h-4 text-muted-foreground mr-3 flex-shrink-0" />

				{/* 중앙 컨텐츠 */}
				<div className="flex-1 text-sm font-medium">
					{selectedOption ? (
						<span className="text-foreground">{selectedOption.label}</span>
					) : (
						<span className="text-muted-foreground">{placeholder}</span>
					)}
				</div>

				{/* 우측 화살표 아이콘 */}
				<div className="ml-3 flex-shrink-0">
					{isOpen ? (
						<ChevronUp className="w-4 h-4 text-muted-foreground" />
					) : (
						<ChevronDown className="w-4 h-4 text-muted-foreground" />
					)}
				</div>
			</div>

			{/* 드롭다운 메뉴 */}
			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-1 z-50 neu-flat border border-border rounded-xl shadow-lg bg-background">
					<ul role="listbox" className="py-1 max-h-60 overflow-auto">
						{options.map((option) => (
							<li
								key={option.value}
								className={`px-3 py-2 text-sm cursor-pointer transition-colors duration-200 ${
									option.disabled
										? 'opacity-50 cursor-not-allowed'
										: 'hover:bg-muted hover:neu-flat'
								} ${
									option.value === value
										? 'bg-primary/10 text-primary font-medium'
										: 'text-foreground'
								}`}
								onClick={() => !option.disabled && handleSelect(option.value)}
								role="option"
								aria-selected={option.value === value}
								aria-disabled={option.disabled}>
								{option.label}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}; 
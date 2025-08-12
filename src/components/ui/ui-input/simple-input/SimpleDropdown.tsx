'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { List, ChevronDown, ChevronUp, X } from 'lucide-react';
import { ValidationRule } from '@/utils/validation';
import { Portal } from '../field/shared/Portal';

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
	colorVariant?: 'primary' | 'secondary';
	className?: string;
	validationRule?: ValidationRule;
}

export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
	label,
	value,
	onChange,
	options,
	placeholder = '전체',
	disabled = false,
	colorVariant = 'primary',
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
	const dropdownRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);
	const selectedOption = options.find(option => option.value === value);

	// 드롭다운 위치 계산
	const calculatePosition = useCallback(() => {
		if (!triggerRef.current) return;
		
		const rect = triggerRef.current.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const dropdownHeight = Math.min(options.length * 40 + 16, 244); // max-h-60 = 240px + padding
		
		// 화면 하단에 공간이 부족하면 위쪽에 표시
		const shouldShowAbove = rect.bottom + dropdownHeight > viewportHeight && rect.top > dropdownHeight;
		
		setDropdownPosition({
			top: shouldShowAbove ? rect.top - dropdownHeight : rect.bottom,
			left: rect.left,
			width: rect.width,
		});
	}, [options.length]);

	// 외부 클릭 시 드롭다운 닫기
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
				triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// 드롭다운 열릴 때 위치 계산
	useEffect(() => {
		if (isOpen) {
			calculatePosition();
			
			// 스크롤이나 리사이즈 시 위치 재계산
			const handleReposition = () => calculatePosition();
			window.addEventListener('scroll', handleReposition, true);
			window.addEventListener('resize', handleReposition);
			
			return () => {
				window.removeEventListener('scroll', handleReposition, true);
				window.removeEventListener('resize', handleReposition);
			};
		}
	}, [isOpen, calculatePosition]);

	const handleToggle = () => {
		if (disabled) return;
		setIsOpen(!isOpen);
	};

	const handleSelect = (optionValue: string) => {
		if (disabled) return;
		onChange?.(optionValue);
		setIsOpen(false);
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (disabled) return;
		onChange?.('');
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

	// 색상 variant에 따른 스타일
	const colorStyles = {
		borderFocus: colorVariant === 'primary' ? 'border-primary/30' : 'border-secondary/30',
		bgSelected: colorVariant === 'primary' ? 'bg-primary/10' : 'bg-secondary/10',
		textSelected: colorVariant === 'primary' ? 'text-primary' : 'text-secondary',
	};

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			{/* 라벨 */}
			{label && (
				<div className="flex justify-between items-center">
					<label className="text-sm font-medium leading-6 text-foreground">
						{label}
					</label>
				</div>
			)}



			{/* 드롭다운 입력 영역 */}
			<div className="relative">
				<div
					ref={triggerRef}
					className={`
						w-full h-11 pl-10 pr-10 text-sm font-medium border rounded-lg 
						flex items-center cursor-pointer
						${isOpen
							? `shadow-inner neu-inset ${colorStyles.borderFocus}`
							: 'shadow-md neu-flat border-border hover:shadow-lg'
						} 
						${disabled ? 'opacity-60 cursor-not-allowed' : ''} 
						${selectedOption ? 'text-foreground' : 'text-muted-foreground'}
						bg-serial-3
					`}
					onClick={handleToggle}
					onKeyDown={handleKeyDown}
					tabIndex={disabled ? -1 : 0}
					aria-expanded={isOpen}
					aria-haspopup="listbox"
				>
					{/* 표시 텍스트 */}
					<span className="flex-1 select-none">
						{selectedOption ? selectedOption.label : placeholder}
					</span>
				</div>
				
				{/* 왼쪽 리스트 아이콘 */}
				<List className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />

				{/* 우측 아이콘들 */}
				<div className="flex absolute right-3 top-1/2 gap-1 items-center transform -translate-y-1/2">
					{selectedOption && !disabled && (
						<button
							type="button"
							onClick={handleClear}
							className="p-1 rounded-full transition-colors duration-200 hover:bg-muted"
							aria-label="값 지우기"
						>
							<X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
						</button>
					)}
					{isOpen ? (
						<ChevronUp className="w-4 h-4 text-muted-foreground" />
					) : (
						<ChevronDown className="w-4 h-4 text-muted-foreground" />
					)}
				</div>
			</div>

			{/* 드롭다운 메뉴 - Portal로 렌더링 */}
			{isOpen && (
				<Portal containerId="dropdown-portal">
					<div 
						ref={dropdownRef}
						className="fixed z-[50000]"
						style={{
							top: dropdownPosition.top,
							left: dropdownPosition.left,
							width: dropdownPosition.width,
						}}
					>
						<div className="rounded-lg border shadow-xl border-border bg-background">
							<ul role="listbox" className="overflow-auto py-1 max-h-60">
								{options.map((option) => (
									<li
										key={option.value}
										className={`
											px-3 py-2 text-sm transition-colors duration-150
											${option.disabled
												? 'opacity-50 cursor-not-allowed'
												: 'cursor-pointer hover:bg-muted'
											} 
											${option.value === value
												? `${colorStyles.bgSelected} ${colorStyles.textSelected} font-medium`
												: 'text-foreground'
											}
										`}
										onClick={() => {
											if (!option.disabled) {
												handleSelect(option.value);
											}
										}}
										role="option"
										aria-selected={option.value === value}
										aria-disabled={option.disabled}
									>
										{option.label}
									</li>
								))}
							</ul>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}; 
import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Option } from '../core/types';
import { FIELD_STYLES } from '../core/config';

interface SelectDropdownProps {
	isOpen: boolean;
	options: Option[];
	selectedValue?: string;
	onSelect: (value: string) => void;
	highlightedIndex?: number;
	maxHeight: number;
	triggerRef?: React.RefObject<HTMLElement>;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
	isOpen,
	options,
	selectedValue,
	onSelect,
	highlightedIndex = -1,
	maxHeight,
	triggerRef,
}) => {
	const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

	// 위치 계산 로직을 useCallback으로 추출
	const calculatePosition = useCallback(() => {
		if (triggerRef?.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			const spaceBelow = viewportHeight - rect.bottom;
			const totalCount = options.length;
			const minHeight = Math.min(7, totalCount) * 40;
			const finalMaxHeight = Math.max(maxHeight, minHeight);
			
			const shouldOpenAbove = spaceBelow < finalMaxHeight + 16; // 16px buffer
			
			setPosition({
				top: shouldOpenAbove ? rect.top - finalMaxHeight - 8 : rect.bottom + 8,
				left: rect.left,
				width: rect.width,
			});
		}
	}, [options.length, maxHeight, triggerRef]);

	// 위치 계산 (열릴 때, 스크롤, 리사이즈)
	useEffect(() => {
		if (isOpen) {
			let ticking = false;
			const handleEvent = () => {
				if (!ticking) {
					window.requestAnimationFrame(() => {
						calculatePosition();
						ticking = false;
					});
					ticking = true;
				}
			};

			calculatePosition(); // 초기 위치 설정
			window.addEventListener('scroll', handleEvent, true);
			window.addEventListener('resize', handleEvent);
			
			return () => {
				window.removeEventListener('scroll', handleEvent, true);
				window.removeEventListener('resize', handleEvent);
			};
		}
	}, [isOpen, calculatePosition]);

	if (!isOpen) return null;

	const handleOptionClick = (option: Option) => {
		if (!option.disabled) {
			onSelect(option.value);
		}
	};

	const totalCount = options.length;
	const minHeight = Math.min(7, totalCount) * 40; // 7개 항목까지 보장 (각 40px)
	const finalMaxHeight = Math.max(maxHeight, minHeight);

	// 현재 테마 클래스 감지
	const themeClass = document.documentElement.classList.contains('dark') ? 'dark' : '';

	const dropdownContent = (
		<div
			className={`fixed z-[9999] ${themeClass}`}
			style={{
				top: `${position.top}px`,
				left: `${position.left}px`,
				width: `${position.width}px`,
				// CSS 변수 명시적 상속
				colorScheme: themeClass === 'dark' ? 'dark' : 'light',
			}}
		>
			<div
				className={`${FIELD_STYLES.dropdown} overflow-hidden rounded-lg`}
				style={{ maxHeight: `${finalMaxHeight}px` }}>
				<ul
					className={FIELD_STYLES.dropdownScroll}
					style={{ maxHeight: `${finalMaxHeight}px` }}>
					{options.map((option, index) => {
						const isSelected = selectedValue === option.value;
						const isHighlighted = highlightedIndex === index;
						const numberLabel = `${index + 1}/${totalCount}`;

						return (
							<li
								key={option.value}
								onClick={() => handleOptionClick(option)}
								className={`
									${FIELD_STYLES.dropdownOption}
									${option.disabled ? FIELD_STYLES.dropdownOptionDisabled : ''}
									${isSelected ? `${FIELD_STYLES.dropdownOptionSelected} !bg-primary !text-primary-foreground` : ''}
									${isHighlighted && !isSelected ? FIELD_STYLES.dropdownOptionHighlighted : ''}
								`.replace(/\s+/g, ' ').trim()}
								style={isSelected ? {
									backgroundColor: `hsl(var(--primary))`,
									color: `hsl(var(--primary-foreground))`,
								} : undefined}>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className={`font-multilang text-xs font-mono ${isSelected ? 'text-primary-foreground' : isHighlighted ? 'text-foreground' : 'text-muted-foreground'}`}>
											{numberLabel}
										</span>
										<span className={`font-multilang ${isSelected ? '!text-primary-foreground' : ''}`}>{option.label}</span>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);

	// Portal을 사용해서 body에 렌더링
	return createPortal(dropdownContent, document.body);
};

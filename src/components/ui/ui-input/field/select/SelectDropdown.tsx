'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Option } from '../core/types';
import { FIELD_STYLES } from '../core/config';
import { Portal } from '../shared/Portal';

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

	// 위치 계산 함수를 useCallback으로 최적화
	const calculatePosition = useCallback(() => {
		if (triggerRef?.current && isOpen) {
			const rect = triggerRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			const spaceBelow = viewportHeight - rect.bottom;
			const totalCount = options.length;
			const minHeight = Math.min(7, totalCount) * 40;
			const finalMaxHeight = Math.max(maxHeight, minHeight);
			
			const shouldOpenAbove = spaceBelow < finalMaxHeight + 16;

			// 위치 계산
			setPosition({
				top: shouldOpenAbove ? rect.top - finalMaxHeight - 8 : rect.bottom + 4,
				left: rect.left,
				width: rect.width
			});
		}
	}, [isOpen, options.length, maxHeight, triggerRef]);

	// 위치 계산을 위한 useEffect - 의존성 개선
	useEffect(() => {
		calculatePosition();
	}, [calculatePosition]);

	// window resize 이벤트 처리 추가
	useEffect(() => {
		if (!isOpen) return;

		const handleResize = () => {
			calculatePosition();
		};

		const handleScroll = () => {
			calculatePosition();
		};

		window.addEventListener('resize', handleResize);
		window.addEventListener('scroll', handleScroll, true);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [isOpen, calculatePosition]);

	if (!isOpen) return null;

	const handleOptionClick = (option: Option) => {
		if (!option.disabled) {
			onSelect(option.value);
		}
	};

	const totalCount = options.length;
	const minHeight = Math.min(7, totalCount) * 40;
	const finalMaxHeight = Math.max(maxHeight, minHeight);

	return (
		<Portal>
			<div
				className="fixed z-[9999]"
				style={{
					top: `${position.top}px`,
					left: `${position.left}px`,
					width: `${position.width}px`,
				}}
			>
				<div
					className={`${FIELD_STYLES.dropdown} overflow-hidden rounded-lg shadow-xl`}
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
									`.replace(/\s+/g, ' ').trim()}>
									<div className="flex justify-between items-center">
										<div className="flex gap-2 items-center">
											<span className={`font-multilang text-xs ${isSelected ? 'text-primary-foreground' : isHighlighted ? 'text-foreground' : 'text-muted-foreground'}`}>
												{numberLabel}
											</span>
											<span className={`font-multilang ${isSelected ? '!text-primary-foreground':''}`}>{option.label}</span>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</Portal>
	);
};

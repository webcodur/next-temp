'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { FieldBaseProps } from '../core/types';
import { Portal } from '../shared/Portal';
import { useLocale } from '@/hooks/ui-hooks/useI18n';

interface FieldTimePickerProps extends FieldBaseProps {
	id?: string;
	placeholder?: string;
	value?: string; // "HH:mm" 형식 (예: "14:30")
	onChange?: (value: string) => void;
	showClearButton?: boolean;
	minTime?: string; // "HH:mm" 형식
	maxTime?: string; // "HH:mm" 형식
	timeInterval?: number; // 분 단위 간격 (기본: 15분)
}

const FieldTimePicker: React.FC<FieldTimePickerProps> = ({
	id = '',
	label,
	placeholder = 'HH:MM',
	value = '',
	onChange,
	disabled = false,
	className = '',
	showClearButton = true,
	timeInterval = 15,
}) => {
	const { isRTL } = useLocale();
	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
	const [selectedHour, setSelectedHour] = useState<number | null>(null);
	const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
	const [inputValue, setInputValue] = useState(value);
	const containerRef = useRef<HTMLDivElement>(null);

	// 시간 옵션 생성
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const minutes = Array.from({ length: Math.ceil(60 / timeInterval) }, (_, i) => i * timeInterval);

	// value 변경 시 내부 상태 동기화
	useEffect(() => {
		setInputValue(value);
		if (value) {
			const [h, m] = value.split(':').map(Number);
			if (!isNaN(h) && !isNaN(m)) {
				setSelectedHour(h);
				setSelectedMinute(m);
			}
		} else {
			setSelectedHour(null);
			setSelectedMinute(null);
		}
	}, [value]);

	// 드롭다운 위치 계산
	useEffect(() => {
		if (containerRef.current && isOpen) {
			const rect = containerRef.current.getBoundingClientRect();
			const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			const spaceBelow = viewportHeight - rect.bottom;
			const dropdownHeight = 280; // 예상 드롭다운 높이
			
			const shouldOpenAbove = spaceBelow < dropdownHeight;

			setPosition({
				top: shouldOpenAbove ? rect.top - dropdownHeight - 8 : rect.bottom + 4,
				left: rect.left,
				width: rect.width
			});
		}
	}, [isOpen]);

	// 외부 클릭 시 드롭다운 닫기
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const handleTimeSelect = (hour: number, minute: number) => {
		const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
		setSelectedHour(hour);
		setSelectedMinute(minute);
		setInputValue(timeString);
		onChange?.(timeString);
		setIsOpen(false);
	};

	const hasValue = Boolean(value);

	return (
		<div className={`${FIELD_STYLES.fieldWrapper} ${className}`}>
			{label && (
				<label htmlFor={id} className={FIELD_STYLES.label}>
					{label}
				</label>
			)}
			<div ref={containerRef} className="relative">
				<Clock className={`${FIELD_STYLES.startIcon} neu-icon-active`} />
				
				{/* 메인 입력 필드 (직접 입력 허용) */}
				<input
					type="text"
					id={id}
					name={id}
					value={inputValue}
					placeholder={placeholder}
					disabled={disabled}
					autoComplete="off"
					dir={isRTL ? 'rtl' : 'ltr'}
					onFocus={() => !disabled && setIsOpen(true)}
					onChange={(e) => {
						const val = e.target.value;
						setInputValue(val);
						// 빈 값이면 초기화
						if (val === '') {
							setSelectedHour(null);
							setSelectedMinute(null);
							onChange?.('');
							return;
						}

						// HH:mm 패턴 검증
						const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
						if (regex.test(val)) {
							const [h, m] = val.split(':').map(Number);
							setSelectedHour(h);
							setSelectedMinute(m);
							onChange?.(val);
						}
						// 패턴 불일치 시에는 일단 입력값 유지, 상위 onChange 호출 안함
					}}
					className={`
						${FIELD_STYLES.container}
						${FIELD_STYLES.height}
						${FIELD_STYLES.padding}
						${FIELD_STYLES.text}
						${isRTL ? 'pe-12 ps-12' : 'pl-12 pr-12'}
						${isOpen ? 'ring-2 ring-primary' : ''}
						${disabled ? FIELD_STYLES.disabled : ''}
						${FIELD_STYLES.background.inner} w-full focus:outline-none
					`}
				/>

				{/* 클리어 버튼 */}
				{showClearButton && hasValue && (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							onChange?.('');
							setSelectedHour(null);
							setSelectedMinute(null);
						}}
						className={`${FIELD_STYLES.endIcon} ${FIELD_STYLES.clearButton}`}
					>
						<X className="w-3 h-3" />
					</button>
				)}

				{/* 시간 선택 드롭다운 - Portal 사용 */}
				{isOpen && !disabled && (
					<Portal>
						<div 
							className="fixed z-[9999]"
							style={{
								top: `${position.top}px`,
								left: `${position.left}px`,
								width: `${position.width}px`,
							}}
						>
							<div className={`
								${FIELD_STYLES.dropdown}
								rounded-lg max-h-64 overflow-hidden shadow-xl
							`}>
								<div className="p-4">
									<div className="mb-3 text-sm font-medium text-foreground">시간 선택</div>
									<div className="flex gap-4">
										{/* 시 리스트 */}
										<div className="w-16">
											<div className="mb-2 text-xs text-center text-muted-foreground">시</div>
											<div className="overflow-y-auto p-1 space-y-1 max-h-56">
												{hours.map((hour) => (
													<button
														key={hour}
														type="button"
														onClick={() => handleTimeSelect(hour, selectedMinute ?? 0)}
														className={`w-full px-2 py-1 text-xs rounded text-center
															${selectedHour === hour 
																? 'neu-inset !bg-primary !text-primary-foreground' 
																: 'neu-raised hover:bg-muted'}`}
													>
														{hour.toString().padStart(2, '0')}
													</button>
												))}
											</div>
										</div>
										{/* 분 리스트 */}
										<div className="w-16">
											<div className="mb-2 text-xs text-center text-muted-foreground">분</div>
											<div className="overflow-y-auto p-1 space-y-1 max-h-56">
												{minutes.map((minute) => (
													<button
														key={minute}
														type="button"
														onClick={() => handleTimeSelect(selectedHour ?? 0, minute)}
														className={`w-full px-2 py-1 text-xs rounded text-center
															${selectedMinute === minute 
																? 'neu-inset !bg-primary !text-primary-foreground' 
																: 'neu-raised hover:bg-muted'}`}
													>
														{minute.toString().padStart(2, '0')}
													</button>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Portal>
				)}
			</div>
		</div>
	);
};

export default FieldTimePicker; 
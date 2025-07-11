'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';
import { useLocale } from '@/hooks/useI18n';

interface FieldTimePickerProps {
	id: string;
	label?: string;
	placeholder?: string;
	value?: string; // "HH:mm" 형태
	onChange?: (value: string) => void;
	className?: string;
	disabled?: boolean;
	showClearButton?: boolean;
}

const FieldTimePicker: React.FC<FieldTimePickerProps> = ({
	id,
	label,
	placeholder = '시간 선택',
	value = '',
	onChange,
	className = '',
	disabled = false,
	showClearButton = true,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [openAbove, setOpenAbove] = useState(false);
	const [selectedHour, setSelectedHour] = useState<number | null>(null);
	const [selectedMinute, setSelectedMinute] = useState<number | null>(null);
	const [inputValue, setInputValue] = useState<string>(value);
	const { isRTL } = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);

	// 현재 값을 파싱하여 시/분 상태 설정
	useEffect(() => {
		setInputValue(value);
		if (value) {
			const [hour, minute] = value.split(':').map(Number);
			setSelectedHour(hour);
			setSelectedMinute(minute);
		} else {
			setSelectedHour(null);
			setSelectedMinute(null);
		}
	}, [value]);

	// 드롭다운 위치 계산
	useEffect(() => {
		if (isOpen && containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			const dropdownHeight = 300; // 근사치
			const spaceBelow = window.innerHeight - rect.bottom;
			setOpenAbove(spaceBelow < dropdownHeight);
		}
	}, [isOpen]);

	// 외부 클릭 감지
	useEffect(() => {
		if (!isOpen) return;
		const handleClick = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [isOpen]);

	// 시간 선택 핸들러
	const handleTimeSelect = (hour: number, minute: number) => {
		const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
		setInputValue(timeString);
		onChange?.(timeString);
		setSelectedHour(hour);
		setSelectedMinute(minute);
		setIsOpen(false);
	};

	// 시간 옵션 생성
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

	const hasValue = Boolean(value);

	return (
		<div ref={containerRef} className={`relative space-y-1 ${className}`}>
			{label && (
				<label htmlFor={id} className={FIELD_STYLES.label}>
					{label}
				</label>
			)}
			<div className="relative">
				<Clock className={`${FIELD_STYLES.startIcon} neu-icon-active z-20`} />
				
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
						const regex = /^([01]\\d|2[0-3]):([0-5]\\d)$/;
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
						bg-transparent w-full focus:outline-none
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

				{/* 시간 선택 드롭다운 */}
				{isOpen && !disabled && (
					<div 
						className={`
							absolute start-0 end-0 z-50
							${openAbove ? 'bottom-full mb-1' : 'top-full mt-1'}
							${FIELD_STYLES.dropdown}
							rounded-lg max-h-64 overflow-hidden
						`}
					>
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
				)}
			</div>
		</div>
	);
};

export default FieldTimePicker; 
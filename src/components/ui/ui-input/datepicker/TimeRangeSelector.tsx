'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronsUp, ChevronUp, ChevronDown, ChevronsDown } from 'lucide-react';
import { Portal } from '@/components/ui/ui-layout/portal/Portal';

// #region A 모듈: 24시간제 시분 선택 UI

interface TimeInputProps {
	value: number;
	onChange: (value: number) => void;
	type: 'hour' | 'minute';
	label: string;
}

function TimeInput({ value, onChange, type, label }: TimeInputProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
	const triggerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const selectedRef = useRef<HTMLDivElement>(null);

	const maxValue = type === 'hour' ? 23 : 59;
	const minValue = 0;

	// 드롭다운 위치 계산
	const calculateDropdownPosition = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setDropdownPosition({
				top: rect.bottom + window.scrollY + 4,
				left: rect.left + window.scrollX
			});
		}
	};

	// 선택된 값을 뷰포트로 스크롤
	const scrollToSelected = () => {
		setTimeout(() => {
			if (selectedRef.current) {
				selectedRef.current.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
			}
		}, 100);
	};

	// 조작 버튼 핸들러
	const handleMax = () => {
		onChange(maxValue);
		scrollToSelected();
	};
	const handleMin = () => {
		onChange(minValue);
		scrollToSelected();
	};
	const handleIncrement = () => {
		const newValue = Math.min(value + 10, maxValue);
		onChange(newValue);
		scrollToSelected();
	};
	const handleDecrement = () => {
		const newValue = Math.max(value - 10, minValue);
		onChange(newValue);
		scrollToSelected();
	};

	// 드롭다운 값 선택
	const handleValueSelect = (selectedValue: number) => {
		onChange(selectedValue);
		setIsOpen(false);
	};

	// 외부 클릭 시 드롭다운 닫기 & 위치 계산
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			
			// 트리거 또는 드롭다운 내부 클릭이 아닌 경우에만 닫기
			if (
				triggerRef.current && !triggerRef.current.contains(target) &&
				dropdownRef.current && !dropdownRef.current.contains(target)
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			calculateDropdownPosition();
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen]);

	return (
		<div className="flex flex-col items-center">
			<div className="mb-1 text-base font-medium text-gray-700">{label}</div>
			<div className="relative">
				{/* 시간 입력 표시 */}
				<div 
					ref={triggerRef}
					className="neu-flat flex items-center justify-center w-16 h-8 text-base font-medium cursor-pointer"
					onClick={() => setIsOpen(!isOpen)}
				>
					{value.toString().padStart(2, '0')}
				</div>

				{/* 드롭다운 메뉴 */}
				{isOpen && (
					<Portal>
						<div 
							ref={dropdownRef}
							className="neu-elevated fixed z-[9999] p-2 animate-fadeIn"
							style={{
								top: dropdownPosition.top,
								left: dropdownPosition.left,
								backgroundColor: 'hsl(var(--background))',
								border: '1px solid hsl(var(--border))'
							}}
						>
														<div className="flex gap-2">
								{/* 조작 버튼 열 */}
								<div className="flex flex-col justify-between h-48">
									{/* 위쪽 버튼들 */}
									<div className="flex flex-col gap-1">
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleMin();
											}}
											className="neu-raised w-8 h-6 flex items-center justify-center text-sm"
											title={`최소값 (${minValue})`}
										>
											<ChevronsUp size={16} />
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleDecrement();
											}}
											className="neu-raised w-8 h-6 flex items-center justify-center text-sm"
											title="10씩 감소"
										>
											<ChevronUp size={16} />
										</button>
									</div>

									{/* 아래쪽 버튼들 */}
									<div className="flex flex-col gap-1">
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleIncrement();
											}}
											className="neu-raised w-8 h-6 flex items-center justify-center text-sm"
											title="10씩 증가"
										>
											<ChevronDown size={16} />
										</button>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleMax();
											}}
											className="neu-raised w-8 h-6 flex items-center justify-center text-sm"
											title={`최대값 (${maxValue})`}
										>
											<ChevronsDown size={16} />
										</button>
									</div>
								</div>

								{/* 통합된 시간 목록 */}
								<div className="neu-flat overflow-y-auto w-16 max-h-48 field-dropdown-scroll">
									{Array.from({ length: maxValue + 1 }, (_, i) => i).map((val) => (
										<div
											key={val}
											className={`px-2 py-1.5 text-base text-center cursor-pointer transition-colors ${
												val === value 
													? 'font-medium' 
													: ''
											}`}
											style={val === value ? {
												backgroundColor: 'hsl(var(--primary) / 0.1)',
												color: 'hsl(var(--primary))'
											} : {}}
											onMouseEnter={(e) => {
												if (val !== value) {
													e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.3)';
												}
											}}
											onMouseLeave={(e) => {
												if (val !== value) {
													e.currentTarget.style.backgroundColor = '';
												}
											}}
											onClick={(e) => {
												e.stopPropagation();
												handleValueSelect(val);
											}}
											ref={val === value ? selectedRef : null}
										>
											{val.toString().padStart(2, '0')}
										</div>
									))}
								</div>
							</div>
						</div>
					</Portal>
				)}
			</div>
		</div>
	);
}

// #endregion

// #region B 모듈: 시작-종료 시간 UI

interface TimeRangeInputProps {
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
	onStartTimeChange: (hour: number, minute: number) => void;
	onEndTimeChange: (hour: number, minute: number) => void;
}

function TimeRangeInput({ 
	startHour, 
	startMinute, 
	endHour, 
	endMinute, 
	onStartTimeChange, 
	onEndTimeChange 
}: TimeRangeInputProps) {
	return (
		<div className="flex gap-2 items-end">
			{/* 시작시간 */}
			<div className="flex gap-1">
				<TimeInput
					value={startHour}
					onChange={(hour) => onStartTimeChange(hour, startMinute)}
					type="hour"
					label="시간"
				/>
				<TimeInput
					value={startMinute}
					onChange={(minute) => onStartTimeChange(startHour, minute)}
					type="minute"
					label="분"
				/>
			</div>

			{/* 구분자 */}
			<div className="flex justify-center items-center mb-6 w-6 h-6 text-lg font-bold text-gray-500">
				~
			</div>

			{/* 종료시간 */}
			<div className="flex gap-1">
				<TimeInput
					value={endHour}
					onChange={(hour) => onEndTimeChange(hour, endMinute)}
					type="hour"
					label="시간"
				/>
				<TimeInput
					value={endMinute}
					onChange={(minute) => onEndTimeChange(endHour, minute)}
					type="minute"
					label="분"
				/>
			</div>
		</div>
	);
}

// #endregion

// #region C 모듈: 안내 문구 UI

interface TimeInfoProps {
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
}

// 운영 시간 계산 유틸리티
function calculateDuration(startHour: number, startMinute: number, endHour: number, endMinute: number): number {
	const startTotalMinutes = startHour * 60 + startMinute;
	const endTotalMinutes = endHour * 60 + endMinute;
	
	// 익일까지인 경우
	if (startTotalMinutes >= endTotalMinutes) {
		return (24 * 60 - startTotalMinutes) + endTotalMinutes;
	}
	
	// 당일 내인 경우
	return endTotalMinutes - startTotalMinutes;
}

// 당일/익일 여부 판단 유틸리티
function determineDayStatus(startHour: number, startMinute: number, endHour: number, endMinute: number): string {
	const startTotalMinutes = startHour * 60 + startMinute;
	const endTotalMinutes = endHour * 60 + endMinute;
	
	// 자정까지 (종료시간이 00:00)
	if (endHour === 0 && endMinute === 0) {
		return '자정까지';
	}
	
	// 익일까지 (시작시간 >= 종료시간)
	if (startTotalMinutes >= endTotalMinutes) {
		return '익일까지';
	}
	
	// 당일 내에
	return '당일 내에';
}

function TimeInfo({ startHour, startMinute, endHour, endMinute }: TimeInfoProps) {
	const dayStatus = determineDayStatus(startHour, startMinute, endHour, endMinute);
	const durationMinutes = calculateDuration(startHour, startMinute, endHour, endMinute);
	const hours = Math.floor(durationMinutes / 60);
	const minutes = durationMinutes % 60;
	
	const formatDuration = () => {
		if (hours === 0) {
			return `${minutes}분 운영`;
		}
		if (minutes === 0) {
			return `${hours}시간 운영`;
		}
		return `${hours}시간 ${minutes}분 운영`;
	};

	// 상태별 색상 클래스 결정
	const getStatusColor = (status: string) => {
		switch (status) {
			case '당일 내에':
				return 'text-green-600';  // 초록
			case '자정까지':
				return 'text-orange-500'; // 주황
			case '익일까지':
				return 'text-red-500';    // 빨강
			default:
				return 'text-gray-700';
		}
	};

	return (
		<div className="flex flex-col justify-center items-center p-3 bg-gray-50 rounded-lg border border-gray-200 min-w-28">
			<div className={`mb-0.5 text-base font-medium ${getStatusColor(dayStatus)}`}>
				{dayStatus}
			</div>
			<div className="text-sm text-gray-600">
				{formatDuration()}
			</div>
		</div>
	);
}

// #endregion

// #region 메인 컴포넌트: TimeRangeSelector

export interface TimeRangeSelectorProps {
	initialStartHour?: number;
	initialStartMinute?: number;
	initialEndHour?: number;
	initialEndMinute?: number;
	onChange?: (startHour: number, startMinute: number, endHour: number, endMinute: number) => void;
	className?: string;
}

export default function TimeRangeSelector({
	initialStartHour = 9,
	initialStartMinute = 30,
	initialEndHour = 21,
	initialEndMinute = 0,
	onChange,
	className = ''
}: TimeRangeSelectorProps) {
	const [startHour, setStartHour] = useState(initialStartHour);
	const [startMinute, setStartMinute] = useState(initialStartMinute);
	const [endHour, setEndHour] = useState(initialEndHour);
	const [endMinute, setEndMinute] = useState(initialEndMinute);

	const handleStartTimeChange = (hour: number, minute: number) => {
		setStartHour(hour);
		setStartMinute(minute);
		onChange?.(hour, minute, endHour, endMinute);
	};

	const handleEndTimeChange = (hour: number, minute: number) => {
		setEndHour(hour);
		setEndMinute(minute);
		onChange?.(startHour, startMinute, hour, minute);
	};

	return (
		<div className={`flex gap-3 items-center ${className}`}>
			{/* 시간 범위 선택 */}
			<TimeRangeInput
				startHour={startHour}
				startMinute={startMinute}
				endHour={endHour}
				endMinute={endMinute}
				onStartTimeChange={handleStartTimeChange}
				onEndTimeChange={handleEndTimeChange}
			/>

			{/* 안내 정보 */}
			<TimeInfo
				startHour={startHour}
				startMinute={startMinute}
				endHour={endHour}
				endMinute={endMinute}
			/>
		</div>
	);
}

// #endregion

export { TimeInput, TimeRangeInput, TimeInfo }; 
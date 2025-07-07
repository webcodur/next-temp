'use client';

import React, { useState } from 'react';
import { Field } from '@/components/ui/ui-input/field/core/Field';

export default function FieldDatePickerTestPage() {
	
	// 단일 날짜 상태
	const [singleDate, setSingleDate] = useState<Date | null>(null);
	const [dateTimeValue, setDateTimeValue] = useState<Date | null>(null);
	const [timeValue, setTimeValue] = useState<Date | null>(null);
	const [monthValue, setMonthValue] = useState<Date | null>(null);
	
	// 범위 날짜 상태
	const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
	const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);

	// 제한 날짜들
	const today = new Date();
	const nextWeek = new Date();
	nextWeek.setDate(today.getDate() + 7);
	
	const lastWeek = new Date();
	lastWeek.setDate(today.getDate() - 7);

	return (
		<div className="p-6 space-y-8 max-w-4xl mx-auto">
			<div className="neu-flat p-6 rounded-lg">
				<h1 className="text-2xl font-bold mb-2 text-foreground">
					Field DatePicker 테스트
				</h1>
				<p className="text-muted-foreground mb-6">
					다양한 DatePickerType의 Field DatePicker 컴포넌트를 테스트합니다.
				</p>
			</div>

			{/* 단일 날짜 선택기 */}
			<div className="neu-flat p-6 rounded-lg space-y-4">
				<h2 className="text-xl font-semibold text-foreground">단일 날짜 선택기</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field
						type="datepicker"
						label="기본 날짜 선택"
						placeholder="날짜를 선택하세요"
						datePickerType="single"
						value={singleDate}
						onChange={setSingleDate}
					/>

					<Field
						type="datepicker"
						label="제한된 날짜 범위"
						placeholder="지난주부터 다음주까지"
						datePickerType="single"
						value={singleDate}
						onChange={setSingleDate}
						minDate={lastWeek}
						maxDate={nextWeek}
					/>
				</div>

				<div className="p-3 bg-muted/50 rounded text-sm">
					<strong>선택된 날짜:</strong> {singleDate?.toLocaleDateString() || '없음'}
				</div>
			</div>

			{/* 날짜+시간 선택기 */}
			<div className="neu-flat p-6 rounded-lg space-y-4">
				<h2 className="text-xl font-semibold text-foreground">날짜+시간 선택기</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field
						type="datepicker"
						label="날짜와 시간 선택"
						placeholder="날짜와 시간을 선택하세요"
						datePickerType="datetime"
						value={dateTimeValue}
						onChange={setDateTimeValue}
					/>

					<Field
						type="datepicker"
						label="시간만 선택"
						placeholder="시간을 선택하세요"
						datePickerType="time"
						value={timeValue}
						onChange={setTimeValue}
						timeIntervals={15}
					/>
				</div>

				<div className="p-3 bg-muted/50 rounded text-sm space-y-1">
					<div><strong>날짜+시간:</strong> {dateTimeValue?.toLocaleString() || '없음'}</div>
					<div><strong>시간만:</strong> {timeValue?.toLocaleTimeString() || '없음'}</div>
				</div>
			</div>

			{/* 월 선택기 */}
			<div className="neu-flat p-6 rounded-lg space-y-4">
				<h2 className="text-xl font-semibold text-foreground">월 선택기</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field
						type="datepicker"
						label="월 선택"
						placeholder="년월을 선택하세요"
						datePickerType="month"
						value={monthValue}
						onChange={setMonthValue}
					/>
				</div>

				<div className="p-3 bg-muted/50 rounded text-sm">
					<strong>선택된 월:</strong> {monthValue ? 
						`${monthValue.getFullYear()}년 ${monthValue.getMonth() + 1}월` : '없음'}
				</div>
			</div>

			{/* 범위 선택기 */}
			<div className="neu-flat p-6 rounded-lg space-y-4">
				<h2 className="text-xl font-semibold text-foreground">날짜 범위 선택기</h2>
				
				<Field
					type="datepicker"
					label="날짜 범위 선택"
					placeholder="시작일과 종료일을 선택하세요"
					datePickerType="range"
					startDate={rangeStartDate}
					endDate={rangeEndDate}
					onStartDateChange={setRangeStartDate}
					onEndDateChange={setRangeEndDate}
				/>

				<div className="p-3 bg-muted/50 rounded text-sm space-y-1">
					<div><strong>시작일:</strong> {rangeStartDate?.toLocaleDateString() || '없음'}</div>
					<div><strong>종료일:</strong> {rangeEndDate?.toLocaleDateString() || '없음'}</div>
					<div><strong>기간:</strong> {
						rangeStartDate && rangeEndDate ? 
						`${Math.ceil((rangeEndDate.getTime() - rangeStartDate.getTime()) / (1000 * 60 * 60 * 24))}일` : 
						'계산불가'
					}</div>
				</div>
			</div>

			{/* 비활성화 상태 */}
			<div className="neu-flat p-6 rounded-lg space-y-4">
				<h2 className="text-xl font-semibold text-foreground">비활성화 상태</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field
						type="datepicker"
						label="비활성화된 날짜 선택기"
						placeholder="선택 불가"
						datePickerType="single"
						value={singleDate}
						onChange={setSingleDate}
						disabled={true}
					/>

					<Field
						type="datepicker"
						label="비활성화된 범위 선택기"
						placeholder="선택 불가"
						datePickerType="range"
						startDate={rangeStartDate}
						endDate={rangeEndDate}
						onStartDateChange={setRangeStartDate}
						onEndDateChange={setRangeEndDate}
						disabled={true}
					/>
				</div>
			</div>

			{/* 커스텀 포맷 */}
			<div className="neu-flat p-6 rounded-lg space-y-4">
				<h2 className="text-xl font-semibold text-foreground">커스텀 포맷</h2>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field
						type="datepicker"
						label="한국식 날짜 포맷"
						placeholder="년-월-일"
						datePickerType="single"
						value={singleDate}
						onChange={setSingleDate}
						dateFormat="yyyy년 MM월 dd일"
					/>

					<Field
						type="datepicker"
						label="미국식 날짜 포맷"
						placeholder="mm/dd/yyyy"
						datePickerType="single"
						value={singleDate}
						onChange={setSingleDate}
						dateFormat="MM/dd/yyyy"
					/>
				</div>
			</div>
		</div>
	);
} 
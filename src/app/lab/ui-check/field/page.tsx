'use client';

import { useState } from 'react';
import {
	FieldText,
	FieldSelect,
	FieldSortSelect,
	FieldDatePicker,
	Option,
	SortDirection,
} from '@/components/ui/field';

export default function FieldPage() {
	const [textValue, setTextValue] = useState('');
	const [selectValue, setSelectValue] = useState('');
	const [sortValue, setSortValue] = useState('');

	// 정렬 방향 상태 추가
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

	// #region DatePicker 상태들
	const [singleDate, setSingleDate] = useState<Date | null>(null);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [dateTimeValue, setDateTimeValue] = useState<Date | null>(null);
	const [monthValue, setMonthValue] = useState<Date | null>(null);
	// #endregion

	const tagOptions: Option[] = [
		{ value: 'design', label: '디자인' },
		{ value: 'development', label: '개발' },
		{ value: 'marketing', label: '마케팅' },
		{ value: 'planning', label: '기획' },
		{ value: 'hr', label: '인사' },
		{ value: 'finance', label: '재무' },
		{ value: 'operations', label: '운영' },
	];

	const sortOptions: Option[] = [
		{ value: 'name', label: '이름순' },
		{ value: 'date', label: '날짜순' },
		{ value: 'priority', label: '우선순위' },
		{ value: 'status', label: '상태순' },
	];

	return (
		<div className="container p-6 mx-auto">
			<h1 className="mb-6 text-2xl font-bold">Field 컴포넌트 테스트</h1>
			<p className="mb-8 text-gray-600">
				타이틀 없는 간소화된 텍스트 입력, 기본 셀렉트박스, 날짜선택 테스트
			</p>

			<div className="p-6 mx-auto max-w-2xl">
				<div className="space-y-8">
					{/* #region 기존 필드들 */}
					<section>
						<h2 className="mb-4 text-lg font-semibold">기본 필드</h2>
						<div className="space-y-4">
							{/* 텍스트 필드 */}
							<FieldText
								label="사용자 이름"
								placeholder="텍스트 입력"
								value={textValue}
								onChange={setTextValue}
							/>

							{/* 기본 셀렉트 */}
							<FieldSelect
								label="소속 부서"
								placeholder="부서 선택"
								options={tagOptions}
								value={selectValue}
								onChange={setSelectValue}
							/>

							{/* 정렬 셀렉트 */}
							<FieldSortSelect
								label="정렬 방식"
								placeholder="정렬 기준 선택"
								options={sortOptions}
								value={sortValue}
								onChange={setSortValue}
								sortDirection={sortDirection}
								onSortDirectionChange={setSortDirection}
							/>
						</div>
					</section>
					{/* #endregion */}

					{/* #region DatePicker 필드들 */}
					<section>
						<h2 className="mb-4 text-lg font-semibold">날짜 선택 필드</h2>
						<div className="space-y-4">
							{/* 단일 날짜 선택 */}
							<FieldDatePicker
								label="이벤트 날짜"
								datePickerType="single"
								placeholder="날짜 선택"
								value={singleDate}
								onChange={setSingleDate}
							/>

							{/* 날짜 범위 선택 */}
							<FieldDatePicker
								label="기간 설정"
								datePickerType="range"
								startDate={startDate}
								endDate={endDate}
								onStartDateChange={setStartDate}
								onEndDateChange={setEndDate}
							/>

							{/* 날짜 + 시간 선택 */}
							<FieldDatePicker
								label="예약 일시"
								datePickerType="datetime"
								placeholder="날짜 시간 선택"
								value={dateTimeValue}
								onChange={setDateTimeValue}
								timeIntervals={15}
							/>

							{/* 월별 선택 */}
							<FieldDatePicker
								label="보고서 월"
								datePickerType="month"
								placeholder="월 선택"
								value={monthValue}
								onChange={setMonthValue}
							/>
						</div>
					</section>
					{/* #endregion */}
				</div>
			</div>
		</div>
	);
}

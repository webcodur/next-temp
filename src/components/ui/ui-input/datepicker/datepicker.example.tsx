'use client';

import * as React from 'react';
import {
	PickDate,
	PickDateRange,
	PickTime,
	PickMonth,
	PickTimeRange2,
} from './Datepicker';

export default function DatepickerExample() {
	// PickDate 관련 상태
	const [singleDate, setSingleDate] = React.useState<Date | null>(null);
	const [dateWithTime, setDateWithTime] = React.useState<Date | null>(null);

	// PickDateRange 관련 상태
	const [dateRange, setDateRange] = React.useState<[Date | null, Date | null]>([null, null]);
	const [startDate, endDate] = dateRange;

	// PickTime 관련 상태
	const [timeOnly, setTimeOnly] = React.useState<Date | null>(null);

	// PickMonth 관련 상태
	const [monthOnly, setMonthOnly] = React.useState<Date | null>(null);

	// PickTimeRange2 관련 상태
	const [timeRange2, setTimeRange2] = React.useState({
		startHour: 9,
		startMinute: 30,
		endHour: 18,
		endMinute: 0
	});

	return (
		<div className="container py-10">
			<h1 className="mb-8 text-3xl font-bold">데이트피커 컴포넌트 예제</h1>

			<div className="space-y-12">
				{/* PickDate 섹션 */}
				<section className="p-6 rounded-lg border">
					<h2 className="mb-6 text-2xl font-semibold text-blue-600">PickDate - 단일 날짜 선택</h2>
					
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* 기본 날짜 선택 */}
						<div>
							<h3 className="mb-2 font-medium">기본 날짜 선택</h3>
							<PickDate
								selected={singleDate}
								onChange={setSingleDate}
								placeholderText="날짜를 선택하세요"
							/>
							<p className="mt-1 text-sm text-gray-600">
								선택된 날짜: {singleDate ? singleDate.toLocaleDateString() : '없음'}
							</p>
						</div>

						{/* 날짜 + 시간 */}
						<div>
							<h3 className="mb-2 font-medium">날짜 + 시간 선택</h3>
							<PickDate
								selected={dateWithTime}
								onChange={setDateWithTime}
								dateFormat="yyyy-MM-dd HH:mm"
								placeholderText="날짜와 시간을 선택하세요"
								showTimeSelect={true}
							/>
							<p className="mt-1 text-sm text-gray-600">
								선택된 날짜시간: {dateWithTime ? dateWithTime.toLocaleString() : '없음'}
							</p>
						</div>
					</div>
				</section>

				{/* PickDateRange 섹션 */}
				<section className="p-6 rounded-lg border">
					<h2 className="mb-6 text-2xl font-semibold text-green-600">PickDateRange - 날짜 범위 선택</h2>
					
					<div>
						<h3 className="mb-2 font-medium">날짜 범위 선택</h3>
						<PickDateRange
							startDate={startDate}
							endDate={endDate}
							onChange={setDateRange}
							placeholderText="날짜 범위를 선택하세요"
						/>
						<p className="mt-1 text-sm text-gray-600">
							선택된 범위: {startDate ? startDate.toLocaleDateString() : '없음'} ~ {endDate ? endDate.toLocaleDateString() : '없음'}
						</p>
					</div>
				</section>

				{/* PickTime 섹션 */}
				<section className="p-6 rounded-lg border">
					<h2 className="mb-6 text-2xl font-semibold text-purple-600">PickTime - 시간 선택</h2>
					
					<div>
						<h3 className="mb-2 font-medium">시간 선택</h3>
						<PickTime
							selected={timeOnly}
							onChange={setTimeOnly}
							placeholderText="시간을 선택하세요"
						/>
						<p className="mt-1 text-sm text-gray-600">
							선택된 시간: {timeOnly ? timeOnly.toLocaleTimeString('ko-KR', { 
								hour: '2-digit', 
								minute: '2-digit',
								hour12: false 
							}) : '없음'}
						</p>
					</div>
				</section>

				{/* PickMonth 섹션 */}
				<section className="p-6 rounded-lg border">
					<h2 className="mb-6 text-2xl font-semibold text-orange-600">PickMonth - 년월 선택</h2>
					
					<div>
						<h3 className="mb-2 font-medium">년월 선택</h3>
						<PickMonth
							selected={monthOnly}
							onChange={setMonthOnly}
							placeholderText="년월을 선택하세요"
						/>
						<p className="mt-1 text-sm text-gray-600">
							선택된 년월: {monthOnly ? monthOnly.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : '없음'}
						</p>
					</div>
				</section>

				{/* PickTimeRange2 섹션 */}
				<section className="p-6 rounded-lg border">
					<h2 className="mb-6 text-2xl font-semibold text-red-600">PickTimeRange2 - 24시간제 시간 범위 선택기</h2>
					
					<div>
						<h3 className="mb-2 font-medium">24시간제 시간 범위 선택 (드롭다운 + 조작버튼)</h3>
						<PickTimeRange2
							initialStartHour={timeRange2.startHour}
							initialStartMinute={timeRange2.startMinute}
							initialEndHour={timeRange2.endHour}
							initialEndMinute={timeRange2.endMinute}
							onChange={(startHour, startMinute, endHour, endMinute) => {
								setTimeRange2({ startHour, startMinute, endHour, endMinute });
							}}
						/>
					</div>
				</section>

				{/* 사용법 안내 */}
				<section className="p-6 bg-gray-50 rounded-lg">
					<h2 className="mb-4 text-xl font-semibold">사용법</h2>
					<div className="space-y-2 text-sm">
						<div><code className="px-2 py-1 bg-gray-200 rounded">{'<PickDate />'}</code> - 단일 날짜 선택, 날짜+시간 선택 가능</div>
						<div><code className="px-2 py-1 bg-gray-200 rounded">{'<PickDateRange />'}</code> - 시작일과 종료일 범위 선택</div>
						<div><code className="px-2 py-1 bg-gray-200 rounded">{'<PickTime />'}</code> - 시간만 선택 (날짜 없이)</div>
						<div><code className="px-2 py-1 bg-gray-200 rounded">{'<PickMonth />'}</code> - 년월만 선택 (일자 없이)</div>
						<div><code className="px-2 py-1 bg-gray-200 rounded">{'<PickTimeRange2 />'}</code> - 24시간제 시간 범위 선택 (드롭다운 + 조작버튼)</div>
					</div>
				</section>
			</div>
		</div>
	);
} 
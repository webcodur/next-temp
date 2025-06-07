'use client';

import * as React from 'react';
import {
	SingleDatePicker,
	DateRangePicker,
} from '@/components/ui/datepicker/Datepicker';

export default function DatepickerPage() {
	const [startDate, setStartDate] = React.useState<Date | null>(null);
	const [endDate, setEndDate] = React.useState<Date | null>(null);

	const [singleDate, setSingleDate] = React.useState<Date | null>(null);
	const [dateTimeValue, setDateTimeValue] = React.useState<Date | null>(null);

	return (
		<div className="container py-10">
			<h1 className="mb-8 text-3xl font-bold">Datepicker 연구 페이지 ✅</h1>

			<div className="space-y-10">
				{/* 기본 DatePicker */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold">기본 DatePicker</h2>
					<div className="flex flex-col space-y-4">
						<div>
							<p className="mb-2 font-medium">단일 날짜 선택</p>
							<SingleDatePicker
								selected={singleDate}
								onChange={setSingleDate}
							/>
							<p className="mt-2 text-sm text-gray-600">
								선택된 날짜:{' '}
								{singleDate ? singleDate.toLocaleDateString() : '없음'}
							</p>
						</div>
					</div>
				</section>

				{/* 날짜 범위 선택 */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold">날짜 범위 선택</h2>
					<div>
						<p className="mb-2 font-medium">시작일과 종료일 선택</p>
						<DateRangePicker
							startDate={startDate}
							endDate={endDate}
							onStartDateChange={setStartDate}
							onEndDateChange={setEndDate}
						/>
						<p className="mt-2 text-sm text-gray-600">
							선택된 기간: {startDate ? startDate.toLocaleDateString() : '없음'}{' '}
							~ {endDate ? endDate.toLocaleDateString() : '없음'}
						</p>
					</div>
				</section>

				{/* 날짜 및 시간 선택 */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold">날짜 및 시간 선택</h2>
					<div>
						<p className="mb-2 font-medium">날짜와 시간 함께 선택</p>
						<SingleDatePicker
							selected={dateTimeValue}
							onChange={setDateTimeValue}
							showTimeSelect={true}
							dateFormat="yyyy-MM-dd HH:mm"
							timeFormat="HH:mm"
							timeIntervals={15}
						/>
						<p className="mt-2 text-sm text-gray-600">
							선택된 날짜/시간:{' '}
							{dateTimeValue ? dateTimeValue.toLocaleString() : '없음'}
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}

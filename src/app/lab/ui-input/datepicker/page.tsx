'use client';

import * as React from 'react';
import {
	SingleDatePicker,
	DateRangePicker,
	TimeOnlyPicker,
} from '@/components/ui/ui-input/datepicker/Datepicker';
import { useTranslations } from '@/hooks/useI18n';

export default function DatepickerPage() {
	const t = useTranslations();
	
	const [startDate, setStartDate] = React.useState<Date | null>(null);
	const [endDate, setEndDate] = React.useState<Date | null>(null);

	const [singleDate, setSingleDate] = React.useState<Date | null>(null);
	const [dateTimeValue, setDateTimeValue] = React.useState<Date | null>(null);
	const [monthYearDate, setMonthYearDate] = React.useState<Date | null>(null);
	const [timeOnlyValue, setTimeOnlyValue] = React.useState<Date | null>(null);
	const [workTimeValue, setWorkTimeValue] = React.useState<Date | null>(null);

	return (
		<div className="container py-10">
			<h1 className="mb-8 text-3xl font-bold font-multilang">{t('날짜선택_제목')}</h1>

			<div className="space-y-10">
				{/* 기본 DatePicker */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold font-multilang">{t('날짜선택_기본DatePicker')}</h2>
					<div className="flex flex-col space-y-4">
						<div>
							<p className="mb-2 font-medium font-multilang">{t('날짜선택_단일날짜선택')}</p>
							<SingleDatePicker
								selected={singleDate}
								onChange={setSingleDate}
							/>
							<p className="mt-2 text-sm text-gray-600 font-multilang">
								{t('날짜선택_선택된날짜')}:{' '}
								{singleDate ? singleDate.toLocaleDateString() : t('날짜선택_없음')}
							</p>
						</div>
					</div>
				</section>

				{/* 날짜 범위 선택 */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold font-multilang">{t('날짜선택_날짜범위선택')}</h2>
					<div>
						<p className="mb-2 font-medium font-multilang">{t('날짜선택_시작일종료일선택')}</p>
						<DateRangePicker
							startDate={startDate}
							endDate={endDate}
							onStartDateChange={setStartDate}
							onEndDateChange={setEndDate}
						/>
						<p className="mt-2 text-sm text-gray-600 font-multilang">
							{t('날짜선택_선택된기간')}: {startDate ? startDate.toLocaleDateString() : t('날짜선택_없음')}{' '}
							~ {endDate ? endDate.toLocaleDateString() : t('날짜선택_없음')}
						</p>
					</div>
				</section>

				{/* 날짜 및 시간 선택 */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold font-multilang">{t('날짜선택_날짜시간선택')}</h2>
					<div>
						<p className="mb-2 font-medium font-multilang">{t('날짜선택_날짜시간함께선택')}</p>
						<SingleDatePicker
							selected={dateTimeValue}
							onChange={setDateTimeValue}
							showTimeSelect={true}
							dateFormat="yyyy-MM-dd HH:mm"
							timeFormat="HH:mm"
							timeIntervals={15}
						/>
						<p className="mt-2 text-sm text-gray-600 font-multilang">
							{t('날짜선택_선택된날짜시간')}:{' '}
							{dateTimeValue ? dateTimeValue.toLocaleString() : t('날짜선택_없음')}
						</p>
					</div>
				</section>

				{/* 시간 전용 선택기 */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold font-multilang">{t('날짜선택_시간전용선택기')}</h2>
					<div className="flex flex-col space-y-6">
						<div>
							<p className="mb-2 font-medium font-multilang">{t('날짜선택_기본시간선택')}</p>
							<TimeOnlyPicker
								selected={timeOnlyValue}
								onChange={setTimeOnlyValue}
							/>
							<p className="mt-2 text-sm text-gray-600 font-multilang">
								{t('날짜선택_선택된시간')}:{' '}
								{timeOnlyValue ? timeOnlyValue.toLocaleTimeString('ko-KR', { 
									hour: '2-digit', 
									minute: '2-digit',
									hour12: false 
								}) : t('날짜선택_없음')}
							</p>
						</div>

						<div>
							<p className="mb-2 font-medium font-multilang">{t('날짜선택_근무시간선택')}</p>
							<TimeOnlyPicker
								selected={workTimeValue}
								onChange={setWorkTimeValue}
								timeIntervals={15}
								placeholderText={t('날짜선택_근무시간선택플레이스홀더')}
								minTime={new Date(new Date().setHours(9, 0, 0, 0))}
								maxTime={new Date(new Date().setHours(18, 0, 0, 0))}
							/>
							<p className="mt-2 text-sm text-gray-600 font-multilang">
								{t('날짜선택_선택된근무시간')}:{' '}
								{workTimeValue ? workTimeValue.toLocaleTimeString('ko-KR', { 
									hour: '2-digit', 
									minute: '2-digit',
									hour12: false 
								}) : t('날짜선택_없음')}
							</p>
						</div>
					</div>
				</section>

				{/* 월별 선택 */}
				<section>
					<h2 className="mb-4 text-2xl font-semibold font-multilang">{t('날짜선택_월별선택')}</h2>
					<div className="flex flex-col space-y-6">
						<div>
							<p className="mb-2 font-medium font-multilang">{t('날짜선택_월단위선택')}</p>
							<SingleDatePicker
								selected={monthYearDate}
								onChange={setMonthYearDate}
								showMonthYearPicker={true}
								dateFormat="yyyy년 MM월"
							/>
							<p className="mt-2 text-sm text-gray-600 font-multilang">
								{t('날짜선택_선택된월')}:{' '}
								{monthYearDate ? monthYearDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : t('날짜선택_없음')}
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

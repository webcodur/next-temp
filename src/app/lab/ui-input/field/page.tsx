'use client';

import { useState } from 'react';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldPassword from '@/components/ui/ui-input/field/text/FieldPassword';
import FieldEmail from '@/components/ui/ui-input/field/text/FieldEmail';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import { FieldSortSelect } from '@/components/ui/ui-input/field/select/FieldSortSelect';
import FieldDatePicker from '@/components/ui/ui-input/field/datepicker/FieldDatePicker';
import { Option, SortDirection } from '@/components/ui/ui-input/field/core/types';
import { useTranslations } from '@/hooks/useI18n';

export default function FieldPage() {
	const t = useTranslations();
	const [textValue, setTextValue] = useState('');
	const [passwordValue, setPasswordValue] = useState('');
	const [emailValue, setEmailValue] = useState('');
	const [selectValue, setSelectValue] = useState('');
	const [sortValue, setSortValue] = useState('');

	// 정렬 방향 상태 추가
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

	// #region DatePicker 상태들
	const [singleDate, setSingleDate] = useState<string>('');
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [dateTimeValue, setDateTimeValue] = useState<string>('');
	const [monthValue, setMonthValue] = useState<string>('');
	// #endregion

	const tagOptions: Option[] = [
		{ value: 'design', label: t('필드테스트_부서_디자인팀') },
		{ value: 'development', label: t('필드테스트_부서_개발팀') },
		{ value: 'frontend', label: t('필드테스트_부서_프론트엔드팀') },
		{ value: 'backend', label: t('필드테스트_부서_백엔드팀') },
		{ value: 'devops', label: t('필드테스트_부서_DevOps팀') },
		{ value: 'qa', label: t('필드테스트_부서_QA팀') },
		{ value: 'marketing', label: t('필드테스트_부서_마케팅팀') },
		{ value: 'planning', label: t('필드테스트_부서_기획팀') },
		{ value: 'product', label: t('필드테스트_부서_프로덕트팀') },
		{ value: 'hr', label: t('필드테스트_부서_인사팀') },
		{ value: 'finance', label: t('필드테스트_부서_재무팀') },
		{ value: 'operations', label: t('필드테스트_부서_운영팀') },
		{ value: 'sales', label: t('필드테스트_부서_영업팀') },
		{ value: 'support', label: t('필드테스트_부서_고객지원팀') },
		{ value: 'security', label: t('필드테스트_부서_보안팀') },
		{ value: 'legal', label: t('필드테스트_부서_법무팀') },
		{ value: 'data', label: t('필드테스트_부서_데이터팀') },
		{ value: 'research', label: t('필드테스트_부서_연구개발팀') },
	];

	const sortOptions: Option[] = [
		{ value: 'name', label: t('필드테스트_정렬_이름순') },
		{ value: 'date', label: t('필드테스트_정렬_날짜순') },
		{ value: 'priority', label: t('필드테스트_정렬_우선순위') },
		{ value: 'status', label: t('필드테스트_정렬_상태순') },
		{ value: 'department', label: t('필드테스트_정렬_부서순') },
		{ value: 'position', label: t('필드테스트_정렬_직급순') },
		{ value: 'salary', label: t('필드테스트_정렬_연봉순') },
		{ value: 'experience', label: t('필드테스트_정렬_경력순') },
		{ value: 'rating', label: t('필드테스트_정렬_평점순') },
		{ value: 'performance', label: t('필드테스트_정렬_성과순') },
	];

	return (
		<div className="container p-6 mx-auto">
			<h1 className="mb-6 text-2xl font-bold">{t('필드테스트_제목')}</h1>
			<p className="mb-8 text-gray-600">
				{t('필드테스트_설명')}
			</p>

			<div className="p-6 mx-auto max-w-2xl">
				<div className="space-y-8">
					{/* #region 기존 필드들 */}
					<section>
						<h2 className="mb-4 text-lg font-semibold">{t('필드테스트_기본필드')}</h2>
						<div className="space-y-4">
							{/* 텍스트 필드 */}
							<FieldText
								id="username"
								label={t('필드테스트_사용자이름')}
								placeholder={t('필드테스트_텍스트입력')}
								value={textValue}
								onChange={setTextValue}
							/>

							{/* 검색 필드 */}
							<FieldText
								id="search"
								label={t('필드테스트_검색어')}
								placeholder={t('필드테스트_검색어입력')}
								value={textValue}
								onChange={setTextValue}
								showSearchIcon={true}
							/>

							{/* 비밀번호 필드 */}
							<FieldPassword
								id="password"
								label={t('필드테스트_비밀번호')}
								placeholder={t('필드테스트_비밀번호입력')}
								value={passwordValue}
								onChange={setPasswordValue}
							/>

							{/* 이메일 필드 */}
							<FieldEmail
								id="email"
								label={t('필드테스트_이메일주소')}
								placeholder={t('필드테스트_이메일입력')}
								value={emailValue}
								onChange={setEmailValue}
								showValidation={true}
							/>

							{/* 기본 셀렉트 */}
							<FieldSelect
								id="department"
								label={t('필드테스트_소속부서')}
								placeholder={t('필드테스트_부서선택')}
								options={tagOptions}
								value={selectValue}
								onChange={setSelectValue}
							/>

							{/* 정렬 셀렉트 */}
							<FieldSortSelect
								label={t('필드테스트_정렬방식')}
								placeholder={t('필드테스트_정렬기준선택')}
								options={sortOptions}
								value={sortValue}
								onChange={setSortValue}
								sortDirection={sortDirection}
								onSortDirectionChange={setSortDirection}
								maxHeight={120}
							/>
						</div>
					</section>
					{/* #endregion */}

					{/* #region DatePicker 필드들 */}
					<section>
						<h2 className="mb-4 text-lg font-semibold">{t('필드테스트_날짜선택필드')}</h2>
						<div className="space-y-4">
							{/* 단일 날짜 선택 */}
							<FieldDatePicker
								id="event-date"
								label={t('필드테스트_이벤트날짜')}
								type="date"
								placeholder={t('필드테스트_날짜선택')}
								value={singleDate}
								onChange={setSingleDate}
							/>

							{/* 시작 날짜 */}
							<FieldDatePicker
								id="start-date"
								label={t('필드테스트_시작날짜')}
								type="date"
								value={startDate}
								onChange={setStartDate}
							/>

							{/* 종료 날짜 */}
							<FieldDatePicker
								id="end-date"
								label={t('필드테스트_종료날짜')}
								type="date"
								value={endDate}
								onChange={setEndDate}
							/>

							{/* 날짜 + 시간 선택 */}
							<FieldDatePicker
								id="datetime"
								label={t('필드테스트_예약일시')}
								type="datetime-local"
								placeholder={t('필드테스트_날짜시간선택')}
								value={dateTimeValue}
								onChange={setDateTimeValue}
							/>

							{/* 월별 선택 */}
							<FieldDatePicker
								id="month"
								label={t('필드테스트_보고서월')}
								type="month"
								placeholder={t('필드테스트_월선택')}
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

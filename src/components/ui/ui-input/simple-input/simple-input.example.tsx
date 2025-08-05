'use client';

import { useState } from 'react';
import { SimpleCheckbox } from './SimpleCheckbox';
import { SimpleCheckboxGroup } from './SimpleCheckboxGroup';
import { SimpleToggleButton } from './SimpleToggleButton';
import { SimpleToggleSwitch } from './SimpleToggleSwitch';
import { SimpleRadioGroup } from './SimpleRadioGroup';
import { SimpleDropdown } from './SimpleDropdown';
import { SimpleTextInput } from './SimpleTextInput';
import { SimpleTextArea } from './SimpleTextArea';
import { SimpleDatePicker } from './SimpleDatePicker';
import { SimpleTimePicker } from './SimpleTimePicker';
import { SimpleDateRangePicker } from './SimpleDateRangePicker';
import { SimpleMonthPicker } from './SimpleMonthPicker';
import { useTranslations } from '@/hooks/useI18n';

export default function SimpleInputExample() {
	const t = useTranslations();
	
	const [checkboxStates, setCheckboxStates] = useState({
		notifications: true,
		emailAlerts: false,
		smsAlerts: true,
		pushNotifications: false,
		marketing: false,
	});

	const [switchValue, setSwitchValue] = useState(false);
	const [toggleButtonValue, setToggleButtonValue] = useState(false);
	const [radioValue, setRadioValue] = useState('design');
	const [checkboxGroupValue, setCheckboxGroupValue] = useState(['notifications']);
	const [dropdownValue, setDropdownValue] = useState('');
	const [textValue, setTextValue] = useState('');
	const [emailValue, setEmailValue] = useState('');
	const [textAreaValue, setTextAreaValue] = useState('');
	const [dateValue, setDateValue] = useState<Date | null>(null);
	const [timeValue, setTimeValue] = useState<Date | null>(null);
	const [dateRangeValue, setDateRangeValue] = useState<[Date | null, Date | null]>([null, null]);
	const [monthValue, setMonthValue] = useState<Date | null>(null);

	const checkboxOptions = [
		{ key: 'notifications', label: t('간단입력_알림받기') },
		{ key: 'emailAlerts', label: t('간단입력_이메일알림') },
		{ key: 'smsAlerts', label: t('간단입력_SMS알림') },
		{ key: 'pushNotifications', label: t('간단입력_푸시알림') },
		{ key: 'marketing', label: t('간단입력_마케팅정보수신') },
	];

	const radioOptions = [
		{ value: 'design', label: t('간단입력_디자인') },
		{ value: 'development', label: t('간단입력_개발') },
		{ value: 'marketing', label: t('간단입력_마케팅') },
		{ value: 'planning', label: t('간단입력_기획') },
		{ value: 'hr', label: t('간단입력_인사') },
		{ value: 'finance', label: t('간단입력_재무') },
	];

	const dropdownOptions = [
		{ value: 'option1', label: t('간단입력_옵션1') },
		{ value: 'option2', label: t('간단입력_옵션2') },
		{ value: 'option3', label: t('간단입력_옵션3') },
		{ value: 'option4', label: t('간단입력_옵션4') },
		{ value: 'option5', label: t('간단입력_옵션5') },
	];

	const handleCheckboxChange = (key: string, checked: boolean) => {
		setCheckboxStates((prev) => ({
			...prev,
			[key]: checked,
		}));
	};

	return (
		<div className="container p-6 mx-auto">
			<h1 className="mb-8 text-2xl font-bold font-multilang">{t('간단입력_제목')}</h1>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{/* 체크박스 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">{t('간단입력_체크박스')}</h2>
					<div className="space-y-6">
						<div className="space-y-4">
							{checkboxOptions.map((option) => (
								<SimpleCheckbox
									key={option.key}
									label={option.label}
									checked={
										checkboxStates[option.key as keyof typeof checkboxStates]
									}
									onChange={(checked: boolean) =>
										handleCheckboxChange(option.key, checked)
									}
								/>
							))}
						</div>

						<SimpleCheckboxGroup
							label={t('간단입력_세로체크박스그룹')}
							options={checkboxOptions.map(option => ({
								value: option.key,
								label: option.label
							}))}
							value={checkboxGroupValue}
							onChange={setCheckboxGroupValue}
							layout="vertical"
						/>

						<SimpleCheckboxGroup
							label={t('간단입력_가로체크박스그룹')}
							options={checkboxOptions.slice(0, 3).map(option => ({
								value: option.key,
								label: option.label
							}))}
							value={checkboxGroupValue}
							onChange={setCheckboxGroupValue}
							layout="horizontal"
						/>
					</div>
				</div>

				{/* 라디오 그룹 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">{t('간단입력_라디오그룹')}</h2>
					<div className="space-y-6">
						<SimpleRadioGroup
							label={t('간단입력_수직라디오그룹')}
							options={radioOptions.slice(0, 4)}
							value={radioValue}
							onChange={setRadioValue}
							layout="vertical"
						/>

						<SimpleRadioGroup
							label={t('간단입력_수평라디오그룹')}
							options={radioOptions.slice(0, 3)}
							value={radioValue}
							onChange={setRadioValue}
							layout="horizontal"
						/>
					</div>
				</div>

				{/* 토글 스위치 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">{t('간단입력_토글스위치')}</h2>
					<div className="space-y-6">
						<SimpleToggleSwitch
							label={t('간단입력_기본토글스위치')}
							checked={switchValue}
							onChange={setSwitchValue}
						/>

						<SimpleToggleSwitch
							label={t('간단입력_Small토글스위치')}
							checked={switchValue}
							onChange={setSwitchValue}
							size="sm"
						/>

						<SimpleToggleSwitch
							label={t('간단입력_Medium토글스위치')}
							checked={switchValue}
							onChange={setSwitchValue}
							size="md"
						/>

						<SimpleToggleSwitch
							label={t('간단입력_Large토글스위치')}
							checked={switchValue}
							onChange={setSwitchValue}
							size="lg"
						/>
					</div>
				</div>

				{/* 토글 버튼 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">{t('간단입력_토글버튼')}</h2>
					<div className="space-y-6">
						<SimpleToggleButton
							label={t('간단입력_기본토글버튼')}
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="default"
							size="md"
						/>

						<SimpleToggleButton
							label={t('간단입력_아웃라인토글버튼')}
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="default"
							size="md"
						/>

						<SimpleToggleButton
							label={t('간단입력_고스트토글버튼')}
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="ghost"
							size="md"
						/>

						<SimpleToggleButton
							label={t('간단입력_Small토글버튼')}
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="default"
							size="sm"
						/>

						<SimpleToggleButton
							label={t('간단입력_Large토글버튼')}
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="default"
							size="lg"
						/>
					</div>
				</div>

				{/* 드롭다운 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">{t('간단입력_드롭다운')}</h2>
					<div className="space-y-6">
						<SimpleDropdown
							label={t('간단입력_기본드롭다운')}
							options={dropdownOptions}
							value={dropdownValue}
							onChange={setDropdownValue}
							placeholder={t('간단입력_선택하세요')}
						/>

						<SimpleDropdown
							label={t('간단입력_비활성화드롭다운')}
							options={dropdownOptions.slice(0, 3)}
							value={dropdownValue}
							onChange={setDropdownValue}
							disabled={true}
						/>
					</div>
				</div>

				{/* 텍스트 입력 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">텍스트 입력</h2>
					<div className="space-y-6">
						<SimpleTextInput
							label="기본 텍스트 입력"
							value={textValue}
							onChange={setTextValue}
							placeholder="텍스트를 입력하세요"
						/>

						<SimpleTextInput
							label="이메일 입력"
							type="email"
							value={emailValue}
							onChange={setEmailValue}
							placeholder="이메일을 입력하세요"
						/>

						<SimpleTextInput
							label="비활성화된 입력"
							value="수정할 수 없음"
							onChange={setTextValue}
							disabled={true}
						/>
					</div>
				</div>

				{/* 텍스트 영역 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">텍스트 영역</h2>
					<div className="space-y-6">
						<SimpleTextArea
							label="기본 텍스트 영역"
							value={textAreaValue}
							onChange={setTextAreaValue}
							placeholder="여러 줄의 텍스트를 입력하세요"
							rows={4}
						/>

						<SimpleTextArea
							label="글자 수 제한 텍스트 영역"
							value={textAreaValue}
							onChange={setTextAreaValue}
							placeholder="최대 200자까지 입력 가능"
							maxLength={200}
							showCharCount={true}
							rows={6}
						/>

						<SimpleTextArea
							label="크기 조절 불가 텍스트 영역"
							value={textAreaValue}
							onChange={setTextAreaValue}
							placeholder="크기 조절이 불가능한 텍스트 영역"
							resize="none"
							rows={3}
						/>

						<SimpleTextArea
							label="비활성화된 텍스트 영역"
							value="이 텍스트는 수정할 수 없습니다"
							onChange={setTextAreaValue}
							disabled={true}
							rows={2}
						/>
					</div>
				</div>

				{/* 날짜/시간 선택기 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">날짜/시간 선택기</h2>
					<div className="space-y-6">
						<SimpleDatePicker
							label="기본 날짜 선택기"
							value={dateValue}
							onChange={setDateValue}
							placeholder="날짜를 선택하세요"
						/>

						<SimpleTimePicker
							label="시간 선택기"
							value={timeValue}
							onChange={setTimeValue}
							placeholder="시간을 선택하세요"
							timeIntervals={15}
						/>

						<SimpleDateRangePicker
							label="날짜 범위 선택기"
							startDate={dateRangeValue[0]}
							endDate={dateRangeValue[1]}
							onChange={setDateRangeValue}
							placeholder="날짜 범위를 선택하세요"
						/>

						<SimpleMonthPicker
							label="년월 선택기"
							value={monthValue}
							onChange={setMonthValue}
							placeholder="년월을 선택하세요"
						/>

						<SimpleDatePicker
							label="날짜+시간 선택기"
							value={dateValue}
							onChange={setDateValue}
							showTimeSelect={true}
							dateFormat="yyyy-MM-dd HH:mm"
							placeholder="날짜와 시간을 선택하세요"
						/>

						<SimpleDatePicker
							label="비활성화된 날짜 선택기"
							value={dateValue}
							onChange={setDateValue}
							disabled={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
} 
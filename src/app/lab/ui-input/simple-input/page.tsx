'use client';

import { useState } from 'react';
import { FieldCheckbox } from '@/components/ui/ui-input/simple-input/FieldCheckbox';
import { FieldToggleButton } from '@/components/ui/ui-input/simple-input/FieldToggleButton';
import { FieldToggleSwitch } from '@/components/ui/ui-input/simple-input/FieldToggleSwitch';
import { FieldRadioGroup } from '@/components/ui/ui-input/simple-input/FieldRadioGroup';
import { useTranslations } from '@/hooks/useI18n';

export default function SimpleInputPage() {
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
					<div className="space-y-4">
						{checkboxOptions.map((option) => (
							<FieldCheckbox
								key={option.key}
								label={option.label}
								checked={
									checkboxStates[option.key as keyof typeof checkboxStates]
								}
								onChange={(checked) =>
									handleCheckboxChange(option.key, checked)
								}
							/>
						))}
					</div>
				</div>

				{/* 라디오 그룹 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold font-multilang">{t('간단입력_라디오그룹')}</h2>
					<div className="space-y-6">
						<FieldRadioGroup
							label={t('간단입력_수직라디오그룹')}
							options={radioOptions.slice(0, 4)}
							value={radioValue}
							onChange={setRadioValue}
							layout="vertical"
						/>

						<FieldRadioGroup
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
						<FieldToggleSwitch
							label={t('간단입력_기본토글스위치')}
							checked={switchValue}
							onChange={setSwitchValue}
						/>

						<FieldToggleSwitch
							label={t('간단입력_Small토글스위치')}
							checked={switchValue}
							onChange={setSwitchValue}
							size="sm"
						/>

						<FieldToggleSwitch
							label={t('간단입력_Medium토글스위치')}
							checked={switchValue}
							onChange={setSwitchValue}
							size="md"
						/>

						<FieldToggleSwitch
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
						<FieldToggleButton
							label={t('간단입력_기본토글버튼')}
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="default"
							size="md"
						/>

						<FieldToggleButton
							label={t('간단입력_아웃라인토글버튼')}
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="outline-solid"
							size="md"
						/>

						<FieldToggleButton
							label={t('간단입력_고스트토글버튼')}
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="ghost"
							size="md"
						/>

						<FieldToggleButton
							label={t('간단입력_Small토글버튼')}
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="default"
							size="sm"
						/>

						<FieldToggleButton
							label={t('간단입력_Large토글버튼')}
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="default"
							size="lg"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

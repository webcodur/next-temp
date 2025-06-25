'use client';

import { useState } from 'react';
import { FieldCheckbox } from '@/components/ui/simple-input/FieldCheckbox';
import { FieldToggleButton } from '@/components/ui/simple-input/FieldToggleButton';
import { FieldToggleSwitch } from '@/components/ui/simple-input/FieldToggleSwitch';
import { FieldRadioGroup } from '@/components/ui/simple-input/FieldRadioGroup';

export default function SimpleInputPage() {
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
		{ key: 'notifications', label: '알림 받기' },
		{ key: 'emailAlerts', label: '이메일 알림' },
		{ key: 'smsAlerts', label: 'SMS 알림' },
		{ key: 'pushNotifications', label: '푸시 알림' },
		{ key: 'marketing', label: '마케팅 정보 수신' },
	];

	const radioOptions = [
		{ value: 'design', label: '디자인' },
		{ value: 'development', label: '개발' },
		{ value: 'marketing', label: '마케팅' },
		{ value: 'planning', label: '기획' },
		{ value: 'hr', label: '인사' },
		{ value: 'finance', label: '재무' },
	];

	const handleCheckboxChange = (key: string, checked: boolean) => {
		setCheckboxStates((prev) => ({
			...prev,
			[key]: checked,
		}));
	};

	return (
		<div className="container p-6 mx-auto">
			<h1 className="mb-8 text-2xl font-bold">Simple Input 컴포넌트</h1>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
				{/* 체크박스 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">체크박스</h2>
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
					<h2 className="mb-4 text-xl font-semibold">라디오 그룹</h2>
					<div className="space-y-6">
						<FieldRadioGroup
							label="수직 라디오 그룹"
							options={radioOptions.slice(0, 4)}
							value={radioValue}
							onChange={setRadioValue}
							layout="vertical"
						/>

						<FieldRadioGroup
							label="수평 라디오 그룹"
							options={radioOptions.slice(0, 3)}
							value={radioValue}
							onChange={setRadioValue}
							layout="horizontal"
						/>
					</div>
				</div>

				{/* 토글 스위치 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">토글 스위치</h2>
					<div className="space-y-6">
						<FieldToggleSwitch
							label="기본 토글 스위치"
							checked={switchValue}
							onChange={setSwitchValue}
						/>

						<FieldToggleSwitch
							label="Small 토글 스위치"
							checked={switchValue}
							onChange={setSwitchValue}
							size="sm"
						/>

						<FieldToggleSwitch
							label="Medium 토글 스위치"
							checked={switchValue}
							onChange={setSwitchValue}
							size="md"
						/>

						<FieldToggleSwitch
							label="Large 토글 스위치"
							checked={switchValue}
							onChange={setSwitchValue}
							size="lg"
						/>
					</div>
				</div>

				{/* 토글 버튼 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">토글 버튼</h2>
					<div className="space-y-6">
						<FieldToggleButton
							label="기본 토글 버튼"
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="default"
							size="md"
						/>

						<FieldToggleButton
							label="아웃라인 토글 버튼"
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="outline-solid"
							size="md"
						/>

						<FieldToggleButton
							label="고스트 토글 버튼"
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="ghost"
							size="md"
						/>

						<FieldToggleButton
							label="Small 토글 버튼"
							pressed={toggleButtonValue}
							onChange={setToggleButtonValue}
							variant="default"
							size="sm"
						/>

						<FieldToggleButton
							label="Large 토글 버튼"
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

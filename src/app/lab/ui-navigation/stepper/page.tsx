'use client';

import React, { useState } from 'react';
import Stepper from '@/components/ui/stepper/stepper';

// #region Types
interface ProfileData { name: string; email: string; }
interface AddressData { address: string; city: string; }
interface PaymentData { cardNumber: string; }
// #endregion

const StepperDemo = () => {
	// #region 상태 및 데이터
	const steps = ['프로필', '주소', '결제', '완료'];
	const [currentStep, setCurrentStep] = useState(1);
	const [profile, setProfile] = useState<ProfileData>({ name: '', email: '' });
	const [address, setAddress] = useState<AddressData>({ address: '', city: '' });
	const [payment, setPayment] = useState<PaymentData>({ cardNumber: '' });
	// #endregion

	// #region 이벤트 핸들러
	const handleStepChange = (step: number) => setCurrentStep(step);
	const handleNext = () => currentStep < steps.length && setCurrentStep(currentStep + 1);
	const handlePrev = () => currentStep > 1 && setCurrentStep(currentStep - 1);
	const handleSubmit = () => {
		console.log({ profile, address, payment });
		alert('🎉 모든 단계 완료! 콘솔을 확인하세요.');
	};
	// #endregion

	// #region 스텝별 콘텐츠 매핑
	const contentMap: Record<number, React.ReactNode> = {
		1: (
			<div className="space-y-4">
				<p>👤 회원 정보를 입력합니다.</p>
				<input
					type="text"
					placeholder="이름"
					className="w-full border px-2 py-1 rounded"
					value={profile.name}
					onChange={e => setProfile({ ...profile, name: e.target.value })}
				/>
				<input
					type="email"
					placeholder="이메일"
					className="w-full border px-2 py-1 rounded"
					value={profile.email}
					onChange={e => setProfile({ ...profile, email: e.target.value })}
				/>
			</div>
		),
		2: (
			<div className="space-y-4">
				<p>🏠 배송 받을 주소를 적어주세요.</p>
				<input
					type="text"
					placeholder="주소"
					className="w-full border px-2 py-1 rounded"
					value={address.address}
					onChange={e => setAddress({ ...address, address: e.target.value })}
				/>
				<input
					type="text"
					placeholder="도시"
					className="w-full border px-2 py-1 rounded"
					value={address.city}
					onChange={e => setAddress({ ...address, city: e.target.value })}
				/>
			</div>
		),
		3: (
			<div className="space-y-4">
				<p>💳 결제 정보를 입력해주세요.</p>
				<input
					type="text"
					placeholder="카드 번호"
					className="w-full border px-2 py-1 rounded"
					value={payment.cardNumber}
					onChange={e => setPayment({ ...payment, cardNumber: e.target.value })}
				/>
			</div>
		),
		4: (
			<div className="space-y-4">
				<p>✅ 모든 정보 확인 완료!</p>
				<p>이름: {profile.name}</p>
				<p>이메일: {profile.email}</p>
				<p>주소: {address.address}, {address.city}</p>
				<p>카드 번호: {payment.cardNumber}</p>
			</div>
		),
	};
	// #endregion

	return (
		<div className="container mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold mb-6">회원 가입 진행 흐름</h1>

			<div className="p-6 bg-white rounded-lg shadow-md">
				<Stepper steps={steps} currentStep={currentStep} onChange={handleStepChange} />
				<div className="mt-6">{contentMap[currentStep]}</div>

				<div className="flex justify-between mt-4">
					<button
						onClick={handlePrev}
						disabled={currentStep === 1}
						className={`px-4 py-2 rounded ${currentStep === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
					>
						이전
					</button>

					{currentStep < steps.length ? (
						<button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">
							다음
						</button>
					) : (
						<button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
							제출
						</button>
					)}
				</div>
			</div>

			<div className="mt-8">
				<h2 className="text-xl font-semibold mb-4">사용 방법</h2>
				<div className="bg-gray-50 p-4 rounded-md overflow-auto">
					<pre className="text-sm">
{`import Stepper from '@/components/ui/stepper/stepper';

const steps = ['프로필', '주소', '결제', '완료'];
const [currentStep, setCurrentStep] = useState(1);
const [profile, setProfile] = useState<ProfileData>({ name: '', email: '' });
const [address, setAddress] = useState<AddressData>({ address: '', city: '' });
const [payment, setPayment] = useState<PaymentData>({ cardNumber: '' });

<Stepper
  steps={steps}
  currentStep={currentStep}
  onChange={(step) => setCurrentStep(step)}
/>`}
					</pre>
				</div>
			</div>
		</div>
	);
};

export default StepperDemo; 
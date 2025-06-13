'use client';
import React, { useState } from 'react';
import { StepperCore } from '@/components/ui/stepper';

//#region Constants
const STEPS = [
  '기본 정보',
  '상세 설정', 
  '검토 및 확인',
  '완료'
];
//#endregion

//#region Step Components
const Step1 = ({ isCompleted, onComplete, onUnComplete }: {
  isCompleted: boolean;
  onComplete: () => void;
  onUnComplete: () => void;
}) => (
  <div className="p-6 rounded-lg neu-flat">
    <h3 className="mb-4 text-lg font-semibold">1단계: 기본 정보</h3>
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">이름</label>
        <input 
          type="text" 
          className="w-full p-3 border-0 rounded-lg neu-inset focus:outline-none"
          placeholder="이름을 입력하세요"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">이메일</label>
        <input 
          type="email" 
          className="w-full p-3 border-0 rounded-lg neu-inset focus:outline-none"
          placeholder="이메일을 입력하세요"
        />
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onComplete}
          className="px-6 py-2 font-medium rounded-lg neu-raised hover:neu-inset text-primary"
        >
          완료
        </button>
        {isCompleted && (
          <button
            onClick={onUnComplete}
            className="px-6 py-2 rounded-lg neu-flat hover:neu-inset text-neutral-600"
          >
            취소
          </button>
        )}
      </div>
    </div>
  </div>
);

const Step2 = ({ isCompleted, onComplete, onUnComplete }: {
  isCompleted: boolean;
  onComplete: () => void;
  onUnComplete: () => void;
}) => (
  <div className="p-6 rounded-lg neu-flat">
    <h3 className="mb-4 text-lg font-semibold">2단계: 상세 설정</h3>
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">알림 설정</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded neu-inset" />
            <span>이메일 알림</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded neu-inset" />
            <span>SMS 알림</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onComplete}
          className="px-6 py-2 font-medium rounded-lg neu-raised hover:neu-inset text-primary"
        >
          완료
        </button>
        {isCompleted && (
          <button
            onClick={onUnComplete}
            className="px-6 py-2 rounded-lg neu-flat hover:neu-inset text-neutral-600"
          >
            취소
          </button>
        )}
      </div>
    </div>
  </div>
);

const Step3 = ({ isCompleted, onComplete, onUnComplete }: {
  isCompleted: boolean;
  onComplete: () => void;
  onUnComplete: () => void;
}) => (
  <div className="p-6 rounded-lg neu-flat">
    <h3 className="mb-4 text-lg font-semibold">3단계: 검토 및 확인</h3>
    <div className="space-y-4">
      <div className="p-4 rounded-lg neu-inset bg-neutral-50">
        <h4 className="mb-2 font-medium">입력한 정보</h4>
        <p className="text-sm text-neutral-600">이름: 홍길동</p>
        <p className="text-sm text-neutral-600">이메일: hong@example.com</p>
        <p className="text-sm text-neutral-600">알림: 이메일, SMS</p>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onComplete}
          className="px-6 py-2 font-medium rounded-lg neu-raised hover:neu-inset text-primary"
        >
          확인 완료
        </button>
        {isCompleted && (
          <button
            onClick={onUnComplete}
            className="px-6 py-2 rounded-lg neu-flat hover:neu-inset text-neutral-600"
          >
            취소
          </button>
        )}
      </div>
    </div>
  </div>
);

const Step4 = ({ isCompleted, onComplete }: {
  isCompleted: boolean;
  onComplete: () => void;
  onUnComplete: () => void;
}) => (
  <div className="p-6 text-center rounded-lg neu-flat">
    <h3 className="mb-4 text-lg font-semibold">4단계: 완료</h3>
    <div className="space-y-4">
      <div className="text-6xl">🎉</div>
      <p className="text-neutral-600">모든 단계가 완료되었습니다!</p>
      {!isCompleted && (
        <button
          onClick={onComplete}
          className="px-6 py-2 font-medium rounded-lg neu-raised hover:neu-inset text-primary"
        >
          최종 완료
        </button>
      )}
    </div>
  </div>
);
//#endregion

//#region Main Component
const StepperPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [viewStep, setViewStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepChange = (step: number) => {
    setViewStep(step);
  };

  const handleAdvanceStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      setViewStep(currentStep + 1);
    }
  };

  const renderStep = (stepNumber: number, isCompleted: boolean) => {
    const handleComplete = () => {
      if (!completedSteps.includes(stepNumber)) {
        setCompletedSteps([...completedSteps, stepNumber]);
      }
    };

    const handleUnComplete = () => {
      setCompletedSteps(completedSteps.filter(step => step !== stepNumber));
    };

    const stepComponents = {
      1: Step1,
      2: Step2,
      3: Step3,
      4: Step4
    };

    const StepComponent = stepComponents[stepNumber as keyof typeof stepComponents];
    
    return StepComponent ? (
      <StepComponent 
        isCompleted={isCompleted}
        onComplete={handleComplete}
        onUnComplete={handleUnComplete}
      />
    ) : null;
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-neutral-800">스테퍼 컴포넌트 테스트</h1>
          <p className="text-neutral-600">새로운 컴포넌트 구조로 리팩토링된 스테퍼를 테스트합니다.</p>
        </div>

        <StepperCore
          steps={STEPS}
          currentStep={currentStep}
          viewStep={viewStep}
          completedSteps={completedSteps}
          onChange={handleStepChange}
          onAdvance={handleAdvanceStep}
          renderStep={renderStep}
          maxVisibleSteps={4}
          title="회원가입 프로세스"
        />

      </div>
    </div>
  );
};

export default StepperPage;
//#endregion

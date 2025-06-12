'use client';

import React, { useState } from 'react';
import Stepper from '@/components/ui/stepper/Stepper';

const StepperTestPage = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [viewStep, setViewStep] = useState(2);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [useExtendedSteps, setUseExtendedSteps] = useState(false);

  // 개발자가 설정하는 완료 취소 모드 (sequential로 기본 설정)
  const completionMode = 'sequential'; // 또는 'single-step'

  const basicSteps = [
    "기본 정보 입력",
    "상세 정보 입력", 
    "결제 정보 입력",
    "검토 및 확인",
    "완료"
  ];

  const extendedSteps = [
    "회원가입",
    "이메일 인증",
    "기본 정보 입력",
    "프로필 설정",
    "선호도 조사",
    "상세 정보 입력", 
    "서비스 약관 동의",
    "결제 정보 입력",
    "결제 방법 선택",
    "검토 및 확인",
    "최종 승인",
    "완료"
  ];

  const steps = useExtendedSteps ? extendedSteps : basicSteps;

  const handleStepChange = (step: number) => {
    setViewStep(step);
  };

  const handleCompleteStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setViewStep(nextStep);
    }
  };

  // #region 현재 단계 취소 기능
  const handleUncompleteCurrentStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setViewStep(prevStep);
    }
  };
  // #endregion

  const handleUncompleteStep = (step: number) => {
    if (completionMode === 'sequential') {
      // 순차 모드: 해당 스텝 이후의 모든 완료된 스텝들도 함께 취소
      setCompletedSteps(prev => prev.filter(s => s < step));
      
      // 현재 진행 스텝도 조정
      if (currentStep >= step) {
        setCurrentStep(step);
        setViewStep(step);
      }
    } else {
      // 단일 스텝 모드: 해당 스텝만 취소
      setCompletedSteps(prev => prev.filter(s => s !== step));
    }
  };

  const handleStepModeToggle = () => {
    setUseExtendedSteps(!useExtendedSteps);
    // 모드 변경시 상태 초기화
    setCurrentStep(2);
    setViewStep(2);
    setCompletedSteps([1]);
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-neutral-800">Stepper Component 테스트</h1>
          
          {/* 컨트롤 패널 */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600">스텝 수:</span>
              <button
                onClick={handleStepModeToggle}
                className="px-4 py-2 text-sm font-medium transition-all rounded-lg text-neutral-700 neu-raised hover:neu-inset"
              >
                {useExtendedSteps ? `📝 기본형 (${basicSteps.length}개)` : `📋 확장형 (${extendedSteps.length}개)`}
              </button>
            </div>
          </div>
        </div>

        <Stepper 
          steps={steps}
          currentStep={currentStep}
          viewStep={viewStep}
          completedSteps={completedSteps}
          onChange={handleStepChange}
          maxVisibleSteps={3}
          title={useExtendedSteps ? "확장형 회원가입 프로세스" : "기본 회원가입 프로세스"}
        >
          {/* 컨텐츠 영역 */}
          <div className="p-8 my-12 rounded-lg neu-flat">
            <h2 className="mb-4 text-xl font-semibold text-neutral-800">
              {steps[viewStep - 1]} (Step {viewStep})
            </h2>
            <p className="mb-6 text-neutral-600">
              현재 {viewStep}번째 단계를 보고 있습니다. 
              실제 진행도는 {currentStep}단계까지입니다.
              {useExtendedSteps && ' (확장형 테스트 모드)'}
            </p>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* 단계 완료 */}
              <div className="space-y-4">
                <h3 className="font-medium text-neutral-700">단계 완료</h3>
                <button
                  onClick={handleCompleteStep}
                  disabled={currentStep >= steps.length}
                  className="w-full px-4 py-2 transition-all rounded-lg text-neutral-700 neu-raised hover:neu-inset disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  현재 단계 완료
                </button>
              </div>

              {/* 현재 단계 취소 */}
              <div className="space-y-4">
                <h3 className="font-medium text-neutral-700">현재 단계 취소</h3>
                <button
                  onClick={handleUncompleteCurrentStep}
                  disabled={currentStep <= 1}
                  className="w-full px-4 py-2 transition-all rounded-lg text-neutral-700 neu-raised hover:neu-inset disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep}단계 → {currentStep - 1}단계로
                </button>
                <p className="text-xs text-neutral-500">
                  현재 진행 단계만 이전 단계로 되돌립니다
                </p>
              </div>

              {/* 완료된 단계 취소 */}
              <div className="space-y-4">
                <h3 className="font-medium text-neutral-700">완료된 단계 취소</h3>
                <div className="space-y-2">
                  {completedSteps.map(step => (
                    <button
                      key={step}
                      onClick={() => handleUncompleteStep(step)}
                      className="w-full px-3 py-2 text-sm transition-all rounded text-neutral-700 neu-raised hover:neu-inset"
                    >
                      {step}단계 취소 ({completionMode === 'sequential' ? '순차' : '단일'})
                    </button>
                  ))}
                  {completedSteps.length === 0 && (
                    <p className="text-sm text-neutral-500">완료된 단계가 없습니다</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Stepper>
      </div>
    </div>
  );
};

export default StepperTestPage; 
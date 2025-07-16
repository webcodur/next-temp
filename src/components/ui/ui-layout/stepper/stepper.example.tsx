'use client';
import React, { useState } from 'react';
import { Stepper } from './Stepper';
import { useTranslations } from '@/hooks/useI18n';

//#region Step Components
const Step1 = ({ isCompleted, onComplete, onUnComplete }: {
  isCompleted: boolean;
  onComplete: () => void;
  onUnComplete: () => void;
}) => {
  const t = useTranslations();
  
  return (
    <div className="p-6 rounded-lg neu-flat">
      <h3 className="mb-4 text-lg font-semibold font-multilang">{t('스테퍼_1단계제목')}</h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium font-multilang">{t('스테퍼_이름')}</label>
          <input 
            type="text" 
            className="p-3 w-full rounded-lg border-0 neu-inset focus:outline-hidden"
            placeholder={t('스테퍼_이름입력')}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium font-multilang">{t('스테퍼_이메일')}</label>
          <input 
            type="email" 
            className="p-3 w-full rounded-lg border-0 neu-inset focus:outline-hidden"
            placeholder={t('스테퍼_이메일입력')}
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onComplete}
            className="px-6 py-2 font-medium rounded-lg neu-raised hover:neu-inset text-primary font-multilang"
          >
            {t('스테퍼_완료버튼')}
          </button>
          {isCompleted && (
            <button
              onClick={onUnComplete}
              className="px-6 py-2 rounded-lg neu-flat hover:neu-inset text-neutral-600 font-multilang"
            >
              {t('스테퍼_취소')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Step2 = ({ isCompleted, onComplete, onUnComplete }: {
  isCompleted: boolean;
  onComplete: () => void;
  onUnComplete: () => void;
}) => {
  const t = useTranslations();
  
  return (
    <div className="p-6 rounded-lg neu-flat">
      <h3 className="mb-4 text-lg font-semibold font-multilang">{t('스테퍼_2단계제목')}</h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium font-multilang">{t('스테퍼_알림설정')}</label>
          <div className="space-y-2">
            <label className="flex gap-2 items-center">
              <input type="checkbox" className="rounded neu-inset" />
              <span className="font-multilang">{t('스테퍼_이메일알림')}</span>
            </label>
            <label className="flex gap-2 items-center">
              <input type="checkbox" className="rounded neu-inset" />
              <span className="font-multilang">{t('스테퍼_SMS알림')}</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onComplete}
            className="px-6 py-2 font-medium rounded-lg neu-raised hover:neu-inset text-primary font-multilang"
          >
            {t('스테퍼_완료버튼')}
          </button>
          {isCompleted && (
            <button
              onClick={onUnComplete}
              className="px-6 py-2 rounded-lg neu-flat hover:neu-inset text-neutral-600 font-multilang"
            >
              {t('스테퍼_취소')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Step3 = ({ isCompleted, onComplete, onUnComplete }: {
  isCompleted: boolean;
  onComplete: () => void;
  onUnComplete: () => void;
}) => {
  const t = useTranslations();
  
  return (
    <div className="p-6 rounded-lg neu-flat">
      <h3 className="mb-4 text-lg font-semibold font-multilang">{t('스테퍼_3단계제목')}</h3>
      <div className="space-y-4">
        <div className="p-4 rounded-lg neu-inset bg-neutral-50">
          <h4 className="mb-2 font-medium font-multilang">{t('스테퍼_입력한정보')}</h4>
          <p className="text-sm text-neutral-600 font-multilang">{t('스테퍼_이름값')}</p>
          <p className="text-sm text-neutral-600 font-multilang">{t('스테퍼_이메일값')}</p>
          <p className="text-sm text-neutral-600 font-multilang">{t('스테퍼_알림값')}</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onComplete}
            className="px-6 py-2 font-medium rounded-lg neu-raised hover:neu-inset text-primary font-multilang"
          >
            {t('스테퍼_확인완료')}
          </button>
          {isCompleted && (
            <button
              onClick={onUnComplete}
              className="px-6 py-2 rounded-lg neu-flat hover:neu-inset text-neutral-600 font-multilang"
            >
              {t('스테퍼_취소')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Step4 = ({ isCompleted, onComplete }: {
  isCompleted: boolean;
  onComplete: () => void;
  onUnComplete: () => void;
}) => {
  const t = useTranslations();
  
  return (
    <div className="p-6 text-center rounded-lg neu-flat">
      <h3 className="mb-4 text-lg font-semibold font-multilang">{t('스테퍼_4단계제목')}</h3>
      <div className="space-y-4">
        <div className="text-6xl">🎉</div>
        <p className="text-neutral-600 font-multilang">{t('스테퍼_완료메시지')}</p>
        {!isCompleted && (
          <button
            onClick={onComplete}
            className="px-6 py-2 font-medium rounded-lg neu-raised hover:neu-inset text-primary font-multilang"
          >
            {t('스테퍼_최종완료')}
          </button>
        )}
      </div>
    </div>
  );
};
//#endregion

//#region Main Component
const StepperExample = () => {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(1);
  const [viewStep, setViewStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  //#region Constants
  const STEPS = [
    t('스테퍼_기본정보'),
    t('스테퍼_상세설정'), 
    t('스테퍼_검토확인'),
    t('스테퍼_완료')
  ];
  //#endregion

  const handleStepChange = (step: number) => {
    setViewStep(step);
  };

  const handleAdvanceStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      setViewStep(currentStep + 1);
    }
  };

  const handleCompleteStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step].sort((a,b)=> a-b));
    }
  };

  const handleUnCompleteStep = (step: number) => {
    setCompletedSteps(completedSteps.filter(s => s !== step));
  };
  
  const renderStep = (
    stepNumber: number, 
    isCompleted: boolean, 
    onComplete: () => void, 
    onUnComplete: () => void
  ) => {
    const stepComponents = {
      1: Step1,
      2: Step2,
      3: Step3,
      4: Step4,
    };

    const StepComponent = stepComponents[stepNumber as keyof typeof stepComponents];

    return StepComponent ? (
      <StepComponent
        isCompleted={isCompleted}
        onComplete={onComplete}
        onUnComplete={onUnComplete}
      />
    ) : null;
  };

  return (
    <div className="p-8 min-h-screen bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-neutral-800 font-multilang">{t('스테퍼_제목')}</h1>
          <p className="text-neutral-600 font-multilang">{t('스테퍼_설명')}</p>
        </div>

        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          viewStep={viewStep}
          completedSteps={completedSteps}
          onChange={handleStepChange}
          onAdvance={handleAdvanceStep}
          onCompleteStep={handleCompleteStep}
          onUnCompleteStep={handleUnCompleteStep}
          renderStep={renderStep}
          maxVisibleSteps={4}
          title={t('스테퍼_회원가입프로세스')}
        />

      </div>
    </div>
  );
};

export default StepperExample;
//#endregion 
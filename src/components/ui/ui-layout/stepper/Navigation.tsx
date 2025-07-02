//#region Imports
import React from 'react';
//#endregion

//#region Types
interface NavigationProps {
  currentStep: number;
  viewStep: number;
  totalSteps: number;
  completedSteps: number[];
  onPrevious?: () => void;
  onNext?: () => void;
  onAdvance?: () => void;
  className?: string;
}
//#endregion

//#region Main Component
export const Navigation: React.FC<NavigationProps> = ({
  currentStep,
  viewStep,
  totalSteps,
  completedSteps,
  onPrevious,
  onNext,
  onAdvance,
  className = ''
}) => {
  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber);
  };

  const canGoPrevious = viewStep > 1;
  const canGoNext = viewStep < totalSteps && 
    (isStepCompleted(viewStep) || viewStep < currentStep);
  const isLastStep = viewStep === totalSteps;

  const handleNextClick = () => {
    if (viewStep === currentStep && isStepCompleted(viewStep)) {
      onAdvance?.();
    } else if (viewStep < currentStep || isStepCompleted(viewStep)) {
      onNext?.();
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="flex justify-between items-center p-4 neu-flat rounded-lg">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`px-6 py-2 rounded-lg neu-raised hover:neu-inset ${
            !canGoPrevious 
              ? 'opacity-50 cursor-not-allowed' 
              : 'text-neutral-700'
          }`}
        >
          ← 이전
        </button>

        <div className="text-sm text-neutral-600">
          {viewStep} / {totalSteps}
        </div>

        <button
          onClick={handleNextClick}
          disabled={!canGoNext}
          className={`px-6 py-2 rounded-lg neu-raised hover:neu-inset ${
            !canGoNext 
              ? 'opacity-50 cursor-not-allowed' 
              : 'text-neutral-700'
          }`}
        >
          {isLastStep ? '완료' : '다음'} →
        </button>
      </div>
    </div>
  );
};

export default Navigation;
//#endregion 
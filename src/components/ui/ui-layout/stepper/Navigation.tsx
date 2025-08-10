//#region Imports
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/hooks/ui-hooks/useI18n';
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
  const { isRTL } = useLocale();
  
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
          className={`flex items-center gap-2 px-6 py-2 rounded-lg neu-raised hover:neu-inset ${
            !canGoPrevious 
              ? 'opacity-50 cursor-not-allowed' 
              : 'text-neutral-700'
          }`}
        >
          {isRTL ? (
            <>
              <span>이전</span>
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>이전</span>
            </>
          )}
        </button>

        <div className="text-sm text-neutral-600">
          {viewStep} / {totalSteps}
        </div>

        <button
          onClick={handleNextClick}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg neu-raised hover:neu-inset ${
            !canGoNext 
              ? 'opacity-50 cursor-not-allowed' 
              : 'text-neutral-700'
          }`}
        >
          {isRTL ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>{isLastStep ? '완료' : '다음'}</span>
            </>
          ) : (
            <>
              <span>{isLastStep ? '완료' : '다음'}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Navigation;
//#endregion 
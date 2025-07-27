// #region Imports
import React from 'react';
import StepIndicator from './StepIndicator';
import ContentArea from './ContentArea';
import Navigation from './Navigation';
import { useTranslations } from '@/hooks/useI18n';
// #endregion

// #region Types
export interface StepperProps {
  steps: string[];
  currentStep: number;
  viewStep?: number;
  completedSteps?: number[];
  onChange?: (step: number) => void;
  onAdvance?: () => void;
  onCompleteStep?: (step: number) => void;
  onUnCompleteStep?: (step: number) => void;
  children?: React.ReactNode;
  renderStep?: (
    stepNumber: number,
    isCompleted: boolean,
    onComplete: () => void,
    onUnComplete: () => void
  ) => React.ReactNode;
  maxVisibleSteps?: number;
  title?: string;
  colorVariant?: 'primary' | 'secondary';
  className?: string;
}
// #endregion

// #region Main Component
export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  viewStep = currentStep,
  completedSteps = [],
  onChange,
  onAdvance,
  onCompleteStep,
  onUnCompleteStep,
  children,
  renderStep,
  maxVisibleSteps = 4,
  title,
  className = '',
}) => {
  const t = useTranslations();
  const defaultTitle = title || t('스테퍼_제목_단계별진행');
  
  if (!steps || steps.length === 0) return null;

  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber);
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep || isStepCompleted(stepNumber)) {
      onChange?.(stepNumber);
    }
  };

  const handlePrevious = () => {
    if (viewStep > 1) {
      onChange?.(viewStep - 1);
    }
  };

  const handleNext = () => {
    if (viewStep < steps.length) {
      onChange?.(viewStep + 1);
    }
  };

  return (
    <div className={`p-6 space-y-8 w-full rounded-lg shadow-inner neu-flat bg-background ${className}`}>
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        viewStep={viewStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
        maxVisibleSteps={maxVisibleSteps}
        title={defaultTitle}
      />

      <ContentArea>
        {children}
        {renderStep &&
          renderStep(
            viewStep,
            isStepCompleted(viewStep),
            () => onCompleteStep?.(viewStep),
            () => onUnCompleteStep?.(viewStep)
          )}
      </ContentArea>

      <Navigation
        currentStep={currentStep}
        viewStep={viewStep}
        totalSteps={steps.length}
        completedSteps={completedSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onAdvance={onAdvance}
      />
    </div>
  );
};

export default Stepper;
// #endregion 
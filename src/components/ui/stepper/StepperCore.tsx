// #region Imports
import React from 'react';
import StepContainer from './StepContainer';
import StepIndicator from './StepIndicator';
import ContentArea from './ContentArea';
import Navigation from './Navigation';
// #endregion

// #region Types
interface StepperCoreProps {
  steps: string[];
  currentStep: number;
  viewStep?: number;
  completedSteps?: number[];
  onChange?: (step: number) => void;
  onAdvance?: () => void;
  children?: React.ReactNode;
  renderStep?: (
    stepNumber: number, 
    isCompleted: boolean, 
    onComplete: () => void, 
    onUnComplete: () => void
  ) => React.ReactNode;
  maxVisibleSteps?: number;
  title?: string;
  className?: string;
}
// #endregion

// #region Main Component
const StepperCore: React.FC<StepperCoreProps> = ({
  steps,
  currentStep,
  viewStep = currentStep,
  completedSteps = [],
  onChange,
  onAdvance,
  children,
  renderStep,
  maxVisibleSteps = 3,
  title = "단계별 진행",
  className = ''
}) => {
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
    <StepContainer className={className}>
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        viewStep={viewStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
        maxVisibleSteps={maxVisibleSteps}
        title={title}
      />
      
      <ContentArea>
        {children}
        {renderStep && renderStep(
          viewStep,
          isStepCompleted(viewStep),
          () => onAdvance?.(),
          () => onChange?.(viewStep)
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
    </StepContainer>
  );
};

export default StepperCore; 
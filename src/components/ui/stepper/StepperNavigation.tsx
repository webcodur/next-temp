import React from 'react';
import Navigation from './Navigation';

// #region Navigation Component
interface StepperNavigationProps {
  steps: string[];
  currentStep: number;
  viewStep: number;
  completedSteps: number[];
  onChange?: (step: number) => void;
  onAdvance?: () => void;
}

const StepperNavigation: React.FC<StepperNavigationProps> = (props) => {
  const handlePrevious = () => {
    if (props.viewStep > 1) {
      props.onChange?.(props.viewStep - 1);
    }
  };

  const handleNext = () => {
    if (props.viewStep < props.steps.length) {
      props.onChange?.(props.viewStep + 1);
    }
  };

  return (
    <Navigation
      currentStep={props.currentStep}
      viewStep={props.viewStep}
      totalSteps={props.steps.length}
      completedSteps={props.completedSteps}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onAdvance={props.onAdvance}
    />
  );
};
// #endregion

export default StepperNavigation; 
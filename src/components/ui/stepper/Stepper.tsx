// #region Imports
import React from 'react';
// #endregion

// #region Types
interface StepperProps {
  steps: string[];
  currentStep: number; // 1-based index
  onChange?: (step: number) => void;
}
// #endregion

// #region Component
const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onChange }) => {
  if (!steps || steps.length === 0) return null;

  const handleClick = (idx: number) => {
    if (onChange) {
      onChange(idx + 1);
    }
  };

  return (
    <div className="flex items-center">
      {steps.map((label, idx) => (
        <React.Fragment key={idx}>
          <div
            className={`flex items-center cursor-pointer transition-all duration-300 ${
              idx < currentStep - 1
                ? 'text-primary'
                : idx === currentStep - 1
                ? 'text-primary'
                : 'text-neutral-400'
            }`}
            onClick={() => handleClick(idx)}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                idx < currentStep - 1
                  ? 'neu-inset text-primary'
                  : idx === currentStep - 1
                  ? 'neu-raised text-primary'
                  : 'neu-flat text-neutral-400'
              }`}
            >
              {idx + 1}
            </div>
            <span className="ml-2">{label}</span>
          </div>
          {idx !== steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                idx < currentStep - 1 ? 'bg-primary-light' : 'bg-neutral-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
// #endregion

export default Stepper; 
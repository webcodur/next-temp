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
            className={`flex items-center cursor-pointer ${
              idx < currentStep - 1
                ? 'text-blue-600'
                : idx === currentStep - 1
                ? 'text-blue-600'
                : 'text-gray-400'
            }`}
            onClick={() => handleClick(idx)}
          >
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                idx < currentStep - 1
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : idx === currentStep - 1
                  ? 'border-blue-600 text-blue-600'
                  : 'border-gray-300'
              }`}
            >
              {idx + 1}
            </div>
            <span className="ml-2">{label}</span>
          </div>
          {idx !== steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 ${
                idx < currentStep - 1 ? 'bg-blue-600' : 'bg-gray-300'
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
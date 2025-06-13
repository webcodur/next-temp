// #region Imports
import React from 'react';
// #endregion

// #region Types
export interface StepperProps {
  children: React.ReactNode;
  className?: string;
}
// #endregion

// #region Main Component
export const Stepper: React.FC<StepperProps> = ({ children, className = '' }) => {
  return (
    <div className={`neu-flat bg-white rounded-lg p-6 shadow-inner ${className}`}>
      {children}
    </div>
  );
};

export default Stepper;
// #endregion 
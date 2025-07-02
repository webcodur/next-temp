//#region Imports
import React from 'react';
//#endregion

//#region Types
interface StepContainerProps {
  children: React.ReactNode;
  className?: string;
}
//#endregion

//#region Main Component
export const StepContainer: React.FC<StepContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`w-full space-y-8 ${className}`}>
      {children}
    </div>
  );
};

export default StepContainer;
//#endregion 
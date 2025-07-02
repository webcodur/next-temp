//#region Imports
import React from 'react';
//#endregion

//#region Types
interface ContentAreaProps {
  children?: React.ReactNode;
  className?: string;
}
//#endregion

//#region Main Component
export const ContentArea: React.FC<ContentAreaProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default ContentArea;
//#endregion 
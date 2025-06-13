//#region Imports
import React, { useState } from 'react';
//#endregion

//#region Types
interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  viewStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  maxVisibleSteps?: number;
  title?: string;
  className?: string;
}

interface StepNodeProps {
  stepNumber: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isViewing: boolean;
  isClickable: boolean;
  currentStep: number;
  onClick: () => void;
}

interface StepLineProps {
  isCompleted: boolean;
}

interface StepNameProps {
  label: string;
  stepNumber: number;
  viewStep: number;
  currentStep: number;
}
//#endregion

//#region Sub Components
const StepNode: React.FC<StepNodeProps> = ({ 
  stepNumber, 
  isCompleted, 
  isCurrent, 
  isViewing, 
  isClickable,
  currentStep,
  onClick 
}) => {
  const getNodeClasses = () => {
    if (isViewing) {
      return 'neu-raised text-primary border-2 border-primary/20';
    }
    if (isCompleted) {
      return 'neu-inset text-neutral-700 hover:neu-raised cursor-pointer';
    }
    if (isCurrent) {
      return 'neu-raised text-primary';
    }
    if (stepNumber === currentStep + 1) {
      return 'neu-flat text-neutral-600 border border-neutral-200';
    }
    return 'neu-flat text-neutral-400';
  };

  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-full relative overflow-hidden ${getNodeClasses()} ${
        isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      <span className="text-sm font-semibold">
        {isCompleted ? '✓' : stepNumber}
      </span>
    </div>
  );
};

const StepLine: React.FC<StepLineProps> = ({ isCompleted }) => {
  return (
    <div className="flex-1 h-1 mx-4 min-w-[40px] neu-inset rounded-full overflow-hidden">
      <div 
        className={`h-full ${isCompleted ? 'bg-primary' : 'bg-neutral-300'}`}
        style={{
          width: isCompleted ? '100%' : '0%'
        }}
      />
    </div>
  );
};

const StepName: React.FC<StepNameProps> = ({ label, stepNumber, viewStep, currentStep }) => {
  const isActive = stepNumber === viewStep || stepNumber === currentStep;
  
  return (
    <div className="text-center">
      <div className={`text-xs font-medium px-2 py-1 rounded ${
        isActive ? 'text-primary bg-primary/5' : 'text-neutral-600'
      }`}>
        {label}
      </div>
    </div>
  );
};
//#endregion

//#region Main Component
export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  viewStep,
  completedSteps,
  onStepClick,
  maxVisibleSteps = 3,
  title = "단계별 진행",
  className = ''
}) => {
  const [showAllSteps, setShowAllSteps] = useState(false);

  if (!steps || steps.length === 0) return null;

  const shouldCompress = steps.length > maxVisibleSteps;

  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber);
  };

  const isStepClickable = (stepNumber: number) => {
    return stepNumber <= currentStep || isStepCompleted(stepNumber);
  };

  const getVisibleSteps = () => {
    if (!shouldCompress) return steps;
    
    const totalSteps = steps.length;
    const half = Math.floor(maxVisibleSteps / 2);
    
    let startIdx = Math.max(0, viewStep - 1 - half);
    let endIdx = Math.min(totalSteps - 1, viewStep - 1 + half);
    
    if (endIdx - startIdx + 1 < maxVisibleSteps) {
      if (startIdx === 0) {
        endIdx = Math.min(totalSteps - 1, maxVisibleSteps - 1);
      } else if (endIdx === totalSteps - 1) {
        startIdx = Math.max(0, totalSteps - maxVisibleSteps);
      }
    }
    
    return steps.slice(startIdx, endIdx + 1).map((step, idx) => ({
      label: step,
      originalIndex: startIdx + idx
    }));
  };

  const visibleSteps = getVisibleSteps();

  return (
    <div className={`w-full max-w-4xl mx-auto neu-flat rounded-lg p-6 ${className}`}>
      {/* Title Section */}
      <div className="flex items-center justify-between mb-6 p-4 rounded-lg neu-inset">
        <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
        {shouldCompress && (
          <button
            onClick={() => setShowAllSteps(true)}
            className="p-2 rounded-full neu-flat hover:neu-raised text-neutral-600"
            title="전체 단계 보기"
          >
            <span className="text-lg">❓</span>
          </button>
        )}
      </div>
      
      {/* StepNodes and StepLines Section */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          {visibleSteps.map((stepInfo, idx) => {
            const isOriginalStep = typeof stepInfo === 'string';
            const label = isOriginalStep ? stepInfo : stepInfo.label;
            const originalIndex = isOriginalStep ? idx : stepInfo.originalIndex;
            const stepNumber = originalIndex + 1;
            
            return (
              <div key={originalIndex} className="flex items-center">
                {/* StepNode and StepName */}
                <div className="flex flex-col items-center min-w-[120px]">
                  <StepNode
                    stepNumber={stepNumber}
                    isCompleted={isStepCompleted(stepNumber)}
                    isCurrent={stepNumber === currentStep}
                    isViewing={stepNumber === viewStep}
                    isClickable={isStepClickable(stepNumber)}
                    currentStep={currentStep}
                    onClick={() => onStepClick?.(stepNumber)}
                  />
                  
                  <div className="mt-2">
                    <StepName
                      label={label}
                      stepNumber={stepNumber}
                      viewStep={viewStep}
                      currentStep={currentStep}
                    />
                  </div>
                </div>
                
                {/* StepLine */}
                {idx < visibleSteps.length - 1 && (
                  <StepLine isCompleted={isStepCompleted(stepNumber)} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* All Steps Popup */}
      {showAllSteps && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={() => setShowAllSteps(false)}
        >
          <div
            className="max-w-md mx-4 p-6 rounded-lg neu-raised bg-background shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">전체 단계</h3>
              <button
                onClick={() => setShowAllSteps(false)}
                className="p-1 rounded neu-flat hover:neu-inset text-neutral-500"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {steps.map((step, idx) => {
                const stepNumber = idx + 1;
                const isCompleted = isStepCompleted(stepNumber);
                const isCurrent = stepNumber === currentStep;
                const isViewing = stepNumber === viewStep;
                const isClickable = isStepClickable(stepNumber);
                
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      isViewing 
                        ? 'neu-inset bg-primary/5' 
                        : isClickable 
                          ? 'neu-flat hover:neu-raised' 
                          : 'neu-flat opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (isClickable) {
                        onStepClick?.(stepNumber);
                        setShowAllSteps(false);
                      }
                    }}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                      isViewing 
                        ? 'neu-raised text-primary' 
                        : isCompleted 
                          ? 'neu-inset text-neutral-700' 
                          : isCurrent 
                            ? 'neu-raised text-primary' 
                            : 'neu-flat text-neutral-400'
                    }`}>
                      {isCompleted ? '✓' : stepNumber}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        isViewing || isCurrent ? 'text-primary' : 'text-neutral-700'
                      }`}>
                        {step}
                      </div>
                      {isViewing && (
                        <div className="text-xs text-neutral-500">현재 보고 있는 단계</div>
                      )}
                      {isCurrent && stepNumber !== viewStep && (
                        <div className="text-xs text-neutral-500">현재 진행 단계</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepIndicator;
//#endregion 
//#region Imports
import React from 'react';
//#endregion

//#region Types
interface StepperPopupProps {
  show: boolean;
  steps: string[];
  currentStep: number;
  viewStep: number;
  completedSteps: number[];
  onClose: () => void;
  onChange?: (step: number) => void;
}
//#endregion

//#region Main Component
const StepperPopup: React.FC<StepperPopupProps> = ({
  show,
  steps,
  currentStep,
  viewStep,
  completedSteps,
  onClose,
  onChange
}) => {
  if (!show) return null;

  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber);
  };

  const isStepClickable = (stepNumber: number) => {
    return stepNumber <= currentStep || isStepCompleted(stepNumber);
  };

  const handleStepClick = (stepNumber: number) => {
    if (isStepClickable(stepNumber)) {
      onChange?.(stepNumber);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80"
      onClick={onClose}
    >
      <div
        className="max-w-md mx-4 p-6 rounded-lg neu-raised bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">전체 단계</h3>
          <button
            onClick={onClose}
            className="p-1 rounded neu-flat hover:neu-inset text-muted-foreground"
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
                onClick={() => handleStepClick(stepNumber)}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                  isViewing 
                    ? 'neu-raised text-primary' 
                    : isCompleted 
                      ? 'neu-inset text-foreground' 
                      : isCurrent 
                        ? 'neu-raised text-primary' 
                        : 'neu-flat text-muted-foreground'
                }`}>
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isViewing || isCurrent ? 'text-primary' : 'text-foreground'
                  }`}>
                    {step}
                  </div>
                  {isViewing && (
                    <div className="text-xs text-muted-foreground">현재 보고 있는 단계</div>
                  )}
                  {isCurrent && stepNumber !== viewStep && (
                    <div className="text-xs text-muted-foreground">현재 진행 단계</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepperPopup;
//#endregion 
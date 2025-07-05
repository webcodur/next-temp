//#region Imports
import React from 'react';
import { useTranslations } from '@/hooks/useI18n';
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
  const t = useTranslations();
  
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
      className="flex fixed inset-0 z-50 justify-center items-center bg-background/80"
      onClick={onClose}
    >
      <div
        className="p-6 mx-4 max-w-md rounded-lg shadow-xl neu-raised bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">{t('스테퍼_팝업_전체단계')}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded neu-flat hover:neu-inset text-muted-foreground"
          >
            ✕
          </button>
        </div>
        
        <div className="overflow-y-auto space-y-3 max-h-96">
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
                    ? 'neu-inset bg-brand/5' 
                    : isClickable 
                      ? 'neu-flat hover:neu-raised' 
                      : 'opacity-60 cursor-not-allowed neu-flat'
                }`}
                onClick={() => handleStepClick(stepNumber)}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                  isViewing 
                    ? 'neu-raised text-brand' 
                    : isCompleted 
                      ? 'neu-inset text-foreground' 
                      : isCurrent 
                        ? 'neu-raised text-brand' 
                        : 'neu-flat text-muted-foreground'
                }`}>
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isViewing || isCurrent ? 'text-brand' : 'text-foreground'
                  }`}>
                    {step}
                  </div>
                  {isViewing && (
                    <div className="text-xs text-muted-foreground">{t('스테퍼_상태_현재보는단계')}</div>
                  )}
                  {isCurrent && stepNumber !== viewStep && (
                    <div className="text-xs text-muted-foreground">{t('스테퍼_상태_현재진행단계')}</div>
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
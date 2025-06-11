// #region Imports
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// #endregion

// #region Types
interface StepperProps {
  steps: string[];
  currentStep: number; // 실제 진행된 스텝 (1-based index)
  viewStep?: number; // 현재 보고 있는 스텝 (1-based index, 기본값은 currentStep)
  completedSteps?: number[]; // 완료된 스텝들의 배열 (1-based index)
  onChange?: (step: number) => void;
}
// #endregion

// #region Animations
const stepVariants = {
  inactive: {
    scale: 1,
    opacity: 0.6,
  },
  active: {
    scale: 1.1,
    opacity: 1,
  },
  completed: {
    scale: 1,
    opacity: 1,
  },
  viewing: {
    scale: 1.05,
    opacity: 0.9,
  },
  nextAvailable: {
    scale: 1.02,
    opacity: 0.8,
  }
};

const progressVariants = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  exit: { scaleX: 0 }
};

const numberVariants = {
  initial: { rotateY: -90, opacity: 0 },
  animate: { rotateY: 0, opacity: 1 },
  exit: { rotateY: 90, opacity: 0 }
};
// #endregion

// #region Component
const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep, 
  viewStep = currentStep, 
  completedSteps = [], 
  onChange
}) => {
  if (!steps || steps.length === 0) return null;

  const handleClick = (idx: number) => {
    const stepNumber = idx + 1;
    
    // 완료된 스텝들과 현재 스텝까지는 모두 클릭 가능
    if (stepNumber <= currentStep || isStepCompleted(stepNumber)) {
      onChange?.(stepNumber);
    }
  };

  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.includes(stepNumber);
  };

  const isStepClickable = (stepNumber: number) => {
    return stepNumber <= currentStep || isStepCompleted(stepNumber);
  };

  const getStepState = (idx: number) => {
    const stepNumber = idx + 1;
    
    // 현재 보고 있는 스텝
    if (stepNumber === viewStep) {
      if (stepNumber === currentStep) return 'active';
      if (isStepCompleted(stepNumber)) return 'viewing';
      return 'viewing';
    }
    
    // 완료된 스텝
    if (isStepCompleted(stepNumber)) return 'completed';
    
    // 현재 진행 스텝 (viewStep과 다른 경우)
    if (stepNumber === currentStep) return 'active';
    
    // 다음 진행 가능한 스텝
    if (stepNumber === currentStep + 1) return 'nextAvailable';
    
    // 미래 스텝
    return 'inactive';
  };

  const getStepColors = (idx: number) => {
    const stepNumber = idx + 1;
    
    // 현재 보고 있는 스텝 (진행도와 다른 경우)
    if (stepNumber === viewStep && stepNumber !== currentStep) {
      return isStepCompleted(stepNumber) ? 'text-blue-600' : 'text-blue-500';
    }
    
    // 완료된 스텝 (보고 있지 않은 경우에도 클릭 가능 표시)
    if (isStepCompleted(stepNumber)) {
      return 'text-green-600';
    }
    
    // 현재 진행 중인 스텝
    if (stepNumber === currentStep) {
      return 'text-primary';
    }
    
    // 다음 진행 가능한 스텝
    if (stepNumber === currentStep + 1) {
      return 'text-orange-500';
    }
    
    return 'text-neutral-400';
  };

  const getStepClasses = (idx: number) => {
    const stepNumber = idx + 1;
    
    // 현재 보고 있는 스텝 (진행도와 다른 경우)
    if (stepNumber === viewStep && stepNumber !== currentStep) {
      return isStepCompleted(stepNumber) 
        ? 'neu-raised text-blue-600 border-2 border-blue-200' 
        : 'neu-raised text-blue-500 border-2 border-blue-100';
    }
    
    // 완료된 스텝 (보고 있지 않은 경우에도 클릭 가능한 스타일)
    if (isStepCompleted(stepNumber)) {
      return 'neu-inset text-green-600 hover:neu-raised transition-all cursor-pointer';
    }
    
    // 현재 진행 스텝
    if (stepNumber === currentStep) {
      return 'neu-raised text-primary';
    }
    
    // 다음 진행 가능한 스텝
    if (stepNumber === currentStep + 1) {
      return 'neu-flat text-orange-500 border border-orange-200';
    }
    
    // 미래 스텝
    return 'neu-flat text-neutral-400';
  };

  return (
    <div className="w-full">
      <div className="flex items-center w-full">
        {steps.map((label, idx) => (
          <motion.div 
            key={idx} 
            className="flex items-center flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
          >
            {/* Step Circle and Label */}
            <motion.div
              className={`flex items-center transition-colors duration-300 ${
                isStepClickable(idx + 1) ? 'cursor-pointer' : 'cursor-not-allowed'
              } ${getStepColors(idx)}`}
              onClick={() => handleClick(idx)}
              variants={stepVariants}
              animate={getStepState(idx)}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={isStepClickable(idx + 1) ? { scale: 1.05 } : { opacity: 0.7 }}
              whileTap={isStepClickable(idx + 1) ? { scale: 0.95 } : {}}
            >
              <motion.div
                className={`w-8 h-8 flex items-center justify-center rounded-full relative overflow-hidden ${getStepClasses(idx)}`}
                layout
                whileHover={
                  isStepCompleted(idx + 1) && idx + 1 !== viewStep
                    ? { scale: 1.1, transition: { duration: 0.2 } }
                    : {}
                }
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`step-${idx}-${getStepState(idx)}`}
                    variants={numberVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold"
                  >
                    {isStepCompleted(idx + 1) ? '✓' : idx + 1}
                  </motion.span>
                </AnimatePresence>
                
                {/* Active Step Pulse Effect */}
                {idx + 1 === currentStep && viewStep === currentStep && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Viewing Step Indicator */}
                {idx + 1 === viewStep && viewStep !== currentStep && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-300/50"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 0.2, 0.6],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Next Available Step Indicator */}
                {idx + 1 === currentStep + 1 && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-orange-300/40"
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.5, 0.1, 0.5],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
              
              <motion.span 
                className="ml-2 whitespace-nowrap text-sm font-medium"
                animate={{
                  opacity: isStepClickable(idx + 1) ? 1 : 0.6,
                  x: idx + 1 === viewStep ? 2 : 0,
                  fontWeight: idx + 1 === viewStep ? 600 : 500,
                }}
                transition={{ duration: 0.3 }}
              >
                {label}
                {/* 보고 있는 스텝 표시 */}
                {idx + 1 === viewStep && viewStep !== currentStep && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-1 text-xs text-blue-600"
                  >
                    👁️
                  </motion.span>
                )}
                {/* 다음 스텝 가능 표시 */}
                {idx + 1 === currentStep + 1 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-1 text-xs text-orange-500"
                  >
                    ▶️
                  </motion.span>
                )}
              </motion.span>
            </motion.div>

            {/* Progress Line */}
            {idx !== steps.length - 1 && (
              <div className="flex items-center flex-1 mx-4 relative">
                <div className="w-full h-0.5 neu-flat bg-neutral-100 rounded-sm" />
                <AnimatePresence>
                  {(isStepCompleted(idx + 1) || idx + 1 < currentStep) && (
                    <motion.div
                      className={`absolute inset-0 h-0.5 rounded-sm origin-left ${
                        isStepCompleted(idx + 1) 
                          ? 'neu-inset bg-green-400/40' 
                          : 'neu-inset bg-primary/30'
                      }`}
                      variants={progressVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ 
                        duration: 0.6, 
                        delay: idx * 0.1,
                        ease: "easeOut" 
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Navigation Helper */}
      {viewStep && viewStep !== currentStep && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-3 mt-4"
        >
          {/* 현재 진행 스텝으로 돌아가기 */}
          <motion.button
            onClick={() => onChange?.(currentStep)}
            className="px-4 py-2 neu-raised text-primary font-medium rounded-lg text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            현재 단계로 ({steps[currentStep - 1]}) ▶️
          </motion.button>
          
          {/* 다른 완료된 스텝들로 이동 */}
          {completedSteps.filter(step => step !== viewStep && step !== currentStep).length > 0 && (
            <div className="flex gap-2">
              {completedSteps
                .filter(step => step !== viewStep && step !== currentStep)
                .map(step => (
                  <motion.button
                    key={step}
                    onClick={() => onChange?.(step)}
                    className="px-3 py-1 neu-flat text-green-600 font-medium rounded text-xs border border-green-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {step}단계
                  </motion.button>
                ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
// #endregion

export default Stepper; 
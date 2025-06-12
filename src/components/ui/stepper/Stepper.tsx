// #region Imports
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// #endregion

// #region Types
interface StepperProps {
  steps: string[];
  currentStep: number; // 실제 진행된 스텝 (1-based index)
  viewStep?: number; // 현재 보고 있는 스텝 (1-based index, 기본값은 currentStep)
  completedSteps?: number[]; // 완료된 스텝들의 배열 (1-based index)
  onChange?: (step: number) => void;
  children?: React.ReactNode; // 스테퍼와 네비게이션 사이에 들어갈 컨텐츠
  maxVisibleSteps?: number; // 최대 표시할 스텝 수 (기본: 3)
  title?: string; // 스테퍼 타이틀
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

const popupVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 20 }
};
// #endregion

// #region Component
const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep, 
  viewStep = currentStep, 
  completedSteps = [], 
  onChange,
  children,
  maxVisibleSteps = 3,
  title = "단계별 진행"
}) => {
  const [showAllSteps, setShowAllSteps] = useState(false);

  if (!steps || steps.length === 0) return null;

  const shouldCompress = steps.length > maxVisibleSteps;

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

  const getStepClasses = (idx: number) => {
    const stepNumber = idx + 1;
    
    // 현재 보고 있는 스텝
    if (stepNumber === viewStep) {
      return 'neu-raised text-primary border-2 border-primary/20';
    }
    
    // 완료된 스텝
    if (isStepCompleted(stepNumber)) {
      return 'neu-inset text-neutral-700 hover:neu-raised transition-all cursor-pointer';
    }
    
    // 현재 진행 스텝
    if (stepNumber === currentStep) {
      return 'neu-raised text-primary';
    }
    
    // 다음 진행 가능한 스텝
    if (stepNumber === currentStep + 1) {
      return 'neu-flat text-neutral-600 border border-neutral-200';
    }
    
    // 미래 스텝
    return 'neu-flat text-neutral-400';
  };

  // #region Compressed Steps Helper
  const getVisibleSteps = () => {
    if (!shouldCompress) return steps;
    
    const totalSteps = steps.length;
    const half = Math.floor(maxVisibleSteps / 2);
    
    // viewStep 기준으로 앞뒤 스텝들 계산
    let startIdx = Math.max(0, viewStep - 1 - half);
    let endIdx = Math.min(totalSteps - 1, viewStep - 1 + half);
    
    // 경계 조정
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
  // #endregion

  // #region All Steps Popup
  const AllStepsPopup = () => (
    <AnimatePresence>
      {showAllSteps && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAllSteps(false)}
        >
          <motion.div
            className="max-w-md mx-4 p-6 rounded-lg neu-raised bg-background shadow-xl"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">전체 단계</h3>
              <button
                onClick={() => setShowAllSteps(false)}
                className="p-1 rounded neu-flat hover:neu-inset transition-all text-neutral-500"
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
                  <motion.div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      isViewing 
                        ? 'neu-inset bg-primary/5' 
                        : isClickable 
                          ? 'neu-flat hover:neu-raised' 
                          : 'neu-flat opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (isClickable) {
                        onChange?.(stepNumber);
                        setShowAllSteps(false);
                      }
                    }}
                    whileHover={isClickable ? { scale: 1.02 } : {}}
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
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  // #endregion

  // #region Stepper Container
  const StepperContainer = () => {
    const visibleSteps = getVisibleSteps();
    
    return (
      <div className="w-full max-w-4xl mx-auto neu-flat rounded-lg p-6">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-lg neu-inset">
          <h2 className="text-lg font-semibold text-neutral-800">{title}</h2>
          {shouldCompress && (
            <motion.button
              onClick={() => setShowAllSteps(true)}
              className="p-2 rounded-full neu-flat hover:neu-raised transition-all text-neutral-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="전체 단계 보기"
            >
              <span className="text-lg">❓</span>
            </motion.button>
          )}
        </div>
        
        {/* Steps Section */}
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            {visibleSteps.map((stepInfo, idx) => {
              const isOriginalStep = typeof stepInfo === 'string';
              const label = isOriginalStep ? stepInfo : stepInfo.label;
              const originalIndex = isOriginalStep ? idx : stepInfo.originalIndex;
              
              return (
                <motion.div 
                  key={originalIndex}
                  className="flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                >
                  {/* Step Circle and Label */}
                  <motion.div
                    className={`flex flex-col items-center min-w-[120px] transition-colors duration-300 ${
                      isStepClickable(originalIndex + 1) ? 'cursor-pointer' : 'cursor-not-allowed'
                    } text-neutral-700`}
                    onClick={() => handleClick(originalIndex)}
                    variants={stepVariants}
                    animate={getStepState(originalIndex)}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    whileHover={isStepClickable(originalIndex + 1) ? { scale: 1.05 } : { opacity: 0.7 }}
                    whileTap={isStepClickable(originalIndex + 1) ? { scale: 0.95 } : {}}
                  >
                    <motion.div
                      className={`w-10 h-10 flex items-center justify-center rounded-full relative overflow-hidden mb-2 ${getStepClasses(originalIndex)}`}
                      layout
                      whileHover={
                        isStepCompleted(originalIndex + 1) && originalIndex + 1 !== viewStep
                          ? { scale: 1.1, transition: { duration: 0.2 } }
                          : {}
                      }
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`step-${originalIndex}-${getStepState(originalIndex)}`}
                          variants={numberVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.2 }}
                          className="text-sm font-semibold"
                        >
                          {isStepCompleted(originalIndex + 1) ? '✓' : originalIndex + 1}
                        </motion.span>
                      </AnimatePresence>
                      
                      {/* Active Step Pulse Effect */}
                      {originalIndex + 1 === currentStep && viewStep === currentStep && (
                        <motion.div
                          className="absolute inset-0 border-2 rounded-full border-primary/30"
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
                      {originalIndex + 1 === viewStep && viewStep !== currentStep && (
                        <motion.div
                          className="absolute inset-0 border-2 rounded-full border-primary/20"
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
                    </motion.div>
                    
                    <motion.span 
                      className="text-xs font-medium text-center whitespace-nowrap max-w-[120px] leading-tight"
                      animate={{
                        opacity: isStepClickable(originalIndex + 1) ? 1 : 0.6,
                        y: originalIndex + 1 === viewStep ? -1 : 0,
                        fontWeight: originalIndex + 1 === viewStep ? 600 : 500,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {label}
                    </motion.span>
                  </motion.div>

                  {/* Progress Line */}
                  {idx !== visibleSteps.length - 1 && (
                    <div className="relative flex items-center flex-1 min-w-[80px] mx-4">
                      <div className="w-full h-0.5 neu-flat bg-neutral-100 rounded-sm" />
                      <AnimatePresence>
                        {(isStepCompleted(originalIndex + 1) || originalIndex + 1 < currentStep) && (
                          <motion.div
                            className="absolute inset-0 h-0.5 rounded-sm origin-left neu-inset bg-primary/20"
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
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  // #endregion

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-full">
        {/* Stepper Container */}
        <StepperContainer />

        {/* All Steps Popup */}
        <AllStepsPopup />

        {/* Content Area */}
        {children && (
          <div className="my-6">
            {children}
          </div>
        )}

        {/* Step Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mt-6"
        >
          {/* 이전 버튼 */}
          <motion.button
            onClick={() => {
              const prevStep = viewStep - 1;
              if (prevStep >= 1 && (prevStep <= currentStep || isStepCompleted(prevStep))) {
                onChange?.(prevStep);
              }
            }}
            disabled={viewStep <= 1 || !(viewStep - 1 <= currentStep || isStepCompleted(viewStep - 1))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              viewStep <= 1 || !(viewStep - 1 <= currentStep || isStepCompleted(viewStep - 1))
                ? 'neu-flat text-neutral-400 cursor-not-allowed opacity-50'
                : 'neu-raised text-neutral-700 hover:text-primary'
            }`}
            whileHover={
              viewStep > 1 && (viewStep - 1 <= currentStep || isStepCompleted(viewStep - 1))
                ? { scale: 1.02 }
                : {}
            }
            whileTap={
              viewStep > 1 && (viewStep - 1 <= currentStep || isStepCompleted(viewStep - 1))
                ? { scale: 0.98 }
                : {}
            }
          >
            <span>◀️</span>
            <span>이전</span>
          </motion.button>

          {/* 현재 단계 표시 */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg neu-flat">
            <span className="text-sm text-neutral-500">
              {viewStep} / {steps.length}
            </span>
            <span className="text-sm font-medium text-neutral-700">
              {steps[viewStep - 1]}
            </span>
          </div>

          {/* 다음 버튼 */}
          <motion.button
            onClick={() => {
              const nextStep = viewStep + 1;
              if (nextStep <= steps.length && (nextStep <= currentStep || isStepCompleted(nextStep))) {
                onChange?.(nextStep);
              }
            }}
            disabled={viewStep >= steps.length || !(viewStep + 1 <= currentStep || isStepCompleted(viewStep + 1))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              viewStep >= steps.length || !(viewStep + 1 <= currentStep || isStepCompleted(viewStep + 1))
                ? 'neu-flat text-neutral-400 cursor-not-allowed opacity-50'
                : 'neu-raised text-neutral-700 hover:text-primary'
            }`}
            whileHover={
              viewStep < steps.length && (viewStep + 1 <= currentStep || isStepCompleted(viewStep + 1))
                ? { scale: 1.02 }
                : {}
            }
            whileTap={
              viewStep < steps.length && (viewStep + 1 <= currentStep || isStepCompleted(viewStep + 1))
                ? { scale: 0.98 }
                : {}
            }
          >
            <span>다음</span>
            <span>▶️</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
// #endregion

export default Stepper; 
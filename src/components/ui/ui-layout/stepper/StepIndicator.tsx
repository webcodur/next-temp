//#region Imports
import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useI18n';
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
	onClick,
}) => {
	const getNodeClasses = () => {
		if (isViewing) {
			return 'neu-raised text-primary border-2 border-primary/20';
		}
		if (isCompleted) {
			return 'neu-inset text-foreground/80 hover:neu-raised cursor-pointer';
		}
		if (isCurrent) {
			return 'neu-raised text-primary';
		}
		if (stepNumber === currentStep + 1) {
			return 'neu-flat text-muted-foreground border border-border';
		}
		return 'neu-flat text-muted-foreground/60';
	};

	return (
		<div
			className={`w-10 h-10 flex items-center justify-center rounded-full relative overflow-hidden ${getNodeClasses()} ${
				isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
			}`}
			onClick={isClickable ? onClick : undefined}>
			<span className="text-sm font-semibold">
				{isCompleted ? '✓' : stepNumber}
			</span>
		</div>
	);
};

const StepLine: React.FC<StepLineProps> = ({ isCompleted }) => {
	return (
		<div className="flex-1 h-1 mx-2 sm:mx-4 min-w-[30px] sm:min-w-[40px] max-w-[60px] sm:max-w-[80px] neu-inset rounded-full overflow-hidden">
			<div
				className={`h-full transition-all duration-300 ${isCompleted ? 'bg-primary' : 'bg-muted'}`}
				style={{
					width: isCompleted ? '100%' : '0%',
				}}
			/>
		</div>
	);
};

const StepName: React.FC<StepNameProps> = ({
	label,
	stepNumber,
	viewStep,
	currentStep,
}) => {
	const isActive = stepNumber === viewStep || stepNumber === currentStep;

	return (
		<div className="text-center">
			<div
				className={`text-xs font-medium px-2 py-1 rounded ${
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
	title,
	className = '',
}) => {
	const t = useTranslations();
	const defaultTitle = title || t('스테퍼_제목_단계별진행');
	const [showAllSteps, setShowAllSteps] = useState(false);
	const [responsiveMaxSteps, setResponsiveMaxSteps] = useState(maxVisibleSteps);

	// 화면 크기에 따른 반응형 로직
	useEffect(() => {
		const updateMaxSteps = () => {
			const width = window.innerWidth;

			// 768px 미만(모바일/좁은 화면)에서는 2개까지만 표시
			if (width < 768) {
				setResponsiveMaxSteps(2);
			}
			// 1024px 미만(태블릿)에서는 3개까지 표시
			else if (width < 1024) {
				setResponsiveMaxSteps(3);
			}
			// 그 외에는 기본값 사용
			else {
				setResponsiveMaxSteps(maxVisibleSteps);
			}
		};

		// 초기 설정
		updateMaxSteps();

		// 리사이즈 이벤트 리스너 등록
		window.addEventListener('resize', updateMaxSteps);

		// 클린업
		return () => window.removeEventListener('resize', updateMaxSteps);
	}, [maxVisibleSteps]);

	if (!steps || steps.length === 0) return null;

	const shouldCompress = steps.length > responsiveMaxSteps;

	const isStepCompleted = (stepNumber: number) => {
		return completedSteps.includes(stepNumber);
	};

	const isStepClickable = (stepNumber: number) => {
		return stepNumber <= currentStep || isStepCompleted(stepNumber);
	};

	const getVisibleSteps = () => {
		if (!shouldCompress) return steps;

		const totalSteps = steps.length;
		const half = Math.floor(responsiveMaxSteps / 2);

		let startIdx = Math.max(0, viewStep - 1 - half);
		let endIdx = Math.min(totalSteps - 1, viewStep - 1 + half);

		if (endIdx - startIdx + 1 < responsiveMaxSteps) {
			if (startIdx === 0) {
				endIdx = Math.min(totalSteps - 1, responsiveMaxSteps - 1);
			} else if (endIdx === totalSteps - 1) {
				startIdx = Math.max(0, totalSteps - responsiveMaxSteps);
			}
		}

		return steps.slice(startIdx, endIdx + 1).map((step, idx) => ({
			label: step,
			originalIndex: startIdx + idx,
		}));
	};

	const visibleSteps = getVisibleSteps();

	return (
		<div
			className={`p-6 mx-auto w-full max-w-4xl rounded-lg neu-flat ${className}`}>
			{/* Title Section */}
			<div className="flex justify-between items-center p-4 mb-6 rounded-lg neu-inset">
				<h2 className="text-lg font-semibold text-neutral-800">{defaultTitle}</h2>
				{shouldCompress && (
					<button
						onClick={() => setShowAllSteps(true)}
						className="p-2 rounded-full neu-flat hover:neu-raised text-neutral-600"
						title={t('스테퍼_버튼_전체단계보기')}>
						<span className="text-lg">❓</span>
					</button>
				)}
			</div>

			{/* StepNodes and StepLines Section */}
			<div className="flex justify-center items-center">
				{/* 모바일: 세로 레이아웃, 데스크톱: 가로 레이아웃 */}
				<div className="flex flex-col justify-center items-center w-full sm:flex-row sm:items-center">
					{visibleSteps.map((stepInfo, idx) => {
						const isOriginalStep = typeof stepInfo === 'string';
						const label = isOriginalStep ? stepInfo : stepInfo.label;
						const originalIndex = isOriginalStep ? idx : stepInfo.originalIndex;
						const stepNumber = originalIndex + 1;

						return (
							<React.Fragment key={originalIndex}>
								{/* StepNode and StepName */}
								<div className="flex flex-col items-center min-w-[120px] py-2 sm:py-0">
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

								{/* StepLine - 모바일에서는 세로선, 데스크톱에서는 가로선 */}
								{idx < visibleSteps.length - 1 && (
									<div className="flex overflow-hidden mx-auto w-1 h-8 rounded-full sm:hidden neu-inset">
										<div
											className={`w-full transition-all duration-300 ${isStepCompleted(stepNumber) ? 'bg-primary' : 'bg-neutral-300'}`}
											style={{
												height: isStepCompleted(stepNumber) ? '100%' : '0%',
											}}
										/>
									</div>
								)}
								{idx < visibleSteps.length - 1 && (
									<div className="hidden sm:block">
										<StepLine isCompleted={isStepCompleted(stepNumber)} />
									</div>
								)}
							</React.Fragment>
						);
					})}
				</div>
			</div>

			{/* All Steps Popup */}
			{showAllSteps && (
				<div
					className="flex fixed inset-0 z-50 justify-center items-center bg-black/20"
					onClick={() => setShowAllSteps(false)}>
					<div
						className="p-6 mx-4 max-w-md rounded-lg shadow-xl neu-raised bg-background"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-neutral-800">
								전체 단계
							</h3>
							<button
								onClick={() => setShowAllSteps(false)}
								className="p-1 rounded neu-flat hover:neu-inset text-neutral-500">
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
												? 'neu-inset bg-primary/5'
												: isClickable
													? 'neu-flat hover:neu-raised'
													: 'opacity-60 cursor-not-allowed neu-flat'
										}`}
										onClick={() => {
											if (isClickable) {
												onStepClick?.(stepNumber);
												setShowAllSteps(false);
											}
										}}>
										<div
											className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
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
											<div
												className={`text-sm font-medium ${
													isViewing || isCurrent
														? 'text-primary'
														: 'text-neutral-700'
												}`}>
												{step}
											</div>
											{isViewing && (
												<div className="text-xs text-neutral-500">
													현재 보고 있는 단계
												</div>
											)}
											{isCurrent && stepNumber !== viewStep && (
												<div className="text-xs text-neutral-500">
													현재 진행 단계
												</div>
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

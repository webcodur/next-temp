/* 
  파일명: AccessControlManager.tsx
  기능: 출입제어 관리 통합 뷰 (최상위 관리자)
  책임: 출입정책 설정과 차단기 제어 기능을 통합 관리한다
*/

import React, { useState } from 'react';
import { Send, RotateCcw } from 'lucide-react';
import { useAccessControl } from './hooks/useAccessControl';
import GlobalPolicyPanel from './globalPolicy/GlobalPolicyPanel';
import BarrierControlGrid from './barrierManager/barrierControl/BarrierControlGrid';
import BarrierPolicyGrid from './barrierManager/barrierPolicy/BarrierPolicyGrid';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Button } from '@/components/ui/ui-input/button/Button';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';
import { toast } from '@/components/ui/ui-effects/toast/Toast';

// #region 타입 정의
interface AccessControlManagerProps {
	showPageHeader?: boolean;
}
// #endregion

// #region 메인 컴포넌트
const AccessControlManager: React.FC<AccessControlManagerProps> = ({
	showPageHeader = true,
}) => {
	// #region 훅
	const {
		barriers,
		barrierPolicies,
		barrierOrder,
		entryPolicy,
		returnHourEnabled,
		warningCount,
		handleBarrierToggle,
		handleOperationModeChange,
		handlePolicyUpdate,
		handleBarrierOrderChange,
		handleEntryPolicyChange,
		handleReturnHourEnabledChange,
		handleWarningCountChange,
	} = useAccessControl();
	
	// 인풋 폼 방식을 위한 상태
	const [hasChanges, setHasChanges] = useState(false);
	
	// 차단기 잠금 상태
	const [isBarrierLocked, setIsBarrierLocked] = useState(true);
	// #endregion

	// #region 인풋 폼 핸들러
	const handleSavePolicyChanges = () => {
		// 정책 변경사항 저장
		toast.success('출입 정책이 성공적으로 저장되었습니다.');
		setHasChanges(false);
	};

	const handleResetPolicyChanges = () => {
		// 정책 변경사항 초기화
		toast.info('출입 정책이 초기 상태로 복구되었습니다.');
		setHasChanges(false);
	};


	// #endregion

	// #region 렌더링
	return (
		<div className="flex flex-col gap-6">
			{showPageHeader && (
				<PageHeader 
					title="주차장 출입 관리" 
					subtitle="차단기 제어 시스템과 출입 정책 통합 관리"
				/>
			)}

			{/* 메인 콘텐츠 영역 - 2단 구조로 변경 */}
			<div className="flex flex-col gap-4 min-h-0">
				{/* 개별 차단기 (상단) */}
				<div className="neu-elevated">
					<SectionPanel 
						title="개별 차단기 제어 컨트롤러"
						headerHeight="h-[70px]"
						titleAlign="center"
						headerActions={
							<div className="flex items-center gap-3 w-auto">
								<span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
									{isBarrierLocked ? '잠금상태' : '편집상태'}
								</span>
								<SimpleToggleSwitch
									checked={!isBarrierLocked}
									onChange={(checked) => setIsBarrierLocked(!checked)}
									size="lg"
									className="w-auto"
								/>
							</div>
						}
					>
						<BarrierControlGrid
							barriers={barriers}
							barrierOrder={barrierOrder}
							isLocked={isBarrierLocked}
							onBarrierToggle={handleBarrierToggle}
							onOperationModeChange={handleOperationModeChange}
							onBarrierOrderChange={handleBarrierOrderChange}
						/>
					</SectionPanel>
				</div>

				{/* 출입 정책 설정 (하단) - 인풋 폼 방식 */}
				<div className="neu-elevated">
					<SectionPanel 
						title="출입 정책 설정"
						headerHeight="h-[70px]"
						titleAlign="center"
						headerActions={
							<div className="flex gap-2">
								<Button
									variant="outline"
									icon={RotateCcw}
									onClick={handleResetPolicyChanges}
									className="min-w-28"
								>
									복구/초기화
								</Button>
								<Button
									variant={hasChanges ? "primary" : "outline"}
									icon={Send}
									onClick={handleSavePolicyChanges}
									disabled={!hasChanges}
									className="min-w-16"
								>
									전송
								</Button>
							</div>
						}
					>
						<div className="space-y-4">

							{/* 정책 설정 콘텐츠 */}
							<div className="flex flex-col gap-4 lg:flex-row lg:items-start">
								{/* 현장 출입 정책 설정 */}
								<div className="w-full lg:max-w-xs xl:max-w-sm shrink-0">
									<div className="p-4">
										<h3 className="mb-4 text-lg font-semibold text-foreground">현장 출입 정책 설정</h3>
										<GlobalPolicyPanel
											entryPolicy={entryPolicy}
											returnHourEnabled={returnHourEnabled}
											warningCount={warningCount}
											isLocked={false}
											onEntryPolicyChange={(policy) => {
												handleEntryPolicyChange(policy);
												setHasChanges(true);
											}}
											onReturnHourEnabledChange={(enabled) => {
												handleReturnHourEnabledChange(enabled);
												setHasChanges(true);
											}}
											onWarningCountChange={(count) => {
												handleWarningCountChange(count);
												setHasChanges(true);
											}}
										/>
									</div>
								</div>

								{/* 각 차단기 설정 */}
								<div className="flex-1 w-full min-w-80 lg:min-w-96">
									<div className="p-4">
										<h3 className="mb-4 text-lg font-semibold text-foreground">각 차단기 설정</h3>
										<BarrierPolicyGrid
											barriers={barriers}
											barrierPolicies={barrierPolicies}
											barrierOrder={barrierOrder}
											returnHourEnabled={returnHourEnabled}
											onPolicyUpdate={(barrierId, policy) => {
												handlePolicyUpdate(barrierId, policy);
												setHasChanges(true);
											}}
											onBarrierOrderChange={handleBarrierOrderChange}
										/>
									</div>
								</div>
							</div>
						</div>
					</SectionPanel>
				</div>
			</div>
		</div>
	);
	// #endregion
};

export default AccessControlManager;

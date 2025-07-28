/* 
  파일명: AccessControlManager.tsx
  기능: 출입제어 관리 통합 뷰 (최상위 관리자)
  책임: 출입정책 설정과 차단기 제어 기능을 통합 관리한다
*/

import React from 'react';
import { Lock, Unlock, Send } from 'lucide-react';
import { ParkingBarrier, OperationMode } from '@/types/parking';
import { useAccessControl } from './hooks/useAccessControl';
import GlobalPolicyPanel from './globalPolicy/GlobalPolicyPanel';
import BarrierGrid from './barrierManager/BarrierGrid';
import { Button } from '@/components/ui/ui-input/button/Button';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';

// #region 타입 정의
interface AccessControlManagerProps {
	barriers: ParkingBarrier[];
	onBarrierOpen?: (barrierId: string) => void;
	onBarrierClose?: (barrierId: string) => void;
	onOperationModeChange?: (barrierId: string, mode: OperationMode) => void;
}
// #endregion

// #region 메인 컴포넌트
const AccessControlManager: React.FC<AccessControlManagerProps> = ({
	barriers: initialBarriers,
	onBarrierOpen,
	onBarrierClose,
	onOperationModeChange,
}) => {
	// #region 훅
	const {
		barriers,
		barrierPolicies,
		barrierOrder,
		entryPolicy,
		returnHourEnabled,
		warningCount,
		isLocked,
		handleBarrierToggle,
		handleOperationModeChange,
		handlePolicyUpdate,
		handleBarrierOrderChange,
		handleEntryPolicyChange,
		handleReturnHourEnabledChange,
		handleWarningCountChange,
		handleLockToggle,
		handleSaveChanges,
	} = useAccessControl({
		initialBarriers,
		onBarrierOpen,
		onBarrierClose,
		onOperationModeChange,
	});
	// #endregion

	// #region 렌더링
	return (
		<div className="flex flex-col gap-6">
			{/* 잠금상태 컨트롤 버튼 */}
			<div className="flex gap-2 justify-end">
				<Button
					onClick={handleLockToggle}
					variant={!isLocked ? 'default' : 'outline'}
					size="lg"
				>
					{!isLocked ? <Unlock /> : <Lock />}
					{!isLocked ? '편집상태' : '잠금상태'}
				</Button>
				<Button
					onClick={handleSaveChanges}
					disabled={isLocked}
					variant={!isLocked ? 'default' : 'outline'}
					size="lg"
				>
					<Send />
					완료
				</Button>
			</div>

			{/* 메인 콘텐츠 영역 - 반응형 최적화 */}
			<div className="flex flex-col gap-4 min-h-0 lg:flex-row lg:items-start">
				{/* 현장 출입 정책 설정 패널 - 가로폭 축소 */}
				<div className="w-full lg:max-w-xs xl:max-w-sm shrink-0">
					<SectionPanel title="현장 출입 정책 설정">
						<GlobalPolicyPanel
							entryPolicy={entryPolicy}
							returnHourEnabled={returnHourEnabled}
							warningCount={warningCount}
							isLocked={isLocked}
							onEntryPolicyChange={handleEntryPolicyChange}
							onReturnHourEnabledChange={handleReturnHourEnabledChange}
							onWarningCountChange={handleWarningCountChange}
						/>
					</SectionPanel>
				</div>

				{/* 개별 차단기 관리 패널 - 최소 길이 할당 */}
				<div className="overflow-hidden flex-1 w-full min-w-80 lg:min-w-96">
					<SectionPanel title="개별 차단기 관리">
						<BarrierGrid
							barriers={barriers}
							barrierPolicies={barrierPolicies}
							barrierOrder={barrierOrder}
							returnHourEnabled={returnHourEnabled}
							isLocked={isLocked}
							onBarrierToggle={handleBarrierToggle}
							onOperationModeChange={handleOperationModeChange}
							onPolicyUpdate={handlePolicyUpdate}
							onBarrierOrderChange={handleBarrierOrderChange}
						/>
					</SectionPanel>
				</div>
			</div>
		</div>
	);
	// #endregion
};

export default AccessControlManager;

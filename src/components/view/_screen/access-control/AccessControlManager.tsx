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
import SectionDivider from '@/components/ui/ui-layout/section-divider/SectionDivider';

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
		<div className="flex flex-col gap-10">
			{/* 잠금상태 컨트롤 버튼 */}
			<div className="flex gap-2 justify-end mb-4">
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

			{/* 현장 출입 정책 설정 */}
			<SectionDivider title="현장 출입 정책 설정" />
			<GlobalPolicyPanel
				entryPolicy={entryPolicy}
				returnHourEnabled={returnHourEnabled}
				warningCount={warningCount}
				isLocked={isLocked}
				onEntryPolicyChange={handleEntryPolicyChange}
				onReturnHourEnabledChange={handleReturnHourEnabledChange}
				onWarningCountChange={handleWarningCountChange}
			/>

			{/* 개별 차단기 관리 */}
			<SectionDivider title="개별 차단기 관리" />
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
		</div>
	);
	// #endregion
};

export default AccessControlManager;

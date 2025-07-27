/* 
  파일명: AccessControlManager.tsx
  기능: 출입제어 관리 통합 뷰 (최상위 관리자)
  책임: 출입정책 설정과 차단기 제어 기능을 통합 관리한다
*/

import React from 'react';
import { ParkingBarrier, OperationMode } from '@/types/parking';
import { useAccessControl } from './hooks/useAccessControl';
import GlobalPolicyPanel from './globalPolicy/GlobalPolicyPanel';
import BarrierGrid from './barrierManager/BarrierGrid';

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
		handleBarrierToggle,
		handleOperationModeChange,
		handlePolicyUpdate,
		handleBarrierOrderChange,
		handleEntryPolicyChange,
		handleReturnHourEnabledChange,
		handleWarningCountChange,
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
			{/* 현장 출입 정책 설정 */}
			<div className="flex gap-3 items-baseline">
				<div className="w-3 h-3 bg-foreground"></div>
				<h2 className="text-xl text-foreground font-multilang">
					현장 출입 정책 설정
				</h2>
				<div className="flex-1 mt-3 border-t border-foreground/10"></div>
			</div>
			<GlobalPolicyPanel
				entryPolicy={entryPolicy}
				returnHourEnabled={returnHourEnabled}
				warningCount={warningCount}
				onEntryPolicyChange={handleEntryPolicyChange}
				onReturnHourEnabledChange={handleReturnHourEnabledChange}
				onWarningCountChange={handleWarningCountChange}
			/>

			{/* 개별 차단기 관리 */}
			<div className="flex gap-4 items-center">
				<div className="w-3 h-3 bg-foreground"></div>
				<h2 className="text-xl text-foreground font-multilang">
					개별 차단기 관리
				</h2>
				<div className="flex-1 border-t border-foreground/10"></div>
			</div>
			<BarrierGrid
				barriers={barriers}
				barrierPolicies={barrierPolicies}
				barrierOrder={barrierOrder}
				returnHourEnabled={returnHourEnabled}
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

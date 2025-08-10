/* 
  파일명: BarrierManager.tsx
  기능: 차단기 관리 시스템 최상위 컴포넌트
  책임: 전체 상태 관리와 하위 컴포넌트 조율을 담당한다.
*/

import React from 'react';
import { ParkingBarrier, OperationMode } from '@/types/parking';

import { useBarrierManager } from '@/hooks/domain/useBarrierManager';
import PolicyPanel from '../policyManager/PolicyPanel';

// #region 타입 정의
interface BarrierManagerProps {
  barriers: ParkingBarrier[];
  onBarrierOpen?: (barrierId: string) => void;
  onBarrierClose?: (barrierId: string) => void;
  onOperationModeChange?: (barrierId: string, mode: OperationMode) => void;
}
// #endregion

// #region 메인 컴포넌트
const BarrierManager: React.FC<BarrierManagerProps> = ({
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
  } = useBarrierManager({
    initialBarriers,
    onBarrierOpen,
    onBarrierClose,
    onOperationModeChange,
  });
  // #endregion

  // #region 렌더링
  return (
    <div className="space-y-6">
      <PolicyPanel
        barriers={barriers}
        barrierPolicies={barrierPolicies}
        barrierOrder={barrierOrder}
        entryPolicy={entryPolicy}
        returnHourEnabled={returnHourEnabled}
        warningCount={warningCount}
        onBarrierToggle={handleBarrierToggle}
        onOperationModeChange={handleOperationModeChange}
        onPolicyUpdate={handlePolicyUpdate}
        onBarrierOrderChange={handleBarrierOrderChange}
        onEntryPolicyChange={handleEntryPolicyChange}
        onReturnHourEnabledChange={handleReturnHourEnabledChange}
        onWarningCountChange={handleWarningCountChange}
      />
    </div>
  );
  // #endregion
};

export default BarrierManager;
// #endregion 
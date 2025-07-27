/* 
  파일명: Settings.tsx
  기능: 차단기별 세부 정책 설정 컴포넌트
  책임: 회차시간, 블랙리스트 설정과 차량 유형 설정 모달을 관리한다.
*/

import React, { useState } from 'react';
import { Sliders } from 'lucide-react';

import { VehicleAccessPolicy } from '@/types/parking';
import { createEmptyAccessPolicy } from '@/data/vehiclePolicyData';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';
import Modal from '@/components/ui/ui-layout/modal/Modal';

import VehicleConfig from './VehicleConfig'

// #region 타입 정의
interface BarrierPolicy {
  workHour: boolean;
  blacklist: boolean;
}

interface SettingsProps {
  barrierName: string;
  policy: BarrierPolicy;
  onPolicyUpdate: (policy: BarrierPolicy) => void;
  isEditMode?: boolean;
  disabled?: boolean;
  globalReturnHourEnabled?: boolean;
}
// #endregion

// #region 설정 컴포넌트
const Settings: React.FC<SettingsProps> = ({
  barrierName,
  policy,
  onPolicyUpdate,
  isEditMode = false,
  disabled = false,
  globalReturnHourEnabled = false,
}) => {
  // #region 상태
  const [showVehicleConfigModal, setShowVehicleConfigModal] = useState(false);
  const [vehiclePolicies, setVehiclePolicies] = useState<VehicleAccessPolicy>(createEmptyAccessPolicy);
  // #endregion

  // #region 핸들러
  const handleWorkHourChange = (value: boolean) => {
    if (disabled) return;
    onPolicyUpdate({ ...policy, workHour: value });
  };

  const handleBlacklistChange = (value: boolean) => {
    if (disabled) return;
    onPolicyUpdate({ ...policy, blacklist: value });
  };

  const handleVehiclePolicyUpdate = (newPolicies: VehicleAccessPolicy) => {
    setVehiclePolicies(newPolicies);
  };

  const handleOpenVehicleConfig = () => {
    if (disabled) return;
    setShowVehicleConfigModal(true);
  };
  // #endregion

  // #region 렌더링
  return (
    <>
      <div className="space-y-3">
        {/* 회차시간 토글 - 전역 설정이 활성화된 경우에만 표시 */}
        {globalReturnHourEnabled && (
          <SimpleToggleSwitch
            label="회차시간"
            checked={policy.workHour}
            onChange={handleWorkHourChange}
            size="sm"
            disabled={disabled || !isEditMode}
          />  
        )}

        {/* 블랙리스트 토글 - 전역 설정이 활성화된 경우에만 표시 */}
        {globalReturnHourEnabled && (
          <SimpleToggleSwitch
            label="블랙리스트"
            checked={policy.blacklist}
            onChange={handleBlacklistChange}
            size="sm"
            disabled={disabled || !isEditMode}
          />
        )}

        {/* 출입 유형 설정 버튼 */}
        <button
          onClick={handleOpenVehicleConfig}
          disabled={disabled}
          className={`w-full p-3 rounded-lg text-sm font-medium transition-all neu-raised hover:neu-inset bg-background text-foreground flex items-center justify-center gap-2 ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <Sliders className="w-4 h-4" />
          출입 유형 설정
        </button>
      </div>

      {/* 차량 유형 설정 모달 */}
      <Modal
        isOpen={showVehicleConfigModal}
        onClose={() => setShowVehicleConfigModal(false)}
        title={`${barrierName} - 출입 유형 설정`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            이 차단기를 통과할 수 있는 차량 유형을 설정하세요.
          </p>
          
          <VehicleConfig
            policies={vehiclePolicies}
            onPolicyUpdate={handleVehiclePolicyUpdate}
            isEditMode={true}
          />
          
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button
              onClick={() => setShowVehicleConfigModal(false)}
              className="px-4 py-2 text-sm rounded-md neu-raised bg-background text-foreground hover:neu-flat"
            >
              닫기
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
  // #endregion
};

export default Settings;
// #endregion 
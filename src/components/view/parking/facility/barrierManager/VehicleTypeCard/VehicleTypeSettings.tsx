import React from 'react';

import { VehicleAccessPolicy, VehicleType } from '@/types/parking';
import { VEHICLE_TYPES } from '@/data/vehiclePolicyData';

interface VehicleTypeSettingsProps {
  policies: VehicleAccessPolicy;
  onPolicyUpdate: (policies: VehicleAccessPolicy) => void;
  isEditMode?: boolean;
}

// #region 출입 유형 차량 설정 컴포넌트
const VehicleTypeSettings: React.FC<VehicleTypeSettingsProps> = ({
  policies,
  onPolicyUpdate,
  isEditMode = false,
}) => {

  // 정책 토글
  const handleTogglePolicy = (category: VehicleType) => {
    if (!isEditMode) return;
    
    const newPolicies = {
      ...policies,
      [category]: !policies[category],
    };
    onPolicyUpdate(newPolicies);
  };


  return (
    <div className="space-y-3">

      {/* 정책 목록 */}
      <div className="grid grid-cols-2 gap-2">
        {VEHICLE_TYPES.map((category) => {
          const isEnabled = policies[category] || false;
          
          return (
            <label
              key={category}
              className={`flex items-center gap-2 p-2 rounded-md transition-all ${
                isEditMode
                  ? 'cursor-pointer hover:neu-inset'
                  : 'cursor-default opacity-60'
              } ${
                isEnabled
                  ? 'neu-inset text-primary bg-primary/10'
                  : 'neu-flat'
              }`}
            >
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={() => handleTogglePolicy(category)}
                disabled={!isEditMode}
                className="w-3 h-3 rounded border border-border"
              />
              <span className="font-medium font-multilang">
                {category}
              </span>
            </label>
          );
        })}
      </div>

    </div>
  );
};

export default VehicleTypeSettings;
// #endregion 
/* 
  파일명: VehicleConfig.tsx
  기능: 차량 유형별 출입 설정 컴포넌트
  책임: 차단기별 차량 유형 출입 정책을 관리한다.
*/

import React from 'react';

import { VehicleAccessPolicy, VehicleType } from '@/types/parking';
import { VEHICLE_TYPES } from '@/data/vehiclePolicyData';

// #region 타입 정의
interface VehicleConfigProps {
  policies: VehicleAccessPolicy;
  onPolicyUpdate: (policies: VehicleAccessPolicy) => void;
  isLocked?: boolean;
}
// #endregion

// #region 차량 유형 설정 컴포넌트
const VehicleConfig: React.FC<VehicleConfigProps> = ({
  policies,
  onPolicyUpdate,
  isLocked = true,
}) => {

  // #region 핸들러
  const handleTogglePolicy = (category: VehicleType) => {
    if (isLocked) return;
    
    const newPolicies = {
      ...policies,
      [category]: !policies[category],
    };
    onPolicyUpdate(newPolicies);
  };
  // #endregion

  // #region 렌더링
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
                !isLocked
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
                disabled={isLocked}
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
  // #endregion
};

export default VehicleConfig;
// #endregion 
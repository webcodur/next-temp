import React from 'react';

interface VehicleTypeSettingsProps {
  policies: Record<string, boolean>;
  onPolicyUpdate: (policies: Record<string, boolean>) => void;
  isEditMode?: boolean;
  isReadOnly?: boolean;
}

// #region 차량 유형 카테고리
const vehicleTypeCategories = [
  '입주',
  '방문',
  '업무',
  '정기',
  '임대',
  '상가',
  '미등록',
  '택시(택배 포함)',
];
// #endregion

// #region 출입 유형 차량 설정 컴포넌트
const VehicleTypeSettings: React.FC<VehicleTypeSettingsProps> = ({
  policies,
  onPolicyUpdate,
  isEditMode = false,
  isReadOnly = false,
}) => {

  // 정책 토글
  const handleTogglePolicy = (category: string) => {
    if (!isEditMode) return;
    
    const newPolicies = {
      ...policies,
      [category]: !policies[category],
    };
    onPolicyUpdate(newPolicies);
  };

  const enabledCount = Object.values(policies).filter(Boolean).length;
  const totalCount = vehicleTypeCategories.length;
  const coveragePercentage = Math.round((enabledCount / totalCount) * 100);

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-foreground font-multilang">
            출입 유형 차량 설정
          </h4>
          <div className="text-xs text-muted-foreground font-multilang">
            {enabledCount}/{totalCount}개 ({coveragePercentage}%)
          </div>
        </div>
      </div>

      {/* 정책 목록 */}
      <div className="grid grid-cols-2 gap-2">
        {vehicleTypeCategories.map((category) => {
          const isEnabled = policies[category] || false;
          
          return (
            <label
              key={category}
              className={`flex items-center gap-2 p-2 rounded-md transition-all ${
                isEditMode
                  ? 'cursor-pointer hover:neu-inset'
                  : 'cursor-default'
              } ${
                isEnabled
                  ? 'neu-inset text-primary bg-primary/10'
                  : 'neu-flat'
              }`}
              onClick={isEditMode ? () => handleTogglePolicy(category) : undefined}
            >
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={() => handleTogglePolicy(category)}
                disabled={!isEditMode}
                className="w-3 h-3 rounded border border-border"
              />
              <span className="text-xs font-medium font-multilang">
                {category}
              </span>
            </label>
          );
        })}
      </div>



      {/* 읽기 전용 모드 안내 */}
      {isReadOnly && (
        <div className="text-xs text-muted-foreground text-center font-multilang">
          읽기 전용 모드 - 편집 권한이 없습니다
        </div>
      )}
    </div>
  );
};

export default VehicleTypeSettings;
// #endregion 
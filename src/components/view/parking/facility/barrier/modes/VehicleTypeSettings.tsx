import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

interface VehicleTypeSettingsProps {
  policies: Record<string, boolean>;
  onPolicyUpdate: (policies: Record<string, boolean>) => void;
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
  isReadOnly = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [localPolicies, setLocalPolicies] = useState<Record<string, boolean>>(policies);

  // 편집 모드 시작
  const handleStartEdit = () => {
    setLocalPolicies(policies);
    setIsEditMode(true);
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setLocalPolicies(policies);
    setIsEditMode(false);
  };

  // 편집 저장
  const handleSaveEdit = () => {
    onPolicyUpdate(localPolicies);
    setIsEditMode(false);
  };

  // 정책 토글
  const handleTogglePolicy = (category: string) => {
    if (!isEditMode) return;
    
    setLocalPolicies((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (!isEditMode) return;
    
    const allEnabled = vehicleTypeCategories.every((cat) => localPolicies[cat]);
    const newPolicies: Record<string, boolean> = {};
    
    vehicleTypeCategories.forEach((cat) => {
      newPolicies[cat] = !allEnabled;
    });
    
    setLocalPolicies(newPolicies);
  };

  const enabledCount = Object.values(isEditMode ? localPolicies : policies).filter(Boolean).length;
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

        {!isReadOnly && (
          <div className="flex items-center gap-1">
            {isEditMode ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="p-1 neu-raised hover:neu-inset rounded text-success"
                  title="저장"
                >
                  <Save className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 neu-raised hover:neu-inset rounded text-muted-foreground"
                  title="취소"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <button
                onClick={handleStartEdit}
                className="p-1 neu-raised hover:neu-inset rounded text-primary"
                title="편집"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 편집 모드일 때 전체 선택 버튼 */}
      {isEditMode && (
        <div className="flex justify-end">
          <button
            onClick={handleSelectAll}
            className="px-2 py-1 text-xs rounded-md neu-raised hover:neu-inset"
          >
            {enabledCount === totalCount ? '전체 해제' : '전체 선택'}
          </button>
        </div>
      )}

      {/* 정책 목록 */}
      <div className="grid grid-cols-2 gap-2">
        {vehicleTypeCategories.map((category) => {
          const isEnabled = (isEditMode ? localPolicies : policies)[category] || false;
          
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
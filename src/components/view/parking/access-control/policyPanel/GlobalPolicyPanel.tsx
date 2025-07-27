/* 
  파일명: GlobalPolicyPanel.tsx
  기능: 전역 정책 설정 패널
  책임: 출입 허용, 회차시간 사용, 블랙리스트 등록 기준 설정을 담당한다.
*/

import React from 'react';
import { SimpleRadioGroup } from '@/components/ui/ui-input/simple-input/SimpleRadioGroup';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';

import { EntryPolicyType } from '../useAccessControl';

// #region 타입 정의
interface GlobalPolicyPanelProps {
  entryPolicy: EntryPolicyType;
  returnHourEnabled: boolean;
  warningCount: number;
  onEntryPolicyChange: (policy: EntryPolicyType) => void;
  onReturnHourEnabledChange: (enabled: boolean) => void;
  onWarningCountChange: (count: number) => void;
}
// #endregion

// #region 메인 컴포넌트
const GlobalPolicyPanel: React.FC<GlobalPolicyPanelProps> = ({
  entryPolicy,
  returnHourEnabled,
  warningCount,
  onEntryPolicyChange,
  onReturnHourEnabledChange,
  onWarningCountChange,
}) => {
  
  // #region 핸들러
  const handleEntryPolicyChange = (value: string) => {
    onEntryPolicyChange(value as EntryPolicyType);
  };
  // #endregion

  // #region 렌더링
  return (
    <div className="space-y-8">
      {/* 섹션 헤더 - 신문지 스타일 */}
      <div className="flex gap-3 items-baseline">
          <h1 className="text-2xl font-black tracking-tight text-foreground font-multilang">
            전역 정책 설정
          </h1>
          <div className="flex-1 mt-3 border-t border-foreground/10"></div>
        </div>

      {/* 정책 설정 그리드 - 신문지 컬럼 레이아웃 */}
      <div className="grid gap-1 lg:grid-cols-3">
        {/* 출입 허용 정책 */}
        <div className="p-6 border-r border-border/30 lg:border-r-2">
          <div className="space-y-4">
            <div className="pb-2 border-b border-foreground/10">
              <h2 className="text-sm font-black tracking-wide text-foreground font-multilang">
                01. 출입 제어
              </h2>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                기본 접근 권한 설정
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center h-11">
                <SimpleRadioGroup
                  label=""
                  value={entryPolicy}
                  onChange={handleEntryPolicyChange}
                  layout="horizontal"
                  className="w-full [&>div:last-child]:min-h-0 [&>div:last-child]:h-auto [&>div:last-child]:gap-0 [&>div:last-child>div]:flex-1"
                  options={[
                    { label: '전체 차량 허용', value: 'all' },
                    { label: '등록차량만 허용', value: 'office' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 회차시간 제어 */}
        <div className="p-6 border-r border-border/30 lg:border-r-2">
          <div className="space-y-4">
            <div className="pb-2 border-b border-foreground/10">
              <h2 className="text-sm font-black tracking-wide text-foreground font-multilang">
                02. 시간 정책
              </h2>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                시간 기반 정책 활성화
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center h-11">
                <SimpleToggleSwitch
                  label="회차시간 사용"
                  checked={returnHourEnabled}
                  onChange={onReturnHourEnabledChange}
                  size="md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 블랙리스트 기준 */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="pb-2 border-b border-foreground/10">
              <h2 className="text-sm font-black tracking-wide text-foreground font-multilang">
                03. 블랙리스트 기준
              </h2>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                자동 차단 임계값 설정
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3 items-center h-11">
                <span className="text-sm font-medium text-foreground font-multilang">경고</span>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={99}
                    className="px-3 py-2 w-16 h-8 text-lg font-black text-center rounded-lg border transition-all duration-200 outline-none bg-background border-border neu-flat hover:neu-inset focus:neu-inset focus:border-primary/40"
                    value={warningCount}
                    onChange={(e) => onWarningCountChange(Number(e.target.value))}
                  />
                </div>
                <span className="text-sm font-medium text-foreground font-multilang">회 이상</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 - 신문지 스타일 */}
      <div className="flex gap-4 items-center">
          <div className="w-3 h-3 bg-foreground"></div>
          <h2 className="text-lg font-black tracking-wide text-foreground font-multilang">
            차단기 관리
          </h2>
          <div className="flex-1 border-t border-foreground/10"></div>
        </div>
    </div>
  );
  // #endregion
};

export default GlobalPolicyPanel;
// #endregion 
/* 
  파일명: GlobalPolicyPanel.tsx
  기능: 전역 정책 설정 패널
  책임: 출입 허용, 회차시간 사용, 블랙리스트 등록 기준 설정을 담당한다.
*/

import React from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';

import { EntryPolicyType } from '../hooks/useAccessControl';

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
      {/* 정책 설정 그리드 - 컬럼 레이아웃 */}
      <div className="grid gap-1 lg:grid-cols-3">
        
        {/* 출입 허용 대상 */}
        <div className="p-6 border-r border-border/30 lg:border-r-2">
          <div className="space-y-4">
            <div className="pb-2 border-b border-foreground/10">
              <h2 className="text-sm font-black tracking-wide text-foreground font-multilang">
                01. 출입 허용 대상
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center h-11">
                <div className="flex gap-2 w-full">
                  <Button
                    variant={entryPolicy === 'all' ? 'inset' : 'outline'}
                    size="default"
                    onClick={() => handleEntryPolicyChange('all')}
                    className="flex-1"
                  >
                    전체 차량
                  </Button>
                  <Button
                    variant={entryPolicy === 'office' ? 'inset' : 'outline'}
                    size="default"
                    onClick={() => handleEntryPolicyChange('office')}
                    className="flex-1"
                  >
                    등록된 차량
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 회차 정책 */}
        <div className="p-6 border-r border-border/30 lg:border-r-2">
          <div className="space-y-4">
            <div className="pb-2 border-b border-foreground/10">
              <h2 className="text-sm font-black tracking-wide text-foreground font-multilang">
                02. 회차 정책
              </h2>
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
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3 justify-between items-center h-11">
                <div className="text-sm font-medium text-foreground font-multilang">경고 횟수</div>
                <div className="flex relative gap-2 items-center">
                  <input
                    type="number"
                    min={1}
                    max={99}
                    className="px-3 py-2 w-16 h-8 text-lg font-black text-center rounded-lg border transition-all duration-200 outline-none bg-background border-border neu-flat hover:neu-inset focus:neu-inset focus:border-primary/40"
                    value={warningCount}
                    onChange={(e) => onWarningCountChange(Number(e.target.value))}
                  />
                  <span className="text-sm font-medium text-foreground font-multilang">회 이상</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // #endregion
};

export default GlobalPolicyPanel;
// #endregion 
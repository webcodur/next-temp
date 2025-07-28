/* 
  파일명: GlobalPolicyPanel.tsx
  기능: 전역 정책 설정 패널
  책임: 출입 허용, 회차시간 사용, 블랙리스트 등록 기준 설정을 담당한다.
*/

import React from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';

import { EntryPolicyType } from '../hooks/useAccessControl';

// #region 스타일 상수
const STYLES = {
  // 레이아웃
  container: 'space-y-4 p-6',
  grid: 'space-y-6',
  
  // 섹션 공통
  section: 'p-4 rounded-lg border bg-background/50',
  sectionContent: 'space-y-4',
  sectionBody: 'space-y-3',
  
  // 헤더
  header: 'pb-2 border-b border-foreground/10',
  title: 'text-base text-foreground font-multilang font-bold',
  
  // 컨테이너
  rowContainer: 'flex items-center h-11',
  buttonContainer: 'flex gap-2 w-full',
  inputContainer: 'flex gap-3 justify-between items-center h-11',
  inputWrapper: 'flex relative gap-2 items-center',
  
  // 텍스트
  label: 'text-sm font-medium text-foreground font-multilang',
  
  // 입력 필드
  numberInput: 'px-3 py-2 w-16 h-8 text-lg font-black text-center rounded-lg border transition-all duration-200 outline-none bg-background border-border neu-flat hover:neu-inset focus:neu-inset focus:border-primary/40',
} as const;
// #endregion

// #region 타입 정의
interface GlobalPolicyPanelProps {
  entryPolicy: EntryPolicyType;
  returnHourEnabled: boolean;
  warningCount: number;
  isLocked?: boolean;
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
  isLocked = true,
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
    <div className={STYLES.container}>
      {/* 정책 설정 그리드 - 컬럼 레이아웃 */}
      <div className={STYLES.grid}>
        
        {/* 출입 허용 대상 */}
        <div className={STYLES.section}>
          <div className={STYLES.sectionContent}>
            <div className={STYLES.header}>
              <h2 className={STYLES.title}>
                01. 출입 허용 대상
              </h2>
            </div>
            <div className={STYLES.sectionBody}>
              <div className={STYLES.rowContainer}>
                <div className={STYLES.buttonContainer}>
                  <Button
                    variant={entryPolicy === 'all' ? 'inset' : 'outline'}
                    size="default"
                    onClick={() => handleEntryPolicyChange('all')}
                    className="flex-1"
                    disabled={isLocked}
                  >
                    전체 차량
                  </Button>
                  <Button
                    variant={entryPolicy === 'office' ? 'inset' : 'outline'}
                    size="default"
                    onClick={() => handleEntryPolicyChange('office')}
                    className="flex-1"
                    disabled={isLocked}
                  >
                    등록된 차량
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 회차 정책 */}
        <div className={STYLES.section}>
          <div className={STYLES.sectionContent}>
            <div className={STYLES.header}>
              <h2 className={STYLES.title}>
                02. 회차 정책
              </h2>
            </div>
            <div className={STYLES.sectionBody}>
              <div className={STYLES.rowContainer}>
                <SimpleToggleSwitch
                  label="회차시간 사용"
                  checked={returnHourEnabled}
                  onChange={onReturnHourEnabledChange}
                  size="md"
                  disabled={isLocked}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 블랙리스트 기준 */}
        <div className={STYLES.section}>
          <div className={STYLES.sectionContent}>
            <div className={STYLES.header}>
              <h2 className={STYLES.title}>
                03. 블랙리스트 기준
              </h2>
            </div>
            
            <div className={STYLES.sectionBody}>
              <div className={STYLES.inputContainer}>
                <div className={STYLES.label}>경고 횟수</div>
                <div className={STYLES.inputWrapper}>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    className={STYLES.numberInput}
                    value={warningCount}
                    onChange={(e) => onWarningCountChange(Number(e.target.value))}
                    disabled={isLocked}
                  />
                  <span className={STYLES.label}>회 이상</span>
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
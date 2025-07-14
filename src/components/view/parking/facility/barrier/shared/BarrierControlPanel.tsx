import React from 'react';
import { ArrowUpDown, Settings, CheckCircle, Zap, RotateCcw } from 'lucide-react';
import { ParkingBarrier, OperationMode } from '@/types/parking';

interface BarrierControlPanelProps {
  barrier: ParkingBarrier;
  onToggle: () => void;
  onOperationModeChange: (mode: OperationMode) => void;
  layout?: 'horizontal' | 'vertical';
}

// #region 운영 모드별 아이콘 컴포넌트
const getOperationModeIcon = (mode: OperationMode) => {
  switch (mode) {
    case 'always-open':
      return <CheckCircle className="w-3 h-3" />;
    case 'bypass':
      return <Zap className="w-3 h-3" />;
    case 'auto-operation':
      return <RotateCcw className="w-3 h-3" />;
    default:
      return <CheckCircle className="w-3 h-3" />;
  }
};
// #endregion

// #region 운영 모드 옵션
const operationModeOptions = [
  { value: 'always-open', label: '항시 열림' },
  { value: 'bypass', label: '바이패스' },
  { value: 'auto-operation', label: '자동 운행' },
] as const;
// #endregion

// #region 차단기 컨트롤 패널 컴포넌트
const BarrierControlPanel: React.FC<BarrierControlPanelProps> = ({
  barrier,
  onToggle,
  onOperationModeChange,
  layout = 'horizontal',
}) => {
  const controlsClass = layout === 'horizontal' 
    ? 'flex justify-between items-center gap-2'
    : 'flex flex-col gap-3';

  return (
    <div className={`p-2 rounded-lg bg-muted/50 ${controlsClass}`}>
      {/* 운영 모드 */}
      <div className={`flex items-center gap-1 ${layout === 'vertical' ? 'justify-center' : ''}`}>
        <Settings className="w-4 h-4 text-muted-foreground" />
        {getOperationModeIcon(barrier.operationMode)}
        <select
          value={barrier.operationMode}
          onChange={(e) => onOperationModeChange(e.target.value as OperationMode)}
          className="px-2 py-1 text-sm rounded border border-border bg-background min-w-[100px]"
        >
          {operationModeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 개폐 상태 및 토글 */}
      <div className={`flex items-center gap-1 ${layout === 'vertical' ? 'justify-center' : ''}`}>
        <div className={`w-3 h-3 rounded-full ${
          barrier.isOpen ? 'bg-success' : 'bg-destructive'
        }`} />
        
        <button
          onClick={onToggle}
          className={`flex items-center gap-1 px-2 py-1 text-sm rounded-md neu-raised hover:neu-inset transition-all ${
            barrier.isOpen ? 'text-destructive' : 'text-success'
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BarrierControlPanel;
// #endregion 
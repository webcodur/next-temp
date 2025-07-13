import React from 'react';
import { Settings, Car, Construction } from 'lucide-react';
import { GlobalFunctionMode } from '../types';

interface FunctionModeToggleProps {
  currentMode: GlobalFunctionMode;
  onModeChange: (mode: GlobalFunctionMode) => void;
}

// #region 기능 모드 토글 컴포넌트
const FunctionModeToggle: React.FC<FunctionModeToggleProps> = ({
  currentMode,
  onModeChange,
}) => {

  return (
    <section className="flex justify-between items-center p-4 rounded-lg neu-flat">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground font-multilang">
          차단기 관리
        </h2>
        <div className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-muted">
          <Settings className="w-3 h-3" />
          <span className="font-medium">
            {currentMode === 'vehicle-type' ? '출입유형 관리' : '차단기 운영'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-multilang">
          기능 모드:
        </span>
        
        <div className="flex items-center rounded-lg neu-flat p-1">
          <button
            onClick={() => onModeChange('vehicle-type')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all ${
              currentMode === 'vehicle-type'
                ? 'neu-inset text-primary bg-primary/10'
                : 'neu-raised hover:neu-inset'
            }`}
          >
            <Car className="w-3 h-3" />
            <span className="text-sm font-medium">출입유형</span>
          </button>
          
          <button
            onClick={() => onModeChange('barrier-operation')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all ${
              currentMode === 'barrier-operation'
                ? 'neu-inset text-primary bg-primary/10'
                : 'neu-raised hover:neu-inset'
            }`}
          >
            <Construction className="w-3 h-3" />
            <span className="text-sm font-medium">차단기 운영</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FunctionModeToggle;
// #endregion 
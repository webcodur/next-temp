import React from 'react';
import FieldTimePicker from '@/components/ui/ui-input/field/time/FieldTimePicker';
import { FIELD_STYLES } from '@/components/ui/ui-input/field/core/config';

interface TimeRangePickerProps {
  label?: string;
  startId: string;
  endId: string;
  startValue?: string; // "HH:mm"
  endValue?: string;
  onStartChange?: (value: string) => void;
  onEndChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * 시·분 시작/종료 범위를 선택하는 컴포넌트
 * - 내부적으로 두 개의 `FieldTimePicker` 를 사용한다.
 * - 한 줄 배치, 필요 시 `flex-col` 등으로 변경 가능.
 */
const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  label,
  startId,
  endId,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`${FIELD_STYLES.fieldWrapper} ${className}`}>
      {label && <span className="font-multilang text-sm font-medium text-foreground">{label}</span>}
      <div className="flex items-center gap-2">
        <FieldTimePicker
          id={startId}
          label="시작"
          value={startValue}
          onChange={onStartChange}
          disabled={disabled}
          className="w-36 !p-0 !border-0 !bg-transparent !shadow-none !neu-none"
        />
        <span className="text-sm shrink-0">~</span>
        <FieldTimePicker
          id={endId}
          label="종료"
          value={endValue}
          onChange={onEndChange}
          disabled={disabled}
          className="w-36 !p-0 !border-0 !bg-transparent !shadow-none !neu-none"
        />
      </div>
    </div>
  );
};

export default TimeRangePicker; 
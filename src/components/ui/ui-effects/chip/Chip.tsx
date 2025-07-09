/* 
  파일명: src/components/ui/ui-effects/chip/Chip.tsx
  기능: 선택 가능한 옵션을 칩 형태로 표시하는 UI 컴포넌트
  책임: 토글 상태, 접근성, 뉴모피즘 스타일을 적용한 선택형 칩을 제공한다.
  
  사용처:
  - 카테고리/태그 선택 (주차 정책, 콘텐츠 분류)
  - 필터 옵션 (검색 조건, 상태 필터)
  - 다중 선택 UI (권한 설정, 기능 활성화)
  - 토글 버튼 그룹 (설정 옵션, 모드 전환)
*/ // ---

import React from 'react';
import { Check } from 'lucide-react';

// #region 타입
interface ChipProps {
  /** 칩에 표시될 텍스트 */
  label: string;
  /** 선택 상태 */
  active: boolean;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 크기 변형 */
  size?: 'sm' | 'md' | 'lg';
  /** 스타일 변형 */
  variant?: 'default' | 'outline';
  /** 토글 이벤트 핸들러 */
  onToggle: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}
// #endregion

// #region 상수
const SIZE_STYLES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
} as const;

const VARIANT_STYLES = {
  default: {
    active: 'neu-inset bg-primary/10 text-primary border-primary/30 shadow-inner',
    inactive: 'neu-raised bg-background text-foreground shadow-md hover:shadow-lg',
    disabledActive: 'neu-inset bg-muted/40 text-primary font-semibold drop-shadow-sm',
    disabledInactive: 'neu-elevated bg-muted/40 text-foreground font-semibold drop-shadow-sm',
  },
  outline: {
    active: 'neu-inset bg-primary/5 text-primary border-2 border-primary/50',
    inactive: 'neu-flat bg-background text-foreground border border-border hover:bg-muted/50',
    disabledActive: 'neu-inset bg-muted/40 text-primary font-semibold drop-shadow-sm border border-muted/70',
    disabledInactive: 'neu-elevated bg-muted/40 text-foreground font-semibold drop-shadow-sm border border-muted/70',
  },
} as const;
// #endregion

export function Chip({ 
  label, 
  active, 
  disabled = false, 
  size = 'md', 
  variant = 'default',
  onToggle, 
  className = '' 
}: ChipProps) {
  
  // #region 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle();
    }
  };

  const handleClick = () => {
    if (disabled) return;
    onToggle();
  };
  // #endregion

  // #region 스타일 계산
  const sizeClass = SIZE_STYLES[size];
  const variantClass = disabled
    ? active 
      ? VARIANT_STYLES[variant].disabledActive
      : VARIANT_STYLES[variant].disabledInactive
    : active 
      ? VARIANT_STYLES[variant].active 
      : VARIANT_STYLES[variant].inactive;
  
  const baseClass = 'relative inline-flex items-center justify-center rounded-md font-multilang select-none transition-all duration-150';
  const interactionClass = disabled 
    ? 'opacity-60 cursor-not-allowed' 
    : 'cursor-pointer';
  // #endregion

  // #region 렌더링
  return (
    <div
      className={`${baseClass} ${sizeClass} ${variantClass} ${interactionClass} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={active}
      aria-disabled={disabled}
    >
      <span className="pointer-events-none">{label}</span>
      {active && (
        <Check
          size={12}
          className="absolute right-1 pointer-events-none text-primary"
        />
      )}
    </div>
  );
  // #endregion
}

// #region 편의 컴포넌트
interface ChipGroupProps {
  /** 선택 가능한 옵션들 */
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  /** 선택된 값들 (다중 선택) */
  selected: string[];
  /** 선택 변경 핸들러 */
  onSelectionChange: (selected: string[]) => void;
  /** 그룹 레이아웃 */
  layout?: 'grid' | 'flex';
  /** 개별 칩 속성 */
  chipProps?: Partial<Pick<ChipProps, 'size' | 'variant'>>;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function ChipGroup({
  options,
  selected,
  onSelectionChange,
  layout = 'grid',
  chipProps = {},
  className = ''
}: ChipGroupProps) {
  // #region 핸들러
  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value];
    onSelectionChange(newSelected);
  };
  // #endregion

  // #region 스타일 계산
  const layoutClass = layout === 'grid' 
    ? 'grid grid-cols-2 gap-2' 
    : 'flex flex-wrap gap-2';
  // #endregion

  // #region 렌더링
  return (
    <div className={`${layoutClass} ${className}`}>
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          active={selected.includes(option.value)}
          disabled={option.disabled}
          onToggle={() => handleToggle(option.value)}
          {...chipProps}
        />
      ))}
    </div>
  );
  // #endregion
}
// #endregion 
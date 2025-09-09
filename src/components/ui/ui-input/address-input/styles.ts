/* 
  파일명: /address-input/styles.ts
  기능: 주소 입력 컴포넌트들의 공통 스타일 상수
  책임: 일관된 UI 스타일과 크기를 전역에서 관리
*/ // ------------------------------

// #region 높이 상수
export const FIELD_HEIGHT = 'h-14'; // 56px - 모든 입력 필드 높이
export const LABEL_HEIGHT = 'h-14'; // 56px - 모든 라벨 박스 높이
// #endregion

// #region 라벨 박스 스타일 상수
export const LABEL_BOX_STYLES = 'flex items-center justify-center h-14 bg-muted/30 rounded-lg border border-border/50';
// #endregion

// #region 입력 필드 공통 스타일
export const INPUT_BASE_STYLES = 'w-full h-14 text-base rounded-lg border transition-colors';

// 입력 필드 패딩 (아이콘과 버튼 공간 고려)
export const INPUT_PADDING = {
  withIcon: 'pl-9 pr-3', // 왼쪽 아이콘만
  withIconAndButton: 'pl-9 pr-24', // 왼쪽 아이콘 + 오른쪽 버튼
  withIconAndClear: 'pl-9 pr-9', // 왼쪽 아이콘 + 오른쪽 Clear 버튼
  standard: 'px-3' // 표준 패딩
};

// 입력 필드 상태별 스타일
export const INPUT_STATE_STYLES = {
  disabled: 'bg-muted text-muted-foreground cursor-not-allowed border-border/50',
  normal: (colorClasses: { ring: string; border: string }) => 
    `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border}`,
  readOnly: (colorClasses: { ring: string; border: string }) => 
    `bg-background border-border focus:ring-2 ${colorClasses.ring} ${colorClasses.border} hover:bg-muted/30 cursor-pointer`
};
// #endregion

// #region 아이콘 위치 상수
export const ICON_POSITIONS = {
  left: 'absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2',
  right: 'absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2'
};
// #endregion

// #region 버튼 스타일 상수
export const BUTTON_STYLES = {
  search: () => 
    `absolute right-1 top-1/2 transform -translate-y-1/2 p-2 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50`,
  clear: 'transition-colors text-muted-foreground hover:text-foreground',
  disabled: 'bg-muted text-muted-foreground cursor-not-allowed'
};
// #endregion

// #region ColorVariant 유틸리티 함수
export const getColorClasses = (colorVariant: 'primary' | 'secondary' = 'primary') => {
  const baseColor = colorVariant === 'primary' ? 'primary' : 'secondary';
  return {
    ring: `focus:ring-${baseColor}/20`,
    border: `focus:border-${baseColor}`,
    icon: `text-${baseColor}`,
    bg: `bg-${baseColor}/10`,
    text: `text-${baseColor}`,
  };
};
// #endregion

// #region 미리보기 박스 스타일
export const PREVIEW_BOX_STYLES = 'p-3 rounded-lg border bg-muted/30 border-border/50';
export const PREVIEW_EMPTY_STYLES = 'flex justify-center items-center h-14 text-sm text-muted-foreground';
// #endregion

// #region 컨테이너 스타일
export const CONTAINER_STYLES = {
  main: 'space-y-3',
  fieldGroup: 'space-y-3',
  gridRow: 'grid grid-cols-3 gap-3 items-center',
  fieldContainer: 'relative col-span-2 h-14'
};
// #endregion

// #region 통합 스타일 생성 함수들
/**
 * 입력 필드의 완전한 스타일을 생성
 */
export const createInputStyles = (
  disabled: boolean,
  readOnly: boolean,
  colorVariant: 'primary' | 'secondary' = 'primary',
  padding: keyof typeof INPUT_PADDING = 'standard'
) => {
  const colorClasses = getColorClasses(colorVariant);
  const paddingClass = INPUT_PADDING[padding];
  
  let stateStyles: string;
  if (disabled) {
    stateStyles = INPUT_STATE_STYLES.disabled;
  } else if (readOnly) {
    stateStyles = INPUT_STATE_STYLES.readOnly(colorClasses);
  } else {
    stateStyles = INPUT_STATE_STYLES.normal(colorClasses);
  }
  
  return `${INPUT_BASE_STYLES} ${paddingClass} ${stateStyles}`;
};

/**
 * 검색 버튼 스타일을 생성
 */
export const createSearchButtonStyles = (
  disabled: boolean
) => {
  if (disabled) {
    return `absolute right-1 top-1/2 transform -translate-y-1/2 p-2 rounded-md transition-colors ${BUTTON_STYLES.disabled}`;
  }
  
  return BUTTON_STYLES.search();
};
// #endregion

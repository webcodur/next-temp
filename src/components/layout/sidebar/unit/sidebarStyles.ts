/**
 * 사이드바 관련 공통 스타일 정의
 * - 토글 버튼들의 일관된 스타일링을 위한 공통 클래스
 * - border, background, hover 효과 통일
 */

// 공통 토글 버튼 기본 스타일
export const toggleButtonBase = "flex justify-center items-center bg-background transition-all duration-300 cursor-pointer group";

// 공통 border 스타일 
export const toggleButtonBorder = "border border-border";

// 공통 hover 효과
export const toggleButtonHover = "hover:bg-muted";

// 공통 아이콘 스타일
export const toggleButtonIcon = "w-4 h-4 transition-all duration-200 text-muted-foreground group-hover:text-brand group-hover:scale-110";

// 메인 토글 버튼 (좌측 상단 고정)
export const mainToggleButton = `${toggleButtonBase} ${toggleButtonBorder} ${toggleButtonHover} rounded-br-lg`;

// 헤드 토글 영역 스타일
export const headToggleContainer = "h-[30px] flex transition-all duration-300";

// 헤드 토글 좌측 구분선 영역 (border 제거)
export const headToggleLeftDivider = "w-[50px] bg-background";

// 헤드 토글 버튼 영역 (border 제거)
export const headToggleButton = `${toggleButtonBase} flex-1`;

// 공통 스타일 조합 함수들
export const getMainToggleStyles = () => mainToggleButton;

export const getHeadToggleContainerStyles = (isVisible: boolean) => 
  `${headToggleContainer} ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`;

export const getHeadToggleButtonStyles = () => 
  `${headToggleButton} ${toggleButtonHover}`; 
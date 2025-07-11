export const FIELD_STYLES = {
	// 기본 컨테이너 (모든 필드 공통) - 뉴모피즘 + 테마 완전 대응
	container: 'neu-flat focus:neu-inset border-border',
	height: 'h-10',
	padding: 'px-3 py-2',
	text: 'font-multilang text-sm font-medium placeholder:text-muted-foreground text-foreground',
	sortIcon:
		'absolute start-3 top-1/2 w-4 h-4 transform -translate-y-1/2 cursor-pointer neu-icon-inactive',
	startIcon:
		'absolute start-3 top-1/2 w-4 h-4 transform -translate-y-1/2 z-20',
	endIcon:
		'absolute end-3 top-1/2 w-4 h-4 transform -translate-y-1/2 z-20',

	// 드롭다운
	dropdown:
		'neu-flat bg-popover text-popover-foreground border border-border shadow-lg backdrop-blur-md',
	// 드롭다운 스크롤 영역
	dropdownScroll: 'overflow-y-auto field-dropdown-scroll',
	// 드롭다운 옵션
	dropdownOption:
		'font-multilang cursor-pointer px-3 py-2 text-sm font-medium text-foreground hover:bg-muted',
	dropdownOptionSelected: 'neu-inset bg-primary text-primary-foreground font-bold',
	dropdownOptionHighlighted: 'neu-raised bg-muted text-muted-foreground',
	dropdownOptionDisabled: 'cursor-not-allowed text-muted-foreground opacity-60',

	// 버튼들
	button: 'neu-raised',
	clearButton:
		'neu-raised flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground',

	// 레이블
	label: 'font-multilang block mb-1 text-sm font-medium text-foreground',

	// 비활성화 상태
	disabled: 'opacity-60 cursor-not-allowed',
} as const;

// RTL 지원 함수
export const getIconPosition = (isRTL: boolean) => ({
	startIcon: isRTL
		? 'absolute end-3 top-1/2 w-4 h-4 transform -translate-y-1/2'
		: 'absolute start-3 top-1/2 w-4 h-4 transform -translate-y-1/2',
	endIcon: isRTL
		? 'absolute start-3 top-1/2 w-4 h-4 transform -translate-y-1/2'
		: 'absolute end-3 top-1/2 w-4 h-4 transform -translate-y-1/2',
});

export const FIELD_CONSTANTS = {
	DEFAULT_MAX_HEIGHT: 200,
	DEFAULT_PLACEHOLDER: '항목 선택',
	DEFAULT_SORT_DIRECTION: 'asc' as const,
} as const;

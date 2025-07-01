export const FIELD_STYLES = {
	// 기본 컨테이너 (모든 필드 공통) - 뉴모피즘 + 테마 완전 대응
	container: 'neu-flat focus:neu-inset focus:outline-hidden transition-all bg-card text-card-foreground border-border',

	// 높이 통일 (모든 필드 동일)
	height: 'h-10',

	// 패딩 통일
	padding: 'px-3 py-2',

	// 텍스트 스타일 - 테마 완전 대응
	text: 'font-multilang text-sm font-medium placeholder:text-muted-foreground text-foreground',

	// 아이콘 위치 - 테마 완전 대응
	leftIcon:
		'neu-icon-inactive absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 transition-all',
	rightIcon:
		'neu-icon-inactive absolute right-3 top-1/2 w-4 h-4 transform -translate-y-1/2 transition-all',

	// 정렬 아이콘 (인터렉션 강조) - 테마 완전 대응
	sortIcon:
		'neu-icon-inactive absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 transition-all cursor-pointer hover:neu-icon-active hover:scale-110 active:scale-95',

	// 드롭다운 - 뉴모피즘 + 테마 완전 대응
	dropdown:
		'neu-raised bg-popover text-popover-foreground border border-border shadow-lg backdrop-blur-md',

	// 드롭다운 스크롤 영역
	dropdownScroll: 'overflow-y-auto field-dropdown-scroll',

	// 드롭다운 옵션 - 테마 완전 대응
	dropdownOption:
		'font-multilang cursor-pointer px-3 py-2 text-sm font-medium transition-all neu-hover text-foreground hover:bg-muted',
	dropdownOptionSelected: 'neu-inset bg-primary text-primary-foreground font-bold',
	dropdownOptionHighlighted: 'neu-raised bg-muted text-muted-foreground',
	dropdownOptionDisabled: 'cursor-not-allowed text-muted-foreground opacity-60',

	// 버튼들 - 뉴모피즘 완전 대응
	button: 'neu-raised',
	clearButton:
		'neu-raised flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground',

	// 레이블 - 테마 완전 대응
	label: 'font-multilang block mb-1 text-sm font-medium text-foreground',

	// 비활성화 상태
	disabled: 'opacity-60 cursor-not-allowed',
} as const;

export const FIELD_CONSTANTS = {
	DEFAULT_MAX_HEIGHT: 200,
	DEFAULT_PLACEHOLDER: '항목 선택',
	DEFAULT_SORT_DIRECTION: 'asc' as const,
} as const;

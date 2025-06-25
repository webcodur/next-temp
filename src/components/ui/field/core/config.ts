export const FIELD_STYLES = {
	// 기본 컨테이너 (모든 필드 공통)
	container: 'neu-flat focus:neu-inset focus:outline-hidden transition-all',

	// 높이 통일 (모든 필드 동일)
	height: 'h-10',

	// 패딩 통일
	padding: 'px-3 py-2',

	// 텍스트 스타일
	text: 'text-sm font-medium placeholder-gray-600 text-gray-800',

	// 아이콘 위치
	leftIcon:
		'absolute left-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2',
	rightIcon:
		'absolute right-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2',

	// 정렬 아이콘 (인터렉션 강조)
	sortIcon:
		'absolute left-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2 transition-all cursor-pointer hover:text-blue-600 hover:scale-110 hover:drop-shadow-lg active:scale-95 active:text-blue-700',

	// 드롭다운 (보더 더욱 강화)
	dropdown:
		'bg-white backdrop-blur-md border-2 border-gray-400 shadow-xl ring-1 ring-gray-200',

	// 드롭다운 스크롤 영역
	dropdownScroll: 'overflow-y-auto field-dropdown-scroll',

	// 드롭다운 옵션
	dropdownOption:
		'cursor-pointer px-3 py-2 text-sm font-medium transition-all neu-hover',
	dropdownOptionSelected: 'bg-blue-50 text-blue-700 font-bold neu-inset',
	dropdownOptionHighlighted: 'bg-gray-50 neu-raised',
	dropdownOptionDisabled: 'cursor-not-allowed text-gray-400 opacity-60',

	// 버튼들
	button: 'neu-raised',
	clearButton:
		'flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 border border-gray-300 text-gray-600 transition-all hover:bg-gray-200 hover:border-gray-400 hover:text-gray-800',

	// 레이블
	label: 'block mb-1 text-sm font-medium text-gray-800',

	// 비활성화 상태
	disabled: 'opacity-60 cursor-not-allowed',
} as const;

export const FIELD_CONSTANTS = {
	DEFAULT_MAX_HEIGHT: 200,
	DEFAULT_PLACEHOLDER: '항목 선택',
	DEFAULT_SORT_DIRECTION: 'asc' as const,
} as const;

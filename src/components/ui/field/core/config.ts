export const FIELD_STYLES = {
	container: 'neu-flat focus:outline-hidden transition-all duration-200',
	dropdown: 'bg-white/98 backdrop-blur-md',
	button: 'neu-raised',
	input: 'neu-inset focus:outline-hidden',
} as const;

export const FIELD_CONSTANTS = {
	DEFAULT_MAX_HEIGHT: 200,
	DEFAULT_PLACEHOLDER: '항목 선택',
	DEFAULT_SORT_DIRECTION: 'asc' as const,
} as const;

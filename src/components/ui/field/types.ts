export interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

// 모드 전환을 위한 타입 추가
export type SelectMode = 'dropdown' | 'combobox';

// 정렬 방향을 위한 타입 추가
export type SortDirection = 'asc' | 'desc';

export interface BaseFieldProps {
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

// 모드 전환 가능한 셀렉트 필드용 베이스 타입
export interface BaseSelectProps extends BaseFieldProps {
	options: Option[];
	maxHeight?: number;
	mode?: SelectMode; // 기본값: 'dropdown'
	onModeChange?: (mode: SelectMode) => void;
}

// Field 컴포넌트용 (type 필수)
export interface FieldTextProps extends BaseFieldProps {
	type: 'text';
	value: string;
	onChange: (value: string) => void;
	onEnterPress?: () => void;
	onClear?: () => void;
	inputType?: string;
	size?: 'sm' | 'md' | 'lg';
	showSearchIcon?: boolean;
	showClearButton?: boolean;
}

export interface FieldMultiSelectProps extends BaseSelectProps {
	type: 'multi-select';
	value?: string[];
	onChange?: (value: string[]) => void;
}

export interface FieldFilterSelectProps extends BaseSelectProps {
	type: 'filter-select';
	value?: string;
	onChange?: (value: string) => void;
}

export interface FieldSortSelectProps extends BaseFieldProps {
	type: 'sort-select';
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
	sortDirection?: SortDirection;
	onSortDirectionChange?: (direction: SortDirection) => void;
}

// 개별 컴포넌트용 (type 제외)
export interface FieldTextComponentProps extends BaseFieldProps {
	value: string;
	onChange: (value: string) => void;
	onEnterPress?: () => void;
	onClear?: () => void;
	inputType?: string;
	size?: 'sm' | 'md' | 'lg';
	showSearchIcon?: boolean;
	showClearButton?: boolean;
}

export interface FieldMultiSelectComponentProps extends BaseSelectProps {
	value?: string[];
	onChange?: (value: string[]) => void;
}

export interface FieldFilterSelectComponentProps extends BaseSelectProps {
	value?: string;
	onChange?: (value: string) => void;
}

export interface FieldSortSelectComponentProps extends BaseFieldProps {
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
	sortDirection?: SortDirection;
	onSortDirectionChange?: (direction: SortDirection) => void;
}

export type FieldProps =
	| FieldTextProps
	| FieldMultiSelectProps
	| FieldFilterSelectProps
	| FieldSortSelectProps; 
export interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

// 정렬 방향을 위한 타입
export type SortDirection = 'asc' | 'desc';

export interface BaseFieldProps {
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

// 기본 셀렉트 필드용 베이스 타입
export interface BaseSelectProps extends BaseFieldProps {
	options: Option[];
	maxHeight?: number;
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

export interface FieldSelectProps extends BaseSelectProps {
	type: 'select';
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

export interface FieldSelectComponentProps extends BaseSelectProps {
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
	| FieldSelectProps
	| FieldSortSelectProps;

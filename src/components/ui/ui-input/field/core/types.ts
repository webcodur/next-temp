export interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

export type ENUM_SortDirection = 'asc' | 'desc';

// #region Datepicker Types
export type ENUM_DatePickerType = 'single' | 'range' | 'datetime' | 'dateTime' | 'time' | 'month';

export interface FieldDatePickerComponentProps extends FieldBaseProps {
	placeholder?: string;
	datePickerType: ENUM_DatePickerType;
	// 단일 날짜용
	value?: Date | null;
	onChange?: (value: Date | null) => void;
	// 날짜 범위용
	startDate?: Date | null;
	endDate?: Date | null;
	onStartDateChange?: (date: Date | null) => void;
	onEndDateChange?: (date: Date | null) => void;
	// 공통 옵션
	minDate?: Date | null;
	maxDate?: Date | null;
	dateFormat?: string;
	timeFormat?: string;
	timeIntervals?: number;
}
// #endregion

export interface FieldBaseProps {
	label?: string;
	disabled?: boolean;
	className?: string;
}

// Text Field Types
export interface FieldTextComponentProps extends FieldBaseProps {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onEnterPress?: () => void;
	onClear?: () => void;
	showSearchIcon?: boolean;
	showClearButton?: boolean;
}

export interface FieldPasswordComponentProps extends FieldBaseProps {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onEnterPress?: () => void;
	onClear?: () => void;
	showClearButton?: boolean;
	showStrengthIndicator?: boolean;
	minLength?: number;
}

export interface FieldEmailComponentProps extends FieldBaseProps {
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onEnterPress?: () => void;
	onClear?: () => void;
	showClearButton?: boolean;
	showValidation?: boolean;
	allowedDomains?: string[];
}

// Select Field Types
export interface FieldSelectComponentProps extends FieldBaseProps {
	placeholder?: string;
	categoryName?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
	leftIcon?: React.ReactNode;
	showAllOption?: boolean;
	allOptionLabel?: string;
	allOptionValue?: string;
	showClearButton?: boolean;
}

export interface FieldSortSelectComponentProps extends FieldBaseProps {
	placeholder?: string;
	categoryName?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
	sortDirection?: ENUM_SortDirection;
	onSortDirectionChange?: (direction: ENUM_SortDirection) => void;
	showAllOption?: boolean;
	allOptionLabel?: string;
	allOptionValue?: string;
	showClearButton?: boolean;
}

// Factory Component Types
export interface FieldTextProps extends FieldBaseProps {
	type: 'text';
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onEnterPress?: () => void;
	onClear?: () => void;
	inputType?: 'text' | 'email' | 'tel' | 'url';
	size?: 'sm' | 'md' | 'lg';
	showClearButton?: boolean;
}

export interface FieldSelectProps extends FieldBaseProps {
	type: 'select';
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
	categoryName?: string;
	showAllOption?: boolean;
	allOptionLabel?: string;
	allOptionValue?: string;
	showClearButton?: boolean;
}

export interface FieldSortSelectProps extends FieldBaseProps {
	type: 'sort-select';
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
	sortDirection?: ENUM_SortDirection;
	onSortDirectionChange?: (direction: ENUM_SortDirection) => void;
	categoryName?: string;
	showAllOption?: boolean;
	allOptionLabel?: string;
	allOptionValue?: string;
	showClearButton?: boolean;
}

export interface FieldPasswordProps extends FieldBaseProps {
	type: 'password';
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onEnterPress?: () => void;
	onClear?: () => void;
	size?: 'sm' | 'md' | 'lg';
	showClearButton?: boolean;
	showStrengthIndicator?: boolean;
	minLength?: number;
}

export interface FieldEmailProps extends FieldBaseProps {
	type: 'email';
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onEnterPress?: () => void;
	onClear?: () => void;
	size?: 'sm' | 'md' | 'lg';
	showClearButton?: boolean;
	showValidation?: boolean;
	allowedDomains?: string[];
}

export interface FieldDatePickerProps extends FieldBaseProps {
	type: 'datepicker';
	placeholder?: string;
	datePickerType: ENUM_DatePickerType;
	// 단일 날짜용
	value?: Date | null;
	onChange?: (value: Date | null) => void;
	// 날짜 범위용
	startDate?: Date | null;
	endDate?: Date | null;
	onStartDateChange?: (date: Date | null) => void;
	onEndDateChange?: (date: Date | null) => void;
	// 공통 옵션
	minDate?: Date | null;
	maxDate?: Date | null;
	dateFormat?: string;
	timeFormat?: string;
	timeIntervals?: number;
}

export type FieldProps =
	| FieldTextProps
	| FieldSelectProps
	| FieldSortSelectProps
	| FieldPasswordProps
	| FieldEmailProps
	| FieldDatePickerProps;

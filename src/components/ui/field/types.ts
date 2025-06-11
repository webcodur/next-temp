export interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface BaseFieldProps {
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
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

export interface FieldMultiSelectProps extends BaseFieldProps {
	type: 'multi-select';
	value?: string[];
	onChange?: (value: string[]) => void;
	options: Option[];
	maxHeight?: number;
}

export interface FieldFilterSelectProps extends BaseFieldProps {
	type: 'filter-select';
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
}

export interface FieldSortSelectProps extends BaseFieldProps {
	type: 'sort-select';
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
}

export interface FieldRadioGroupProps extends BaseFieldProps {
	type: 'radio-group';
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	layout?: 'horizontal' | 'vertical';
}

export interface FieldCheckboxProps extends BaseFieldProps {
	type: 'checkbox';
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	indeterminate?: boolean;
}

export interface FieldToggleSwitchProps extends BaseFieldProps {
	type: 'toggle-switch';
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface FieldToggleButtonProps extends BaseFieldProps {
	type: 'toggle-button';
	pressed?: boolean;
	onChange?: (pressed: boolean) => void;
	variant?: 'default' | 'outline' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
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

export interface FieldMultiSelectComponentProps extends BaseFieldProps {
	value?: string[];
	onChange?: (value: string[]) => void;
	options: Option[];
	maxHeight?: number;
}

export interface FieldFilterSelectComponentProps extends BaseFieldProps {
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
}

export interface FieldSortSelectComponentProps extends BaseFieldProps {
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	maxHeight?: number;
}

export interface FieldRadioGroupComponentProps extends BaseFieldProps {
	value?: string;
	onChange?: (value: string) => void;
	options: Option[];
	layout?: 'horizontal' | 'vertical';
}

export interface FieldCheckboxComponentProps extends BaseFieldProps {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	indeterminate?: boolean;
}

export interface FieldToggleSwitchComponentProps extends BaseFieldProps {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface FieldToggleButtonComponentProps extends BaseFieldProps {
	pressed?: boolean;
	onChange?: (pressed: boolean) => void;
	variant?: 'default' | 'outline' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
}

export type FieldProps =
	| FieldTextProps
	| FieldMultiSelectProps
	| FieldFilterSelectProps
	| FieldSortSelectProps
	| FieldRadioGroupProps
	| FieldCheckboxProps
	| FieldToggleSwitchProps
	| FieldToggleButtonProps; 
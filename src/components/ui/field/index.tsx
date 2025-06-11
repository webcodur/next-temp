'use client';

import React from 'react';
import { FieldProps } from './types';
import { FieldText } from './FieldText';
import { FieldMultiSelect, FieldFilterSelect, FieldSortSelect } from './FieldSelect';
import { FieldRadioGroup } from './FieldRadioGroup';
import { FieldCheckbox } from './FieldCheckbox';
import { FieldToggleSwitch } from './FieldToggleSwitch';
import { FieldToggleButton } from './FieldToggleButton';

export const Field: React.FC<FieldProps> = (props) => {
	switch (props.type) {
		case 'text':
			return <FieldText {...props} />;
		case 'multi-select':
			return <FieldMultiSelect {...props} />;
		case 'filter-select':
			return <FieldFilterSelect {...props} />;
		case 'sort-select':
			return <FieldSortSelect {...props} />;
		case 'radio-group':
			return <FieldRadioGroup {...props} />;
		case 'checkbox':
			return <FieldCheckbox {...props} />;
		case 'toggle-switch':
			return <FieldToggleSwitch {...props} />;
		case 'toggle-button':
			return <FieldToggleButton {...props} />;
		default:
			return null;
	}
};

// Re-export all types
export type { 
	Option, 
	FieldProps,
	FieldTextComponentProps,
	FieldMultiSelectComponentProps,
	FieldFilterSelectComponentProps,
	FieldSortSelectComponentProps,
	FieldRadioGroupComponentProps,
	FieldCheckboxComponentProps,
	FieldToggleSwitchComponentProps,
	FieldToggleButtonComponentProps
} from './types';

// Re-export individual components
export { FieldText } from './FieldText';
export { FieldMultiSelect, FieldFilterSelect, FieldSortSelect } from './FieldSelect';
export { FieldRadioGroup } from './FieldRadioGroup';
export { FieldCheckbox } from './FieldCheckbox';
export { FieldToggleSwitch } from './FieldToggleSwitch';
export { FieldToggleButton } from './FieldToggleButton'; 
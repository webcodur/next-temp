'use client';

import React from 'react';
import { FieldProps } from './types';
import { FieldText } from './FieldText';
import { FieldMultiSelect, FieldFilterSelect, FieldSortSelect } from './FieldSelect';

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
		default:
			return null;
	}
};

// Re-export all types
export type { 
	Option, 
	SelectMode,
	SortDirection,
	FieldProps,
	FieldTextComponentProps,
	FieldMultiSelectComponentProps,
	FieldFilterSelectComponentProps,
	FieldSortSelectComponentProps
} from './types';

// Re-export individual components
export { FieldText } from './FieldText';
export { FieldMultiSelect, FieldFilterSelect, FieldSortSelect } from './FieldSelect'; 
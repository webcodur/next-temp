'use client';

import React from 'react';
import { FieldProps } from './types';
import { FieldText } from './FieldText';
import { FieldSelect, FieldSortSelect } from './FieldSelect';

export const Field: React.FC<FieldProps> = (props) => {
	switch (props.type) {
		case 'text':
			return <FieldText {...props} />;
		case 'select':
			return <FieldSelect {...props} />;
		case 'sort-select':
			return <FieldSortSelect {...props} />;
		default:
			return null;
	}
};

// Re-export all types
export type {
	Option,
	SortDirection,
	FieldProps,
	FieldTextComponentProps,
	FieldSelectComponentProps,
	FieldSortSelectComponentProps,
} from './types';

// Re-export individual components
export { FieldText } from './FieldText';
export { FieldSelect, FieldSortSelect } from './FieldSelect';

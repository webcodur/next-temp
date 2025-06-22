'use client';

import React from 'react';
import { FieldProps } from './types';
import { FieldText } from '../text/FieldText';
import { FieldSelect } from '../select/FieldSelect';
import { FieldSortSelect } from '../select/FieldSortSelect';
import { FieldDatePicker } from '../datepicker/FieldDatePicker';

export const Field: React.FC<FieldProps> = (props) => {
	switch (props.type) {
		case 'text':
			return <FieldText {...props} />;
		case 'select':
			return <FieldSelect {...props} />;
		case 'sort-select':
			return <FieldSortSelect {...props} />;
		case 'datepicker':
			return <FieldDatePicker {...props} />;
		default:
			return null;
	}
};

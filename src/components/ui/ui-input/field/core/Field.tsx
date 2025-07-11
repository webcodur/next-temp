'use client';

import React, { useId } from 'react';
import { FieldProps } from './types';
import FieldText from '../text/FieldText';
import FieldPassword from '../text/FieldPassword';
import FieldEmail from '../text/FieldEmail';
import FieldSelect from '../select/FieldSelect';
import { FieldSortSelect } from '../select/FieldSortSelect';
import FieldDatePicker from '../datepicker/FieldDatePicker';

export const Field: React.FC<FieldProps> = (props) => {
	const generatedId = useId();
	const id = `field-${generatedId}`;

	switch (props.type) {
		case 'text':
			return <FieldText {...props} id={id} />;
		case 'password':
			return <FieldPassword {...props} id={id} />;
		case 'email':
			return <FieldEmail {...props} id={id} />;
		case 'select':
			return <FieldSelect {...props} id={id} />;
		case 'sort-select':
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return <FieldSortSelect {...(props as any)} id={id} />;
		case 'datepicker':
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return <FieldDatePicker {...(props as any)} id={id} />;
		default:
			return null;
	}
};

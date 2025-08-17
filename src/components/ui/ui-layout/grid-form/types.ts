import React from 'react';

// #region GridForm 타입 정의
export type GridFormViewMode = 'default' | 'detail';

export interface GridFormProps {
	viewMode?: GridFormViewMode;
	sequenceWidth?: string;
	rulesWidth?: string;
	gap?: string;
	colorVariant?: 'primary' | 'secondary';
	className?: string;
	children: React.ReactNode;
	topRightActions?: React.ReactNode;
	bottomLeftActions?: React.ReactNode;
	bottomRightActions?: React.ReactNode;
}

export interface GridFormRowProps {
	align?: 'start' | 'center' | 'end';
	className?: string;
	children: React.ReactNode;
}

export interface GridFormSequenceProps {
	sequence: number;
	total?: number;
	className?: string;
}

export interface GridFormLabelProps {
	required?: boolean;
	htmlFor?: string;
	className?: string;
	children: React.ReactNode;
}

export interface GridFormContentProps {
	direction?: 'column' | 'row';
	gap?: string;
	className?: string;
	children: React.ReactNode;
}

export interface GridFormRulesProps {
	className?: string;
	children: React.ReactNode;
}
// #endregion

// #region GridFormAuto 타입 정의
export interface GridFormFieldSchema {
	id: string;
	label: string;
	required?: boolean;
	rules?: string;
	component: React.ReactNode;
	align?: 'start' | 'center' | 'end';
	htmlFor?: string;
}

export interface GridFormAutoProps {
	fields: GridFormFieldSchema[];
	// GridForm 관련 props
	viewMode?: GridFormViewMode;
	sequenceWidth?: string;
	rulesWidth?: string;
	gap?: string;
	colorVariant?: 'primary' | 'secondary';
	className?: string;
	topRightActions?: React.ReactNode;
	bottomLeftActions?: React.ReactNode;
	bottomRightActions?: React.ReactNode;
	// ViewSelector 표시 여부 (독립 사용시에만)
	showViewSelector?: boolean;
}
// #endregion

import { createContext } from 'react';
import type { GridFormViewMode } from './types';

// #region Context 정의
export interface GridFormContextValue {
	viewMode: GridFormViewMode;
	sequenceWidth: string;
	labelWidth: string;
	columnLabelWidths: string[];
	rulesWidth: string;
	responsiveRulesWidth: string;
	gap: string;
	colorVariant: 'primary' | 'secondary';
	totalCount: number;
	getNextSequence: () => number;
	getCurrentColumnIndex: () => number;
}

export const GridFormContext = createContext<GridFormContextValue | null>(null);
// #endregion

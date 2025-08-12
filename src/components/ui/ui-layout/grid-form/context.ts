import { createContext } from 'react';

// #region Context 정의
export interface GridFormContextValue {
	sequenceWidth: string;
	labelWidth: string;
	rulesWidth: string;
	gap: string;
	colorVariant: 'primary' | 'secondary';
	totalCount: number;
	getNextSequence: () => number;
}

export const GridFormContext = createContext<GridFormContextValue | null>(null);
// #endregion

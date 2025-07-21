import { useState, useMemo, useCallback } from 'react';

// #region 타입
export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
	key: string;
	direction: SortDirection;
}

interface UseSortableDataProps<T> {
	data: T[] | null;
}

interface UseSortableDataReturn<T> {
	sortState: SortState;
	sortedData: T[];
	handleSort: (columnKey: string, sortable: boolean, actualKey?: string) => void;
	resetSort: () => void;
}
// #endregion

export const useSortableData = <T extends Record<string, unknown>>({
	data,
}: UseSortableDataProps<T>): UseSortableDataReturn<T> => {
	// #region 상태
	const [sortState, setSortState] = useState<SortState>({ key: '', direction: null });
	// #endregion

	// #region 정렬된 데이터
	const sortedData = useMemo(() => {
		const rawData = data ?? [];
		
		if (!rawData.length || !sortState.direction || !sortState.key) {
			return rawData;
		}

		// 정렬 키가 실제 데이터에 존재하는지 확인
		const hasKey = rawData.some(item => sortState.key in item);
		if (!hasKey) {
			console.warn(`정렬 키 '${sortState.key}'가 데이터에 존재하지 않습니다.`);
			return rawData;
		}

		return [...rawData].sort((a, b) => {
			const aValue = a[sortState.key];
			const bValue = b[sortState.key];

			if (aValue === bValue) return 0;
			
			// null, undefined 처리
			if (aValue == null) return 1;
			if (bValue == null) return -1;

			// 숫자 비교
			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
			}

			// 문자열 비교
			const aStr = String(aValue).toLowerCase();
			const bStr = String(bValue).toLowerCase();
			
			if (sortState.direction === 'asc') {
				return aStr.localeCompare(bStr);
			} else {
				return bStr.localeCompare(aStr);
			}
		});
	}, [data, sortState]);
	// #endregion

	// #region 핸들러
	const handleSort = useCallback((columnKey: string, sortable: boolean = true, actualKey?: string) => {
		if (!sortable || !actualKey) return;
		
		setSortState(prev => {
			if (prev.key !== actualKey) {
				return { key: actualKey, direction: 'asc' };
			}
			
			const newDirection: SortDirection = 
				prev.direction === 'asc' ? 'desc' : 
				prev.direction === 'desc' ? null : 'asc';
				
			return { key: actualKey, direction: newDirection };
		});
	}, []);

	const resetSort = useCallback(() => {
		setSortState({ key: '', direction: null });
	}, []);
	// #endregion

	return {
		sortState,
		sortedData,
		handleSort,
		resetSort,
	};
}; 
// 시설별 좌석 예약 시스템 상수 정의

export interface ColorScheme {
	seat: string;
	space: string;
	object: string;
	selected: string;
	cursor: string;
	available: string;
	occupied: string;
	reserved: string;
	disabled: string;
}

// 빈 셀 없이 전부 빈공간으로 시작하도록 색상 시스템 단순화
export const FACILITY_COLORS: ColorScheme = {
	seat: '#3B82F6',
	space: '#F9FAFB',
	object: '#6B7280',
	selected: '#F59E0B',
	cursor: '#EF4444',
	available: '#10B981',
	occupied: '#EF4444',
	reserved: '#F59E0B',
	disabled: '#6B7280',
};

export const CELL_SIZE = 40;
export const MAX_GRID_SIZE = 30;
export const MIN_GRID_SIZE = 5;

// 시설별 좌석 예약 시스템 이름 관련 타입

export interface SeatNamingOption {
	id: string;
	name: string;
	pattern: string;
	description: string;
	generate: (
		index: number,
		row: number,
		col: number,
		customPattern?: string
	) => string;
}

export interface BatchNamingConfig {
	option: SeatNamingOption;
	customPattern?: string;
	startRow: number;
	startCol: number;
	applyToSelected: boolean;
}

export const SEAT_NAMING_OPTIONS: SeatNamingOption[] = [
	{
		id: 'row-number',
		name: '행-번호 (A-01, A-02, B-01...)',
		pattern: '{ROW}-{NUMBER}',
		description: '행은 A, B, C... 순서로, 번호는 01, 02, 03... 순서로',
		generate: (index: number, row: number, col: number) =>
			`${String.fromCharCode(65 + row)}-${String(col + 1).padStart(2, '0')}`,
	},
	{
		id: 'sequential',
		name: '순차번호 (001, 002, 003...)',
		pattern: '{INDEX}',
		description: '전체 좌석을 순서대로 001, 002, 003... 번호 부여',
		generate: (index: number) => String(index + 1).padStart(3, '0'),
	},
	{
		id: 'table-number',
		name: '테이블 번호 (테이블1, 테이블2...)',
		pattern: '테이블{NUMBER}',
		description: '테이블1, 테이블2, 테이블3... 형태로 번호 부여',
		generate: (index: number) => `테이블${index + 1}`,
	},
	{
		id: 'seat-number',
		name: '좌석 번호 (좌석01, 좌석02...)',
		pattern: '좌석{NUMBER}',
		description: '좌석01, 좌석02, 좌석03... 형태로 번호 부여',
		generate: (index: number) => `좌석${String(index + 1).padStart(2, '0')}`,
	},
	{
		id: 'custom',
		name: '사용자 정의',
		pattern: 'CUSTOM',
		description: '사용자가 직접 패턴을 입력',
		generate: (
			index: number,
			row: number,
			col: number,
			customPattern?: string
		) => {
			if (!customPattern) return `${index + 1}`;
			return customPattern
				.replace('{INDEX}', String(index + 1))
				.replace('{ROW}', String.fromCharCode(65 + row))
				.replace('{COL}', String(col + 1))
				.replace('{NUMBER}', String(index + 1).padStart(2, '0'));
		},
	},
];

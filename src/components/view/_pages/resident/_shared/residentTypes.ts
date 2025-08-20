/* 주민 관련 공통 타입 정의 */

export interface ResidentTab {
	id: string;
	label: string;
}

export interface ResidentPageProps {
	residentId: number;
	loading?: boolean;
	onDataChange?: () => void;
}

/* 사용자 관련 공통 타입 정의 */

export interface UserTab {
	id: string;
	label: string;
}

export interface UserPageProps {
	userId: number;
	loading?: boolean;
	onDataChange?: () => void;
}
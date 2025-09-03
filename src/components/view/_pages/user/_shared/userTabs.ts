/* 사용자 페이지 공통 탭 구성 */

import { UserTab } from './userTypes';

/**
 * 사용자 상세 페이지들의 공통 탭 구성을 생성한다
 * @param userId 사용자 ID (CSR 방식으로 변경되어 사용하지 않음)
 * @returns 탭 구성 배열
 */
export function createUserTabs(): UserTab[] {
	return [
		{
			id: 'basic',
			label: '기본 정보',
		},
		{
			id: 'connection',
			label: '세대 연결',
		},
		{
			id: 'history',
			label: '거주 히스토리',
		},
	];
}

// UserTab 타입은 userTypes.ts에서 가져옴
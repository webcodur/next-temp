/* 주민 페이지 공통 탭 구성 */

import { ResidentTab } from './residentTypes';

/**
 * 주민 상세 페이지들의 공통 탭 구성을 생성한다
 * @param residentId 주민 ID (CSR 방식으로 변경되어 사용하지 않음)
 * @returns 탭 구성 배열
 */
export function createResidentTabs(): ResidentTab[] {
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

// ResidentTab 타입은 residentTypes.ts에서 가져옴

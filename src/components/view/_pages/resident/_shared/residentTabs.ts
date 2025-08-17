/* 거주자 페이지 공통 탭 구성 */

import { ResidentTab } from './residentTypes';

/**
 * 거주자 상세 페이지들의 공통 탭 구성을 생성한다
 * @param residentId 거주자 ID
 * @returns 탭 구성 배열
 */
export function createResidentTabs(residentId: number): ResidentTab[] {
	return [
		{
			id: 'basic',
			label: '기본 정보',
			href: `/parking/occupancy/resident/${residentId}`,
		},
		{
			id: 'connection',
			label: '세대 연결',
			href: `/parking/occupancy/resident/${residentId}/connection`,
		},
		{
			id: 'movement',
			label: '세대 이전',
			href: `/parking/occupancy/resident/${residentId}/movement`,
		},
	];
}

// ResidentTab 타입은 residentTypes.ts에서 가져옴

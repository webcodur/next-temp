/* 차량 페이지 공통 탭 구성 */

import { CarTab } from './carTypes';

/**
 * 차량 상세 페이지들의 공통 탭 구성을 생성한다
 * @param carId 차량 ID
 * @returns 탭 구성 배열
 */
export function createCarTabs(carId: number): CarTab[] {
	return [
		{
			id: 'basic',
			label: '기본 정보',
			href: `/parking/occupancy/car/${carId}`,
		},
		{
			id: 'instances',
			label: '세대 연결',
			href: `/parking/occupancy/car/${carId}/instances`,
		},
		{
			id: 'residents',
			label: '거주자 연결',
			href: `/parking/occupancy/car/${carId}/residents`,
		},
	];
}

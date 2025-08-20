/* 차량 페이지 공통 탭 구성 */

import { CarTab } from './carTypes';

/**
 * 차량 상세 페이지들의 공통 탭 구성을 생성한다
 * @param carId 차량 ID (CSR 방식으로 변경되어 사용하지 않음)
 * @returns 탭 구성 배열
 */
export function createCarTabs(): CarTab[] {
	return [
		{
			id: 'basic',
			label: '기본 정보',
		},
		{
			id: 'instances',
			label: '세대 연결',
		},
		{
			id: 'residents',
			label: '주민 연결',
		},
	];
}

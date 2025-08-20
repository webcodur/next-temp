/* 세대 페이지 공통 탭 구성 */

import { InstanceTab } from './instanceTypes';

/**
 * 세대 상세 페이지들의 공통 탭 구성을 생성한다
 * @param instanceId 세대 ID (CSR 방식으로 변경되어 사용하지 않음)
 * @returns 탭 구성 배열
 */
export function createInstanceTabs(): InstanceTab[] {
	return [
		{
			id: 'basic',
			label: '기본 정보',
		},
		{
			id: 'service',
			label: '서비스 설정',
		},
		{
			id: 'visit',
			label: '방문 설정',
		},
	];
}

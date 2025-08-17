/* 세대 페이지 공통 탭 구성 */

import { InstanceTab } from './instanceTypes';

/**
 * 세대 상세 페이지들의 공통 탭 구성을 생성한다
 * @param instanceId 세대 ID
 * @returns 탭 구성 배열
 */
export function createInstanceTabs(instanceId: number): InstanceTab[] {
	return [
		{
			id: 'basic',
			label: '기본 정보',
			href: `/parking/occupancy/instance/${instanceId}`,
		},
		{
			id: 'service',
			label: '서비스 설정',
			href: `/parking/occupancy/instance/${instanceId}/service`,
		},
		{
			id: 'visit',
			label: '방문 설정',
			href: `/parking/occupancy/instance/${instanceId}/visit`,
		},
	];
}

/* 디바이스 페이지 공통 탭 구성 */

import { DeviceTab } from './deviceTypes';

/**
 * 디바이스 상세 페이지들의 공통 탭 구성을 생성한다
 * @param deviceId 디바이스 ID
 * @returns 탭 구성 배열
 */
export function createDeviceTabs(deviceId: number): DeviceTab[] {
	return [
		{
			id: 'basic',
			label: '기본 정보',
			href: `/parking/lot/device/${deviceId}`,
		},
		{
			id: 'permissions',
			label: '출입 권한',
			href: `/parking/lot/device/${deviceId}/permissions`,
		},
		{
			id: 'logs',
			label: '명령 로그',
			href: `/parking/lot/device/${deviceId}/logs`,
		},
		{
			id: 'history',
			label: '변경 이력',
			href: `/parking/lot/device/${deviceId}/history`,
		},
	];
}

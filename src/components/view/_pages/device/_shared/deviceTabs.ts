/* 디바이스 페이지 공통 탭 구성 */

import { DeviceTab } from './deviceTypes';

/**
 * 디바이스 상세 페이지들의 공통 탭 구성을 생성한다
 * @param deviceId 디바이스 ID (CSR 방식으로 변경되어 사용하지 않음)
 * @returns 탭 구성 배열
 */
export function createDeviceTabs(): DeviceTab[] {
	return [
		{
			id: 'basic',
			label: '기본 정보',
		},
		{
			id: 'permissions',
			label: '출입 권한',
		},
		{
			id: 'logs',
			label: '명령 로그',
		},
		{
			id: 'history',
			label: '변경 이력',
		},
	];
}

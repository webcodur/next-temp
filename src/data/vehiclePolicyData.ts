import { VehicleType, VehicleAccessPolicy } from '@/types/parking';

// #region 차량 유형 목록
/**
 * 시스템에서 지원하는 차량 유형 목록
 * 각 유형은 차단기 통과 정책에서 개별적으로 설정 가능하다
 */
export const VEHICLE_TYPES: readonly VehicleType[] = [
	'입주',
	'방문', 
	'업무',
	'정기',
	'임대',
	'상가',
	'미등록',
	'택시(택배 포함)',
] as const;
// #endregion

// #region 유틸리티 함수
/**
 * 차량 유형이 유효한지 검증한다
 */
export const isValidVehicleType = (type: string): type is VehicleType => {
	return VEHICLE_TYPES.includes(type as VehicleType);
};

/**
 * 정책 객체가 모든 차량 유형을 포함하는지 검증한다
 */
export const isValidAccessPolicy = (policy: Record<string, boolean>): policy is VehicleAccessPolicy => {
	return VEHICLE_TYPES.every(type => type in policy);
};

/**
 * 빈 정책 객체를 생성한다 (모든 유형을 false로 초기화)
 */
export const createEmptyAccessPolicy = (): VehicleAccessPolicy => {
	const policy = {} as VehicleAccessPolicy;
	for (const type of VEHICLE_TYPES) {
		policy[type] = false;
	}
	return policy;
};

/**
 * 불완전한 정책 객체를 정규화한다 (누락된 유형은 false로 보완)
 */
export const normalizeAccessPolicy = (policy: Partial<Record<string, boolean>>): VehicleAccessPolicy => {
	const result = createEmptyAccessPolicy();
	
	for (const type of VEHICLE_TYPES) {
		if (type in policy && typeof policy[type] === 'boolean') {
			result[type] = policy[type]!;
		}
	}
	
	return result;
};
// #endregion 
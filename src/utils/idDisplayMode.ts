/* 
  파일명: /utils/idDisplayMode.ts
  기능: ID 컬럼 표시 모드 제어 유틸리티
  책임: 환경변수 및 사용자 권한 기반으로 ID 컬럼 표시 여부 결정
*/

import { getCurrentUser } from './auth';

/**
 * 사용자가 최고관리자인지 확인
 * @returns 최고관리자 여부
 */
const isSuperAdmin = (): boolean => {
	if (typeof window === 'undefined') return false;
	
	try {
		const user = getCurrentUser();
		return String(user?.role) === '1';
	} catch {
		return false;
	}
};

/**
 * ID 컬럼을 표시할지 여부를 반환한다
 * @returns ID 컬럼 표시 여부
 */
export const shouldShowIdColumns = (): boolean => {
	return isSuperAdmin() || process.env.NEXT_PUBLIC_ID_DISPLAY_MODE === 'true';
};

/**
 * 컬럼이 ID 컬럼인지 판단한다
 * @param column 컬럼 정보
 * @returns ID 컬럼 여부
 */
export const isIdColumn = (column: { key?: string | symbol; header?: string; type?: string }): boolean => {
	// 1. 타입이 'id'인 경우
	if (column.type === 'id') return true;
	
	// 2. key가 id로 시작하거나 끝나는 경우
	if (column.key && typeof column.key === 'string') {
		const keyStr = column.key.toLowerCase();
		if (keyStr === 'id' || keyStr.startsWith('id_') || keyStr.endsWith('_id') || keyStr.includes('id')) {
			return true;
		}
	}
	
	// 3. header에 ID가 포함된 경우
	if (column.header) {
		const headerStr = column.header.toLowerCase();
		if (headerStr.includes('id') || headerStr.includes('식별자') || headerStr.includes('아이디')) {
			return true;
		}
	}
	
	return false;
};

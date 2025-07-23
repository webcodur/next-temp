/**
 * 관리자 비밀번호 초기화 API
 * PUT /admin/{id}/password/reset
 */

import { fetchDefault } from '@/services/fetchClient';

interface ResetAdminPasswordRequest {
	id: number;
}

interface ResetAdminPasswordResponse {
	success: boolean;
	data?: any;
	errorMsg?: string;
}

export async function resetAdminPassword(
	params: ResetAdminPasswordRequest
): Promise<ResetAdminPasswordResponse> {
	// TODO: 실존하지 않는 API - 임시 구현
	console.warn('resetAdminPassword API is not implemented on server');
	return {
		success: false,
		errorMsg: '비밀번호 초기화 기능은 현재 사용할 수 없습니다.',
	};

	// 실제 API 호출 코드 (주석 처리)
	// try {
	//   const response = await fetchDefault(`/admin/${params.id}/password/reset`, {
	//     method: 'PUT',
	//   });
	//   return response;
	// } catch (error) {
	//   console.error('관리자 비밀번호 초기화 API 호출 실패:', error);
	//   return {
	//     success: false,
	//     errorMsg: '비밀번호 초기화 중 오류가 발생했습니다.',
	//   };
	// }
}

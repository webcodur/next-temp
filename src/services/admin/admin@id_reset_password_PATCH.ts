'use client';
import { fetchDefault } from '@/services/fetchClient';
import { ResetAdminPasswordResponse } from '@/types/admin';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

//#region 서버 타입 정의 (파일 내부 사용)
interface ResetAdminPasswordServerResponse {
	id: number;
	account: string;
	temporary_password: string; // snake_case
	reset_at: string; // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: ResetAdminPasswordServerResponse): ResetAdminPasswordResponse {
	return {
		id: server.id,
		account: server.account,
		temporaryPassword: server.temporary_password,
		resetAt: server.reset_at,
	};
}
//#endregion

// 관리자 계정의 비밀번호를 임시 비밀번호로 초기화한다
export async function resetAdminPassword({ id }: { id: number }) {
	const response = await fetchDefault(`/admin/${id}/reset/password`, {
		method: 'PATCH',
	});

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: await getApiErrorMessage(result, response.status, 'resetAdminPassword'),
		};
	}

	const serverResponse = result as ResetAdminPasswordServerResponse;
	const clientData = serverToClient(serverResponse);

	return {
		success: true,
		data: clientData,
	};
}

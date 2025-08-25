'use client';
import { fetchDefault } from '@/services/fetchClient';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

//#region 서버 타입 정의 (파일 내부 사용)
interface DeleteAdminServerResponse {
	message?: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: DeleteAdminServerResponse) {
	return {
		message: server.message,
	};
}
//#endregion

// 시스템 관리자가 계정 ID로 관리자 계정을 삭제한다
export async function deleteAdmin({ id }: { id: number }) {
	const response = await fetchDefault(`/admin/${id}`, {
		method: 'DELETE',
	});

	// 204 No Content 응답의 경우 JSON 파싱하지 않음
	if (response.status === 204) {
		return {
			success: true,
			data: { message: '관리자 계정이 성공적으로 삭제되었습니다.' },
		};
	}

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: await getApiErrorMessage(result, response.status),
		};
	}

	const serverResponse = result as DeleteAdminServerResponse;
	const clientData = serverToClient(serverResponse);

	return {
		success: true,
		data: clientData,
	};
}

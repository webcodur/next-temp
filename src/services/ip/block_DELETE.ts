'use client';
import { fetchDefault } from '@/services/fetchClient';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

//#region 서버 타입 정의 (파일 내부 사용)
interface DeleteAllBlockedIpServerResponse {
	message?: string;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: DeleteAllBlockedIpServerResponse) {
	return {
		message: server.message,
	};
}
//#endregion

/**
 * Redis에 저장된 모든 차단된 IP 주소를 해제한다
 * @returns 모든 IP 차단 해제 결과
 */
export async function deleteAllBlockedIp() {
	const response = await fetchDefault('/ip/block', {
		method: 'DELETE',
	});

	// 204 No Content 응답의 경우 JSON 파싱하지 않음
	if (response.status === 204) {
		return {
			success: true,
			data: { message: '모든 IP 차단이 성공적으로 해제되었습니다.' },
		};
	}

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: await getApiErrorMessage(result, response.status),
		};
	}

	const serverResponse = result as DeleteAllBlockedIpServerResponse;
	const clientData = serverToClient(serverResponse);

	return {
		success: true,
		data: clientData,
	};
}

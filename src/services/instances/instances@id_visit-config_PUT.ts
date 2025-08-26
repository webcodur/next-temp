'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateInstanceVisitConfigRequest } from '@/types/instance';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface UpdateInstanceVisitConfigServerRequest {
	available_visit_time?: number;
	purchased_visit_time?: number;
	visit_request_limit?: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function clientToServer(
	client: UpdateInstanceVisitConfigRequest
): UpdateInstanceVisitConfigServerRequest {
	return {
		available_visit_time: client.availableVisitTime,
		purchased_visit_time: client.purchasedVisitTime,
		visit_request_limit: client.visitRequestLimit,
	};
}
// #endregion

export async function updateInstanceVisitConfig(
	id: number,
	data: UpdateInstanceVisitConfigRequest
) {
	const serverRequest = clientToServer(data);
	const response = await fetchDefault(`/instances/${id}/visit-config`, {
		method: 'PUT',
		body: JSON.stringify(serverRequest),
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status, 'updateInstanceVisitConfig'),
		};
	}

	return {
		success: true,
		data: result,
	};
}

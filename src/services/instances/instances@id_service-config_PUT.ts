'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateInstanceServiceConfigRequest } from '@/types/instance';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface UpdateInstanceServiceConfigServerRequest {
	can_add_new_resident?: boolean;
	is_common_entrance_subscribed?: boolean;
	is_temporary_access?: boolean;
	temp_car_limit?: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function clientToServer(
	client: UpdateInstanceServiceConfigRequest
): UpdateInstanceServiceConfigServerRequest {
	return {
		can_add_new_resident: client.canAddNewResident,
		is_common_entrance_subscribed: client.isCommonEntranceSubscribed,
		is_temporary_access: client.isTemporaryAccess,
		temp_car_limit: client.tempCarLimit,
	};
}
// #endregion

export async function updateInstanceServiceConfig(
	id: number,
	data: UpdateInstanceServiceConfigRequest
) {
	const serverRequest = clientToServer(data);
	const response = await fetchDefault(`/instances/${id}/service-config`, {
		method: 'PUT',
		body: JSON.stringify(serverRequest),
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status, 'updateInstanceServiceConfig'),
		};
	}

	return {
		success: true,
		data: result,
	};
}

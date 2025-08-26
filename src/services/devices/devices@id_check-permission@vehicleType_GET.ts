'use client';
import { fetchDefault } from '@/services/fetchClient';
import { VehicleType, VehicleAccessResponse } from '@/types/device';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface VehicleAccessServerResponse {
	allowed: boolean;
	car_type: string;
	reason?: string;
	time_restriction?: string;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(
	server: VehicleAccessServerResponse
): VehicleAccessResponse {
	return {
		allowed: server.allowed,
		carType: server.car_type,
		reason: server.reason,
		timeRestriction: server.time_restriction,
	};
}
// #endregion

export async function checkVehiclePermission(
	id: number,
	vehicleType: VehicleType
) {
	const response = await fetchDefault(
		`/devices/${id}/check-permission/${vehicleType}`,
		{
			method: 'GET',
		}
	);

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status, 'checkVehiclePermission'),
		};
	}

	const serverResponse = result as VehicleAccessServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}

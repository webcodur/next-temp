'use client';
import { fetchDefault } from '@/services/fetchClient';
import { VehicleType, VehicleAccessResponse } from '@/types/device';

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
		const errorMsg =
			result.message ||
			`차량 유형별 출입 허가 확인 실패(코드): ${response.status}`;

		return { success: false, errorMsg };
	}

	const serverResponse = result as VehicleAccessServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}

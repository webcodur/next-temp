'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	SearchParkingDeviceCommandLogRequest,
	ParkingDeviceCommandLogListResponse,
	ParkingDeviceCommandLog,
} from '@/types/device';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface ParkingDeviceCommandLogServerResponse {
	id: number;
	device_id: number;
	admin_id?: number | null;
	command: string;
	status: number;
	request_data?: Record<string, unknown>;
	response_data?: Record<string, unknown>;
	error_message?: string | null;
	created_at: string;
}

interface ParkingDeviceCommandLogListServerResponse {
	data: ParkingDeviceCommandLogServerResponse[];
	total: number;
	page: number;
	limit: number;
	total_pages: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(
	server: ParkingDeviceCommandLogServerResponse
): ParkingDeviceCommandLog {
	return {
		id: server.id,
		deviceId: server.device_id,
		adminId: server.admin_id,
		command: server.command,
		status: server.status,
		requestData: server.request_data,
		responseData: server.response_data,
		errorMessage: server.error_message,
		createdAt: new Date(server.created_at),
	};
}

function serverListToClient(
	serverResponse: ParkingDeviceCommandLogListServerResponse
): ParkingDeviceCommandLogListResponse {
	return {
		data: serverResponse.data.map(serverToClient),
		total: serverResponse.total,
		page: serverResponse.page,
		limit: serverResponse.limit,
		totalPages: serverResponse.total_pages,
	};
}
// #endregion

export async function searchParkingDeviceCommandLogs(
	id: number,
	params?: SearchParkingDeviceCommandLogRequest
) {
	const searchParams = new URLSearchParams();

	if (params?.page) searchParams.append('page', params.page.toString());
	if (params?.limit) searchParams.append('limit', params.limit.toString());

	const url = `/devices/${id}/command-logs${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

	const response = await fetchDefault(url, {
		method: 'GET',
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status),
		};
	}

	const serverResponse = result as ParkingDeviceCommandLogListServerResponse;
	return {
		success: true,
		data: serverListToClient(serverResponse),
	};
}

'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	SearchParkingDeviceHistoryRequest,
	ParkingDeviceHistoryListResponse,
	ParkingDeviceHistory,
} from '@/types/device';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface ParkingDeviceHistoryServerResponse {
	id: number;
	parking_device_id: number;
	action_type: 'CREATED' | 'UPDATED' | 'DELETED';
	before_data?: Record<string, unknown>;
	after_data?: Record<string, unknown>;
	changed_fields?: string;
	admin_id?: number;
	changed_by_type: 'ADMIN' | 'SYSTEM' | 'API';
	reason?: string;
	ip_address?: string;
	user_agent?: string;
	created_at: string;
	admin?: {
		id: number;
		name: string;
		email: string;
	};
}

interface ParkingDeviceHistoryListServerResponse {
	data: ParkingDeviceHistoryServerResponse[];
	total: number;
	page: number;
	limit: number;
	total_pages: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(
	server: ParkingDeviceHistoryServerResponse
): ParkingDeviceHistory {
	return {
		id: server.id,
		parkingDeviceId: server.parking_device_id,
		actionType: server.action_type,
		beforeData: server.before_data,
		afterData: server.after_data,
		changedFields: server.changed_fields,
		adminId: server.admin_id,
		changedByType: server.changed_by_type,
		reason: server.reason,
		ipAddress: server.ip_address,
		userAgent: server.user_agent,
		createdAt: new Date(server.created_at),
		admin: server.admin,
	};
}

function serverListToClient(
	serverResponse: ParkingDeviceHistoryListServerResponse
): ParkingDeviceHistoryListResponse {
	return {
		data: serverResponse.data.map(serverToClient),
		total: serverResponse.total,
		page: serverResponse.page,
		limit: serverResponse.limit,
		totalPages: serverResponse.total_pages,
	};
}
// #endregion

export async function searchParkingDeviceHistory(
	id: number,
	params?: SearchParkingDeviceHistoryRequest
) {
	const searchParams = new URLSearchParams();

	if (params?.page) searchParams.append('page', params.page.toString());
	if (params?.limit) searchParams.append('limit', params.limit.toString());
	if (params?.actionType) searchParams.append('action_type', params.actionType);
	if (params?.changedFields)
		searchParams.append('changed_fields', params.changedFields);
	if (params?.startDate) searchParams.append('start_date', params.startDate);
	if (params?.endDate) searchParams.append('end_date', params.endDate);

	const url = `/devices/${id}/history${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

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

	const serverResponse = result as ParkingDeviceHistoryListServerResponse;
	return {
		success: true,
		data: serverListToClient(serverResponse),
	};
}

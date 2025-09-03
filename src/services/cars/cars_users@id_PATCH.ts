'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	UpdateCarInstanceUserRequest,
	CarInstanceUser,
} from '@/types/car';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface CarInstanceUserServerResponse {
	id: number;
	car_instance_id: number;
	user_id: number;
	car_alarm: boolean;
	is_primary: boolean;
	created_at: string;
	updated_at: string;
}

interface UpdateCarInstanceUserServerRequest {
	car_alarm?: boolean;
	is_primary?: boolean;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(
	server: CarInstanceUserServerResponse
): CarInstanceUser {
	return {
		id: server.id,
		carInstanceId: server.car_instance_id,
		userId: server.user_id,
		carAlarm: server.car_alarm,
		isPrimary: server.is_primary,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
	};
}

function clientToServer(
	client: UpdateCarInstanceUserRequest
): UpdateCarInstanceUserServerRequest {
	return {
		car_alarm: client.carAlarm,
		is_primary: client.isPrimary,
	};
}
// #endregion

export async function updateCarInstanceUser(
	carInstanceUserId: number,
	data: UpdateCarInstanceUserRequest,
	parkinglotId?: string
) {
	const serverRequest = clientToServer(data);
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (parkinglotId) {
		headers['x-parkinglot-id'] = parkinglotId;
	}

	const response = await fetchDefault(
		`/cars/users/${carInstanceUserId}`,
		{
			method: 'PATCH',
			headers,
			body: JSON.stringify(serverRequest),
		}
	);

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status, 'updateCarInstanceUser'),
		};
	}

	const serverResponse = result as CarInstanceUserServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}

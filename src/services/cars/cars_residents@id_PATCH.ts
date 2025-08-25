'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	UpdateCarInstanceResidentRequest,
	CarInstanceResident,
} from '@/types/car';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface CarInstanceResidentServerResponse {
	id: number;
	car_instance_id: number;
	resident_id: number;
	car_alarm: boolean;
	is_primary: boolean;
	created_at: string;
	updated_at: string;
}

interface UpdateCarInstanceResidentServerRequest {
	car_alarm?: boolean;
	is_primary?: boolean;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(
	server: CarInstanceResidentServerResponse
): CarInstanceResident {
	return {
		id: server.id,
		carInstanceId: server.car_instance_id,
		residentId: server.resident_id,
		carAlarm: server.car_alarm,
		isPrimary: server.is_primary,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
	};
}

function clientToServer(
	client: UpdateCarInstanceResidentRequest
): UpdateCarInstanceResidentServerRequest {
	return {
		car_alarm: client.carAlarm,
		is_primary: client.isPrimary,
	};
}
// #endregion

export async function updateCarInstanceResident(
	carInstanceResidentId: number,
	data: UpdateCarInstanceResidentRequest,
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
		`/cars/residents/${carInstanceResidentId}`,
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
			errorMsg: await getApiErrorMessage(result, response.status),
		};
	}

	const serverResponse = result as CarInstanceResidentServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}

'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CarInstanceResidentDetail } from '@/types/car';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

// Instance와 Resident 타입 정의
interface Instance {
	id: number;
	[key: string]: unknown;
}

interface Resident {
	id: number;
	[key: string]: unknown;
}

// #region 서버 타입 정의 (내부 사용)
interface CarServerResponse {
	id: number;
	car_number: string;
	brand: string | null;
	model: string | null;
	type: string | null;
	outer_text: string | null;
	year: number | null;
	external_sticker: string | null;
	fuel: string | null;
	front_image_url: string | null;
	rear_image_url: string | null;
	side_image_url: string | null;
	top_image_url: string | null;
	created_at: string;
	updated_at: string;
}

interface CarInstanceServerResponse {
	id: number;
	car_number: string;
	instance_id: number;
	car_share_onoff: boolean;
	created_at: string;
	updated_at: string;
	car?: CarServerResponse;
	instance?: Record<string, unknown>;
}

interface CarInstanceResidentDetailServerResponse {
	id: number;
	car_instance_id: number;
	resident_id: number;
	car_alarm: boolean;
	is_primary: boolean;
	created_at: string;
	updated_at: string;
	car_instance?: CarInstanceServerResponse;
	resident?: Record<string, unknown>;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(
	server: CarInstanceResidentDetailServerResponse
): CarInstanceResidentDetail {
	return {
		id: server.id,
		carInstanceId: server.car_instance_id,
		residentId: server.resident_id,
		carAlarm: server.car_alarm,
		isPrimary: server.is_primary,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		carInstance: server.car_instance
			? {
					id: server.car_instance.id,
					carNumber: server.car_instance.car_number,
					instanceId: server.car_instance.instance_id,
					carShareOnoff: server.car_instance.car_share_onoff,
					createdAt: server.car_instance.created_at,
					updatedAt: server.car_instance.updated_at,
					car: server.car_instance.car
						? {
								id: server.car_instance.car.id,
								carNumber: server.car_instance.car.car_number,
								brand: server.car_instance.car.brand,
								model: server.car_instance.car.model,
								type: server.car_instance.car.type,
								outerText: server.car_instance.car.outer_text,
								year: server.car_instance.car.year,
								externalSticker: server.car_instance.car.external_sticker,
								fuel: server.car_instance.car.fuel,
								frontImageUrl: server.car_instance.car.front_image_url,
								rearImageUrl: server.car_instance.car.rear_image_url,
								sideImageUrl: server.car_instance.car.side_image_url,
								topImageUrl: server.car_instance.car.top_image_url,
								createdAt: server.car_instance.car.created_at,
								updatedAt: server.car_instance.car.updated_at,
							}
						: undefined,
					instance: server.car_instance.instance as Instance | undefined,
				}
			: undefined,
		resident: server.resident as Resident | undefined,
	};
}
// #endregion

export async function getCarInstanceDetail(
	carInstanceId: number,
	parkinglotId?: string
) {
	const headers: Record<string, string> = {};
	if (parkinglotId) {
		headers['x-parkinglot-id'] = parkinglotId;
	}

	const response = await fetchDefault(`/cars/instances/${carInstanceId}`, {
		method: 'GET',
		headers,
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status),
		};
	}

	const serverResponse = result as CarInstanceResidentDetailServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}

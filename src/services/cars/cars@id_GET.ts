'use client';
import { fetchDefault } from '@/services/fetchClient';
import { Car } from '@/types/car';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

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
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: CarServerResponse): Car {
	return {
		id: server.id,
		carNumber: server.car_number,
		brand: server.brand,
		model: server.model,
		type: server.type,
		outerText: server.outer_text,
		year: server.year,
		externalSticker: server.external_sticker,
		fuel: server.fuel,
		frontImageUrl: server.front_image_url,
		rearImageUrl: server.rear_image_url,
		sideImageUrl: server.side_image_url,
		topImageUrl: server.top_image_url,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
	};
}
// #endregion

export async function getCarsByInstance(
	instanceId: number,
	parkinglotId?: string
) {
	const headers: Record<string, string> = {};
	if (parkinglotId) {
		headers['x-parkinglot-id'] = parkinglotId;
	}

	const response = await fetchDefault(`/cars/${instanceId}`, {
		method: 'GET',
		headers,
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: getApiErrorMessage('cars_detail', result, response.status),
		};
	}

	const serverResponse = result as CarServerResponse[];
	return {
		success: true,
		data: serverResponse.map(serverToClient),
	};
}

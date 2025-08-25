'use client';
import { fetchDefault } from '@/services/fetchClient';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

export async function deleteCar(carId: number, parkinglotId?: string) {
	const headers: Record<string, string> = {};

	if (parkinglotId) {
		headers['x-parkinglot-id'] = parkinglotId;
	}

	const response = await fetchDefault(`/cars/${carId}`, {
		method: 'DELETE',
		headers,
	});

	if (!response.ok) {
		const result = await response.json();
		return { 
			success: false, 
			errorMsg: getApiErrorMessage('cars_delete', result, response.status),
		};
	}

	// DELETE 요청의 경우 204 처리
	if (response.status === 204) {
		return { success: true, data: { message: '삭제 완료' } };
	}

	const result = await response.json();
	return {
		success: true,
		data: result,
	};
}

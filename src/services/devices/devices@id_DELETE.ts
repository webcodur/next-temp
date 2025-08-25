'use client';
import { fetchDefault } from '@/services/fetchClient';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

export async function deleteParkingDevice(id: number) {
	const response = await fetchDefault(`/devices/${id}`, {
		method: 'DELETE',
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: getApiErrorMessage('devices_delete', result, response.status),
		};
	}

	// DELETE 요청의 경우 204 처리
	if (response.status === 204) {
		return { success: true, data: { message: '삭제 완료' } };
	}

	return {
		success: true,
		data: result,
	};
}

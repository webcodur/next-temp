'use client';
import { fetchDefault } from '@/services/fetchClient';
import { MoveResidentRequest, ResidentDetail } from '@/types/resident';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface MoveResidentServerRequest {
	resident_id: number;
	instance_id: number;
	memo?: string;
}

interface ResidentInstanceServerResponse {
	id: number;
	resident_id: number;
	instance_id: number;
	memo?: string | null;
	created_at: string;
	updated_at: string;
	instance: {
		id: number;
		parkinglot_id: number;
		address_1depth: string;
		address_2depth: string;
		address_3depth?: string | null;
		instance_type: string;
		memo?: string | null;
		created_at: string;
		updated_at: string;
	} | null;
}

interface ResidentDetailServerResponse {
	id: number;
	name: string;
	phone?: string | null;
	email?: string | null;
	birth_date?: string | null;
	gender?: 'M' | 'F' | null;
	emergency_contact?: string | null;
	memo?: string | null;
	created_at: string;
	updated_at: string;
	resident_instance?: ResidentInstanceServerResponse[];
}
// #endregion

// #region 변환 함수 (내부 사용)
function clientToServer(
	client: MoveResidentRequest
): MoveResidentServerRequest {
	return {
		resident_id: client.residentId,
		instance_id: client.instanceId,
		memo: client.memo,
	};
}

function serverToClient(server: ResidentDetailServerResponse): ResidentDetail {
	return {
		id: server.id,
		name: server.name,
		phone: server.phone,
		email: server.email,
		birthDate: server.birth_date,
		gender: server.gender,
		emergencyContact: server.emergency_contact,
		memo: server.memo,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		residentInstance:
			server.resident_instance?.map((ri) => ({
				id: ri.id,
				residentId: ri.resident_id,
				instanceId: ri.instance_id,
				memo: ri.memo,
				createdAt: ri.created_at,
				updatedAt: ri.updated_at,
				instance: ri.instance
					? {
							id: ri.instance.id,
							parkinglotId: ri.instance.parkinglot_id,
							address1Depth: ri.instance.address_1depth,
							address2Depth: ri.instance.address_2depth,
							address3Depth: ri.instance.address_3depth,
							instanceType: ri.instance.instance_type,
							memo: ri.instance.memo,
							createdAt: ri.instance.created_at,
							updatedAt: ri.instance.updated_at,
						}
					: null,
			})) || [],
	};
}
// #endregion

export async function moveResident(data: MoveResidentRequest) {
	const serverRequest = clientToServer(data);

	try {
		const response = await fetchDefault('/residents/move', {
			method: 'POST',
			body: JSON.stringify(serverRequest),
		});

		const result = await response.json();

		if (!response.ok) {
					return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status, 'moveResident'),
		};
		}

		if (!result || typeof result !== 'object') {
			const errorMsg = '서버 응답 형식이 올바르지 않습니다.';
			console.error('Invalid server response:', result);
			return { success: false, errorMsg };
		}

		const serverResponse = result as ResidentDetailServerResponse;
		return {
			success: true,
			data: serverToClient(serverResponse),
		};
	} catch (error) {
		console.error('moveResident API 호출 중 오류:', error);
		const errorMsg =
			error instanceof Error
				? error.message
				: '알 수 없는 오류가 발생했습니다.';
		return { success: false, errorMsg };
	}
}

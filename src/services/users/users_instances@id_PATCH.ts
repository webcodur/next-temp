'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	UpdateUserInstanceRequest,
	UserDetail,
} from '@/types/user';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface UpdateUserInstanceServerRequest {
	memo?: string;
}

interface UserInstanceServerResponse {
	id: number;
	user_id: number;
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

interface UserDetailServerResponse {
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
	user_instance?: UserInstanceServerResponse[];
}
// #endregion

// #region 변환 함수 (내부 사용)
function clientToServer(
	client: UpdateUserInstanceRequest
): UpdateUserInstanceServerRequest {
	return {
		memo: client.memo,
	};
}

function serverToClient(server: UserDetailServerResponse): UserDetail {
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
		userInstance: server.user_instance?.map((ui) => ({
			id: ui.id,
			userId: ui.user_id,
			instanceId: ui.instance_id,
			memo: ui.memo,
			createdAt: ui.created_at,
			updatedAt: ui.updated_at,
			instance: ui.instance
				? {
						id: ui.instance.id,
						parkinglotId: ui.instance.parkinglot_id,
						address1Depth: ui.instance.address_1depth,
						address2Depth: ui.instance.address_2depth,
						address3Depth: ui.instance.address_3depth,
						instanceType: ui.instance.instance_type,
						memo: ui.instance.memo,
						createdAt: ui.instance.created_at,
						updatedAt: ui.instance.updated_at,
					}
				: null,
		})) || [],
	};
}
// #endregion

export async function updateUserInstance(
	id: number,
	data: UpdateUserInstanceRequest
) {
	const serverRequest = clientToServer(data);
	const response = await fetchDefault(`/users/instances/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(serverRequest),
	});

	const result = await response.json();

	if (!response.ok) {
		return { 
			success: false, 
			errorMsg: await getApiErrorMessage(result, response.status, 'updateUserInstance'),
		};
	}

	const serverResponse = result as UserDetailServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}
'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateAdminRequest, Admin } from '@/types/admin';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

//#region 서버 타입 정의 (파일 내부 사용)
interface UpdateAdminServerRequest {
	name?: string;
	email?: string;
	phone?: string;
	password?: string;
	role_id?: number; // snake_case
}

interface AdminServerResponse {
	id: number;
	account: string;
	role_id: number; // snake_case
	parkinglot_id?: number; // snake_case
	name?: string;
	email?: string;
	phone?: string;
	created_at: string; // snake_case
	updated_at: string; // snake_case
	deleted_at?: string; // snake_case
	role?: {
		id: number;
		code: string;
		name: string;
		description?: string;
	};
	parkinglot?: {
		id: number;
		code: string;
		name: string;
		description?: string;
	};
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: UpdateAdminRequest): UpdateAdminServerRequest {
	return {
		name: client.name,
		email: client.email,
		phone: client.phone,
		password: client.password,
		role_id: client.roleId,
	};
}

function serverToClient(server: AdminServerResponse): Admin {
	return {
		id: server.id,
		account: server.account,
		roleId: server.role_id,
		parkinglotId: server.parkinglot_id,
		name: server.name,
		email: server.email,
		phone: server.phone,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		deletedAt: server.deleted_at,
		role: server.role,
		parkinglot: server.parkinglot,
	};
}
//#endregion

// 관리자 계정 정보를 수정한다 (UpdateAdminDto 기준)
export async function updateAdmin(data: UpdateAdminRequest) {
	const { id } = data;
	const serverRequest = clientToServer(data);

	const response = await fetchDefault(`/admin/${id}`, {
		method: 'PUT',
		body: JSON.stringify(serverRequest),
	});

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: getApiErrorMessage('admin_update', result, response.status),
		};
	}

	const serverResponse = result as AdminServerResponse;
	const clientData = serverToClient(serverResponse);

	return {
		success: true,
		data: clientData,
	};
}

'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateAdminRequest, Admin } from '@/types/admin';

//#region 서버 타입 정의 (파일 내부 사용)
interface CreateAdminServerRequest {
	account: string;
	name: string;
	email?: string;
	phone?: string;
	password: string;
	role_id: number;
	parkinglot_id?: number;
}

interface AdminServerResponse {
	id: number;
	account: string;
	role_id: number;
	parkinglot_id?: number;
	name?: string;
	email?: string;
	phone?: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
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
function clientToServer(client: CreateAdminRequest): CreateAdminServerRequest {
	return {
		account: client.account,
		name: client.name,
		email: client.email,
		phone: client.phone,
		password: client.password,
		role_id: client.roleId,
		parkinglot_id: client.parkinglotId,
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

// 관리자 계정을 생성한다 (CreateAdminDto 기준)
export async function createAdmin(data: CreateAdminRequest) {
	const serverRequest = clientToServer(data);
	const response = await fetchDefault('/admin', {
		method: 'POST',
		body: JSON.stringify(serverRequest),
	});
	const result = await response.json();
	if (!response.ok) {
		const errorMsg =
			result.message || `관리자 계정 생성 실패(코드): ${response.status}`;

		return {
			success: false,
			errorMsg: errorMsg,
		};
	}

	const serverResponse = result as AdminServerResponse;
	const clientData = serverToClient(serverResponse);

	return {
		success: true,
		data: clientData,
	};
}

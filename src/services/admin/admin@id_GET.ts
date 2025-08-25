'use client';
import { fetchDefault } from '@/services/fetchClient';
import { Admin } from '@/types/admin';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

//#region 서버 타입 정의 (파일 내부 사용)
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

// 특정 관리자 계정의 상세 정보를 조회한다
export async function getAdminDetail({ id }: { id: number }) {
	const response = await fetchDefault(`/admin/${id}`, {
		method: 'GET',
	});

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: getApiErrorMessage('admin_detail', result, response.status),
		};
	}

	const serverResponse = result as AdminServerResponse;
	const clientData = serverToClient(serverResponse);

	return {
		success: true,
		data: clientData,
	};
}

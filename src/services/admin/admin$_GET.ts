'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchAdminRequest, Admin } from '@/types/admin';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

//#region 서버 타입 정의 (파일 내부 사용)
interface AdminSearchServerResponse {
	data: AdminServerResponse[];
	meta: {
		total_items: number;
		current_page: number;
		items_per_page: number;
		total_pages: number;
	};
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
function buildServerQueryParams(client: SearchAdminRequest): URLSearchParams {
	const queryParams = new URLSearchParams();

	queryParams.append('page', (client.page || 1).toString());
	queryParams.append('limit', (client.limit || 10).toString());
	if (client.account) queryParams.append('account', client.account);
	if (client.name) queryParams.append('name', client.name);
	if (client.email) queryParams.append('email', client.email);
	if (client.roleId) queryParams.append('role_id', client.roleId.toString()); // snake_case로 변환

	return queryParams;
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

function searchResponseToClient(server: AdminSearchServerResponse) {
	return {
		data: server.data.map(serverToClient),
		total: server.meta.total_items,
		page: server.meta.current_page,
		limit: server.meta.items_per_page,
		totalPages: server.meta.total_pages,
	};
}
//#endregion

// 관리자 목록을 검색한다 (페이지네이션 및 필터링)
export async function searchAdmin(params: SearchAdminRequest = {}) {
	const queryParams = buildServerQueryParams(params);

	const response = await fetchDefault(
		`/admin/search?${queryParams.toString()}`,
		{
			method: 'GET',
		}
	);

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: await getApiErrorMessage(result, response.status, 'searchAdmin'),
		};
	}

	const serverResponse = result as AdminSearchServerResponse;
	const clientData = searchResponseToClient(serverResponse);

	return {
		success: true,
		data: clientData,
	};
}

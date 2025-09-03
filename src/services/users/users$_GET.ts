'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	SearchUserParams,
	PaginatedUserResponse,
} from '@/types/user';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
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
	user_instance: UserInstanceServerResponse[];
}

interface PaginatedUserServerResponse {
	data: UserDetailServerResponse[];
	total: number;
	page: number;
	limit: number;
	total_pages: number;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(
	server: PaginatedUserServerResponse
): PaginatedUserResponse {
	return {
		data: server.data.map((user) => ({
			id: user.id,
			name: user.name,
			phone: user.phone,
			email: user.email,
			birthDate: user.birth_date,
			gender: user.gender,
			emergencyContact: user.emergency_contact,
			memo: user.memo,
			createdAt: user.created_at,
			updatedAt: user.updated_at,
			userInstance: user.user_instance.map((ui) => ({
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
			})),
		})),
		total: server.total,
		page: server.page,
		limit: server.limit,
		totalPages: server.total_pages,
	};
}
// #endregion

export async function searchUsers(params?: SearchUserParams) {
	const searchParams = new URLSearchParams();

	if (params?.page) searchParams.append('page', params.page.toString());
	if (params?.limit) searchParams.append('limit', params.limit.toString());
	if (params?.name) searchParams.append('name', params.name);
	if (params?.phone) searchParams.append('phone', params.phone);
	if (params?.email) searchParams.append('email', params.email);
	if (params?.gender) searchParams.append('gender', params.gender);
	if (params?.address1Depth)
		searchParams.append('address_1depth', params.address1Depth);
	if (params?.address2Depth)
		searchParams.append('address_2depth', params.address2Depth);
	if (params?.address3Depth)
		searchParams.append('address_3depth', params.address3Depth);

	const queryString = searchParams.toString();
	const url = queryString ? `/users?${queryString}` : '/users';

	const response = await fetchDefault(url, {
		method: 'GET',
	});

	const result = await response.json();

	if (!response.ok) {
				return { 
		success: false, 
		errorMsg: await getApiErrorMessage(result, response.status, 'searchUsers'),
	};
	}

	const serverResponse = result as PaginatedUserServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}
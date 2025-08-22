'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	SearchBlacklistRequest,
	BlacklistResponse,
	PageResponse,
	BlacklistRegistrationReason,
} from '@/types/blacklist';

// #region 서버 타입 정의 (내부 사용)
interface BlacklistServerResponse {
	id: number;
	car_id?: number | null;
	car_number: string;
	blacklist_type: string;
	registration_reason: string;
	total_violations: number;
	total_penalty_points: number;
	blocked_at: string | null;
	blocked_until?: string | null;
	auto_unblock: boolean;
	is_active: boolean;
	unblocked_at?: string | null;
	unblocked_by?: number | null;
	unblock_reason?: string | null;
	block_reason?: string | null;
	evidence_data?: unknown;
	registered_by?: number | null;
	created_at: string | null;
	updated_at: string | null;
	car?: {
		id: number;
		car_number: string;
		brand: string | null;
		model: string | null;
	} | null;
	registered_admin?: {
		id: number;
		name: string | null;
		account: string;
	} | null;
	unblocked_admin?: {
		id: number;
		name: string | null;
		account: string;
	} | null;
}

interface PageServerResponse {
	data: BlacklistServerResponse[];
	meta: {
		current_page: number;
		items_per_page: number;
		total_items: number;
		total_pages: number;
		has_next_page: boolean;
		has_previous_page: boolean;
	};
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: BlacklistServerResponse): BlacklistResponse {
	return {
		id: server.id,
		carId: server.car_id,
		carNumber: server.car_number,
		blacklistType: server.blacklist_type as 'AUTO' | 'MANUAL',
		registrationReason:
			server.registration_reason as BlacklistRegistrationReason,
		totalViolations: server.total_violations,
		totalPenaltyPoints: server.total_penalty_points,
		blockedAt: server.blocked_at,
		blockedUntil: server.blocked_until,
		autoUnblock: server.auto_unblock,
		isActive: server.is_active,
		unblockedAt: server.unblocked_at,
		unblockedBy: server.unblocked_by,
		unblockReason: server.unblock_reason,
		blockReason: server.block_reason,
		evidenceData: server.evidence_data,
		registeredBy: server.registered_by,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
		car: server.car,
		registeredAdmin: server.registered_admin,
		unblockedAdmin: server.unblocked_admin,
	};
}

function serverPageToClient(
	server: PageServerResponse
): PageResponse<BlacklistResponse> {
	return {
		data: server.data.map(serverToClient),
		meta: {
			currentPage: server.meta.current_page,
			itemsPerPage: server.meta.items_per_page,
			totalItems: server.meta.total_items,
			totalPages: server.meta.total_pages,
			hasNextPage: server.meta.has_next_page,
			hasPreviousPage: server.meta.has_previous_page,
		},
	};
}
// #endregion

export async function searchBlacklists(params?: SearchBlacklistRequest) {
	const searchParams = new URLSearchParams();

	// 쿼리 파라미터는 snake_case로 전송
	if (params?.carNumber) searchParams.append('car_number', params.carNumber);
	if (params?.blacklistType)
		searchParams.append('blacklist_type', params.blacklistType);
	if (params?.registrationReason)
		searchParams.append('registration_reason', params.registrationReason);
	if (params?.isActive !== undefined)
		searchParams.append('is_active', params.isActive.toString());
	if (params?.page) searchParams.append('page', params.page.toString());
	if (params?.limit) searchParams.append('limit', params.limit.toString());

	const url = `/blacklists${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

	const response = await fetchDefault(url, {
		method: 'GET',
	});

	const result = await response.json();

	if (!response.ok) {
		const errorMsg =
			result.message || `블랙리스트 목록 조회 실패(코드): ${response.status}`;

		return { success: false, errorMsg };
	}

	const serverResponse = result as PageServerResponse;
	return {
		success: true,
		data: serverPageToClient(serverResponse),
	};
}

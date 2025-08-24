'use client';
import { fetchDefault } from '@/services/fetchClient';
import {
	CreateManualBlacklistRequest,
	BlacklistResponse,
	ENUM_BlacklistRegistrationReason,
} from '@/types/blacklist';

// #region 서버 타입 정의 (내부 사용)
interface CreateManualBlacklistServerRequest {
	car_number: string;
	registration_reason: string;
	block_reason: string;
	block_days: number;
}

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
// #endregion

// #region 변환 함수 (내부 사용)
function clientToServer(
	client: CreateManualBlacklistRequest
): CreateManualBlacklistServerRequest {
	return {
		car_number: client.carNumber,
		registration_reason: client.registrationReason,
		block_reason: client.blockReason,
		block_days: client.blockDays,
	};
}

function serverToClient(server: BlacklistServerResponse): BlacklistResponse {
	return {
		id: server.id,
		carId: server.car_id,
		carNumber: server.car_number,
		blacklistType: server.blacklist_type as 'AUTO' | 'MANUAL',
		registrationReason:
			server.registration_reason as ENUM_BlacklistRegistrationReason,
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
// #endregion

export async function createManualBlacklist(
	data: CreateManualBlacklistRequest
) {
	const serverRequest = clientToServer(data);

	const response = await fetchDefault('/blacklists/manual', {
		method: 'POST',
		body: JSON.stringify(serverRequest),
	});

	const result = await response.json();

	if (!response.ok) {
		const errorMsg =
			result.message || `수동 블랙리스트 등록 실패(코드): ${response.status}`;

		return { success: false, errorMsg };
	}

	const serverResponse = result as BlacklistServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}

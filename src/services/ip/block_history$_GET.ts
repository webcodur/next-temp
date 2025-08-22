'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchIpBlockHistoryRequest, IpBlockHistory } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface IpBlockHistoryServerResponse {
	id: number;
	ip: string;
	block_type_id: number;
	block_type: {
		code: string;
		description: string;
	};
	user_agent?: string | null;
	request_method?: string | null;
	request_url?: string | null;
	block_reason: string;
	matched_pattern?: string | null;
	block_duration: number;
	is_active: boolean;
	unblocked_at?: Date | null;
	unblocked_by?: number | null;
	created_at: Date;
	updated_at: Date;
}

interface IpBlockHistorySearchServerResponse {
	data: IpBlockHistoryServerResponse[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function buildServerQueryParams(
	client: SearchIpBlockHistoryRequest
): URLSearchParams {
	const searchParams = new URLSearchParams();

	if (client.page) searchParams.append('page', client.page.toString());
	if (client.limit) searchParams.append('limit', client.limit.toString());
	if (client.ip) searchParams.append('ip', client.ip);
	if (client.reason) searchParams.append('reason', client.reason);
	if (client.date_from) searchParams.append('date_from', client.date_from);
	if (client.date_to) searchParams.append('date_to', client.date_to);

	return searchParams;
}

function serverToClient(server: IpBlockHistoryServerResponse): IpBlockHistory {
	return {
		id: server.id,
		ip: server.ip,
		blockType: server.block_type.code as 'MANUAL' | 'AUTO',
		userAgent: server.user_agent || undefined,
		requestMethod: server.request_method || undefined,
		requestUrl: server.request_url || undefined,
		blockReason: server.block_reason,
		matchedPattern: server.matched_pattern || undefined,
		blockDuration: server.block_duration,
		blockedAt: server.created_at.toString(),
		unblockedAt: server.unblocked_at?.toString(),
		unblockedBy: server.unblocked_by || undefined,
		isActive: server.is_active,
	};
}

function searchResponseToClient(server: IpBlockHistorySearchServerResponse) {
	return {
		data: server.data.map(serverToClient),
		total: server.total,
		page: server.page,
		limit: server.limit,
		totalPages: server.totalPages,
	};
}
//#endregion

/**
 * 쿼리 조건에 따라 차단 내역을 검색한다
 * @param params 검색 조건 (ip, reason, date_from, date_to, page, limit)
 * @returns 차단 내역 목록과 페이지 정보 (PageDto<IpBlockHistory>)
 */
export async function searchBlockHistory(params?: SearchIpBlockHistoryRequest) {
	const searchParams = buildServerQueryParams(params || {});
	const queryString = searchParams.toString();
	const url = queryString
		? `/ip/block/history/search?${queryString}`
		: '/ip/block/history/search';

	const response = await fetchDefault(url, {
		method: 'GET',
	});

	const result = await response.json();

	if (!response.ok) {
		const errorMsg =
			result.message || `차단 내역 검색 실패(코드): ${response.status}`;

		return {
			success: false,
			errorMsg: errorMsg,
		};
	}

	const serverResponse = result as IpBlockHistorySearchServerResponse;
	const clientData = searchResponseToClient(serverResponse);

	return {
		success: true,
		data: clientData,
	};
}

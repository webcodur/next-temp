'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SystemConfig, SystemConfigSearchRequest } from '@/types/api';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

//#region 서버 타입 정의 (파일 내부 사용)
interface SystemConfigServerResponse {
	id: number;
	config_key: string;
	config_value: string;
	title?: string | null;
	description?: string | null;
	config_type: string;
	is_active: boolean;
	category?: string | null;
	group?: string | null;
	created_at?: string;
	updated_at?: string;
}

// API 스펙에 따르면 배열을 직접 반환
type GetAllConfigsServerResponse = SystemConfigServerResponse[];

//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: SystemConfigServerResponse): SystemConfig {
	// config_value (문자열)을 config_type에 따라 적절한 타입으로 변환
	let parsedValue: string | number | boolean | object = server.config_value;

	switch (server.config_type) {
		case 'BOOLEAN':
			parsedValue = server.config_value === 'true';
			break;
		case 'INTEGER':
			parsedValue = parseInt(server.config_value, 10);
			break;
		case 'JSON':
			try {
				parsedValue = JSON.parse(server.config_value);
			} catch {
				parsedValue = server.config_value; // 파싱 실패시 원본 문자열 유지
			}
			break;
		case 'STRING':
		default:
			parsedValue = server.config_value;
			break;
	}

	return {
		id: server.id,
		key: server.config_key,
		value: parsedValue,
		title: server.title,
		description: server.description,
		type: server.config_type,
		isActive: server.is_active,
		category: server.category,
		group: server.group,
		createdAt: server.created_at,
		updatedAt: server.updated_at,
	};
}
//#endregion

/**
 * 설정값을 조회한다 (페이지네이션 및 검색 지원)
 * @param params 검색 및 페이지네이션 파라미터
 * @param parkinglotId 주차장 ID (선택사항)
 * @returns 설정값 목록 (SystemConfig[])
 */
export async function searchConfigs(
	params?: SystemConfigSearchRequest,
	parkinglotId?: string
) {
	// 쿼리 파라미터 구성
	const searchParams = new URLSearchParams();

	if (params?.page) searchParams.append('page', params.page.toString());
	if (params?.limit) searchParams.append('limit', params.limit.toString());
	// 기본적으로 limit이 없으면 큰 값으로 설정
	else searchParams.append('limit', '1000');
	if (params?.config_key) searchParams.append('config_key', params.config_key);
	if (params?.config_type)
		searchParams.append('config_type', params.config_type);
	if (params?.title) searchParams.append('title', params.title);
	if (params?.description)
		searchParams.append('description', params.description);
	if (params?.category) searchParams.append('category', params.category);

	const queryString = searchParams.toString();
	const url = `/configs${queryString ? `?${queryString}` : ''}`;

	// 헤더 구성
	const headers: Record<string, string> = {};
	if (parkinglotId) {
		headers['x-parkinglot-id'] = parkinglotId;
	}

	const response = await fetchDefault(url, {
		method: 'GET',
		headers: Object.keys(headers).length > 0 ? headers : undefined,
	});

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: await getApiErrorMessage(result, response.status, 'searchConfigs'),
		};
	}

	// 응답 구조 검증 - API 스펙에 따르면 배열을 직접 반환
	if (!Array.isArray(result)) {
		console.error('응답이 배열이 아님:', result);
		return {
			success: false,
			errorMsg: '서버에서 예상된 배열 형식을 반환하지 않았습니다.',
		};
	}

	const serverResponse = result as GetAllConfigsServerResponse;
	const clientData = serverResponse.map(serverToClient);

	return {
		success: true,
		data: clientData,
		meta: {
			totalItems: clientData.length,
			currentPage: 1,
			itemsPerPage: clientData.length,
			totalPages: 1,
		},
	};
}

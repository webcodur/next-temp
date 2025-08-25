'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateSystemConfigRequest, SystemConfig } from '@/types/api';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

//#region 서버 타입 정의 (파일 내부 사용)
interface UpdateSystemConfigServerRequest {
	config_value: string;
}

interface SystemConfigServerResponse {
	id: number;
	config_key: string;
	config_value: string;
	title?: string | null;
	description?: string | null;
	config_type: string;
	is_active: boolean;
	created_at?: string;
	updated_at?: string;
	category?: string | null;
	group?: string | null;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(
	client: UpdateSystemConfigRequest
): UpdateSystemConfigServerRequest {
	// 클라이언트 값을 문자열로 변환하여 서버에 전송
	let stringValue: string;

	if (typeof client.value === 'object') {
		stringValue = JSON.stringify(client.value);
	} else {
		stringValue = String(client.value);
	}

	return {
		config_value: stringValue,
	};
}

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
 * 설정값을 업데이트한다
 * @param id 설정값 ID
 * @param data 업데이트할 설정 데이터
 * @param parkinglotId 주차장 ID (선택사항)
 * @returns 업데이트된 설정값 정보 (SystemConfig)
 */
export async function updateConfigById(
	id: number,
	data: UpdateSystemConfigRequest,
	parkinglotId?: string
) {
	const serverRequest = clientToServer(data);

	// 헤더 구성
	const headers: Record<string, string> = {};
	if (parkinglotId) {
		headers['x-parkinglot-id'] = parkinglotId;
	}

	const response = await fetchDefault(`/configs/${id}`, {
		method: 'PUT',
		body: JSON.stringify(serverRequest),
		headers: Object.keys(headers).length > 0 ? headers : undefined,
	});

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: await getApiErrorMessage(result, response.status),
		};
	}

	const serverResponse = result as SystemConfigServerResponse;
	const clientData = serverToClient(serverResponse);

	return {
		success: true,
		data: clientData,
	};
}

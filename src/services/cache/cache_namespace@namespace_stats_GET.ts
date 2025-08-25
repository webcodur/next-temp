'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CacheNamespaceStats } from '@/types/api';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface CacheNamespaceStatsServerResponse {
	namespace: string;
	keys: number;
	memory: number;
	key_list: string[];
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(
	server: CacheNamespaceStatsServerResponse
): CacheNamespaceStats {
	return {
		namespace: server.namespace,
		keys: server.keys,
		memory: server.memory,
		keyList: server.key_list,
	};
}
// #endregion

/**
 * 특정 네임스페이스의 캐시 통계를 조회한다
 * @param namespace 캐시 네임스페이스
 * @returns 네임스페이스별 캐시 통계 정보 (CacheNamespaceStats)
 */
export async function getCacheStatsByNamespace(namespace: string) {
	const response = await fetchDefault(`/cache/namespace/${namespace}/stats`, {
		method: 'GET',
	});

	const result = await response.json();

	if (!response.ok) {
			return {
		success: false,
		errorMsg: getApiErrorMessage('cache_namespace_stats', result, response.status),
	};
	}

	const serverResponse = result as CacheNamespaceStatsServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}

'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CacheStats } from '@/types/api';
import { getApiErrorMessage} from '@/utils/apiErrorMessages';

// #region 서버 타입 정의 (내부 사용)
interface CacheStatsServerResponse {
	total_keys: number;
	total_memory: number;
	hit_rate: number;
	miss_rate: number;
	namespaces: {
		[namespace: string]: {
			keys: number;
			memory: number;
		};
	};
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: CacheStatsServerResponse): CacheStats {
	return {
		totalKeys: server.total_keys,
		totalMemory: server.total_memory,
		hitRate: server.hit_rate,
		missRate: server.miss_rate,
		namespaces: server.namespaces,
	};
}
// #endregion

/**
 * 전체 캐시 상태와 통계를 조회한다
 * @returns 캐시 통계 정보 (CacheStats)
 */
export async function getCacheStats() {
	const response = await fetchDefault('/cache/stats', {
		method: 'GET',
	});

	const result = await response.json();

	if (!response.ok) {
			return {
		success: false,
		errorMsg: await getApiErrorMessage(result, response.status),
	};
	}

	const serverResponse = result as CacheStatsServerResponse;
	return {
		success: true,
		data: serverToClient(serverResponse),
	};
}

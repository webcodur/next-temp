'use client';

import { fetchDefault } from '@/services/fetchClient';
import { getApiErrorMessage } from '@/utils/apiErrorMessages';

//#region 타입 정의 (파일 내부 사용)
interface GeocodingResponse {
	coordinates: {
		longitude: number;
		latitude: number;
	};
}

interface SearchAddressResponse {
	addresses: Array<{
		address: string;
		roadAddress?: string;
		jibunAddress: string;
		englishAddress?: string;
		x: number; // 경도
		y: number; // 위도
		addressElements?: unknown;
	}>;
	totalCount: number;
}

interface ReverseGeocodingResponse {
	address: {
		fullAddress: string;
		roadAddress: string;
		jibunAddress: string;
		si: string;
		gu: string;
		dong: string;
		detail: string;
	};
}
//#endregion

//#region 지오코딩 서비스 함수들

/**
 * 주소를 경위도 좌표로 변환한다
 * @param address 변환할 주소 (예: "서울특별시 강남구 테헤란로 152")
 * @returns 좌표 정보 { longitude, latitude }
 */
export async function addressToCoords(address: string) {
	const response = await fetchDefault('/geo/geocoding', {
		method: 'POST',
		body: JSON.stringify({ address }),
	});

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: await getApiErrorMessage(result, response.status, 'addressToCoords'),
		};
	}

	return {
		success: true,
		data: result as GeocodingResponse,
	};
}

/**
 * 주소를 검색하여 다양한 결과와 좌표를 반환한다
 * @param query 검색할 주소 또는 키워드 (예: "강남구 테헤란로")
 * @returns 주소 검색 결과 목록
 */
export async function searchAddress(query: string) {
	const response = await fetchDefault('/geo/search', {
		method: 'POST',
		body: JSON.stringify({ query }),
	});

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: await getApiErrorMessage(result, response.status, 'searchAddress'),
		};
	}

	return {
		success: true,
		data: result as SearchAddressResponse,
	};
}

/**
 * 경위도 좌표를 주소로 변환한다
 * @param latitude 위도 (예: 37.5665)
 * @param longitude 경도 (예: 126.9780)
 * @returns 주소 정보
 */
export async function coordsToAddress(latitude: number, longitude: number) {
	const response = await fetchDefault('/geo/reverse-geocoding', {
		method: 'POST',
		body: JSON.stringify({ latitude, longitude }),
	});

	const result = await response.json();

	if (!response.ok) {
		return {
			success: false,
			errorMsg: await getApiErrorMessage(result, response.status, 'coordsToAddress'),
		};
	}

	return {
		success: true,
		data: result as ReverseGeocodingResponse,
	};
}

//#endregion

'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchCarHouseholdResidentRequest, CarHouseholdRelationsResponse } from '@/types/car';

/**
 * 차량과 세대 간의 연결 관계를 조회한다
 * @param params 검색 조건
 * @returns 차량-세대 관계 목록과 페이지 정보 (CarHouseholdRelationsResponse)
 */
export async function searchCarHouseholdRelations(params: SearchCarHouseholdResidentRequest = {}) {
  // 쿼리 파라미터 처리
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/cars/household-relations?${queryString}` : '/cars/household-relations';
  
  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량-세대 관계 조회 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - CarHouseholdRelationsResponse 타입
  };
}
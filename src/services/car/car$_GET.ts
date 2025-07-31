'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchCarRequest, CarListResponse } from '@/types/car';

/**
 * 차량 목록을 조회한다 (검색 포함)
 * @param params 검색 조건
 * @returns 차량 목록과 페이지 정보 (CarListResponse)
 */
export async function searchCar(params: SearchCarRequest = {}) {
  // 쿼리 파라미터 처리
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.carNumber) searchParams.append('car_number', params.carNumber);
  if (params.brand) searchParams.append('brand', params.brand);
  if (params.model) searchParams.append('model', params.model);
  if (params.type) searchParams.append('type', params.type);
  if (params.fuel) searchParams.append('fuel', params.fuel);
  if (params.yearFrom) searchParams.append('year_from', params.yearFrom.toString());
  if (params.yearTo) searchParams.append('year_to', params.yearTo.toString());
  if (params.inOutStatus) searchParams.append('in_out_status', params.inOutStatus);
  if (params.householdInstanceId) searchParams.append('household_instance_id', params.householdInstanceId.toString());
  if (params.residentId) searchParams.append('resident_id', params.residentId.toString());
  if (params.status) searchParams.append('status', params.status);

  const queryString = searchParams.toString();
  const url = queryString ? `/cars?${queryString}` : '/cars';
  
  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `차량 목록 조회 실패(코드): ${response.status}`;
    console.log(errorMsg); // 서버 출력 필수
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase) - CarListResponse 타입
  };
}
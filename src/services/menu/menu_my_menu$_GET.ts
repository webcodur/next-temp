'use client';
import { fetchDefault } from '@/services/fetchClient';

/**
 * 현재 로그인한 사용자의 권한과 주차장에 따라 접근 가능한 메뉴 목록을 계층 구조로 반환
 * 일반 관리자는 할당된 주차장 메뉴만, super_admin은 parkingLotId로 주차장 선택 가능
 * @param parkinglotId 조회할 주차장 ID (super_admin만 사용 가능, 미지정 시 첫 번째 주차장)
 * @returns MenuListResponseDto - 메뉴 목록, 사용자 역할, 주차장 정보 등
 */
export async function getMyMenuList(parkinglotId?: number) {
  const params = new URLSearchParams();
  if (parkinglotId) {
    params.append('parkinglotId', parkinglotId.toString());
  }

  const queryString = params.toString();
  const url = `/menus/my-menus${queryString ? `?${queryString}` : ''}`;

  const response = await fetchDefault(url, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `내 권한 메뉴 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: result,
  };
} 
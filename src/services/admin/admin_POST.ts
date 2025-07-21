'use server';
import { fetchDefault } from '../fetchClient';
import { CreateAdminRequest } from '@/types/admin';

/**
 * 새로운 관리자 계정을 생성한다 (CreateAdminDto 기준)
 * @param account 계정명
 * @param password 비밀번호
 * @param name 이름
 * @param roleId 역할 ID
 * @param email 이메일 (선택)
 * @param phone 연락처 (선택)
 * @param parkinglotId 담당 주차장 ID (선택)
 * @returns 생성된 관리자 정보
 */
export async function createAdmin(data: CreateAdminRequest) {
  const {
    account,
    password,
    name,
    roleId,
    email,
    phone,
    parkinglotId
  } = data;
  const response = await fetchDefault('/admins', {
    method: 'POST',
    body: JSON.stringify({
      account,
      password,
      name,
      roleId,
      email,
      phone,
      parkinglotId
    }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 계정 생성 실패(코드): ${response.status}`
    console.log(errorMsg)
    return {
      success: false,
      errorMsg: errorMsg,
    }
  }
  
  return {
    success: true,
    data: result,
  }
} 
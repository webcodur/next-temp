'use server';

import { fetchDefault } from '../fetchClient';

/**
 * 관리자 생성
 * @param account 관리자 계정명
 * @param role_id 관리자 역할 ID
 * @param name 관리자 이름
 * @param email 이메일 주소
 * @param password 비밀번호
 * @param phone 전화번호
 * @returns 생성된 관리자 정보
 */
export async function createAdmin({
  account,
  role_id,
  name,
  email,
  password,
  phone
}: {
  account: string;
  role_id: number;
  name?: string;
  email?: string;
  password: string;
  phone?: string;
}) {
  const response = await fetchDefault('/admins', {
    method: 'POST',
    body: JSON.stringify({
      account,
      role_id,
      name,
      email,
      password,
      phone
    }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 생성 실패(코드): ${response.status}`
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
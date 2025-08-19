/**
 * IP 주소 유효성 검사 함수들
 */

import type { IPType } from '../types';

// #region IPv4 검증
/**
 * IPv4 주소 유효성 검사
 */
export const isValidIPv4 = (ip: string): boolean => {
  if (!ip || typeof ip !== 'string') {
    return false;
  }

  const parts = ip.split('.');
  if (parts.length !== 4) {
    return false;
  }

  return parts.every(part => {
    // 숫자가 아닌 경우
    if (!/^\d+$/.test(part)) {
      return false;
    }

    const num = parseInt(part, 10);
    
    // 0-255 범위를 벗어난 경우
    if (num < 0 || num > 255) {
      return false;
    }

    // 앞자리가 0으로 시작하는 경우 (010, 001 등) - 단, '0'은 허용
    if (part.length > 1 && part[0] === '0') {
      return false;
    }

    return true;
  });
};
// #endregion

// #region IPv6 검증
/**
 * IPv6 주소 유효성 검사 (간단한 형태)
 */
export const isValidIPv6 = (ip: string): boolean => {
  if (!ip || typeof ip !== 'string') {
    return false;
  }

  // IPv6는 복잡하므로 기본적인 패턴만 검사
  const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  return ipv6Pattern.test(ip);
};
// #endregion

// #region 통합 IP 검증
/**
 * IP 주소 유효성 검사 (IPv4 또는 IPv6)
 */
export const isValidIP = (ip: string): boolean => {
  if (!ip || typeof ip !== 'string') {
    return false;
  }

  // 공백 제거
  const trimmedIP = ip.trim();
  
  return isValidIPv4(trimmedIP) || isValidIPv6(trimmedIP);
};
// #endregion

// #region IP 분류
/**
 * 사설 IP 주소 여부 확인
 */
export const isPrivateIP = (ip: string): boolean => {
  if (!isValidIPv4(ip)) {
    return false;
  }

  const parts = ip.split('.').map(part => parseInt(part, 10));
  const [first, second] = parts;

  // 10.0.0.0/8 (10.0.0.0 ~ 10.255.255.255)
  if (first === 10) {
    return true;
  }

  // 172.16.0.0/12 (172.16.0.0 ~ 172.31.255.255)
  if (first === 172 && second >= 16 && second <= 31) {
    return true;
  }

  // 192.168.0.0/16 (192.168.0.0 ~ 192.168.255.255)
  if (first === 192 && second === 168) {
    return true;
  }

  return false;
};

/**
 * 로컬호스트 IP 주소 여부 확인
 */
export const isLocalhostIP = (ip: string): boolean => {
  if (!ip || typeof ip !== 'string') {
    return false;
  }

  const trimmedIP = ip.trim();
  
  // IPv4 localhost
  if (trimmedIP === '127.0.0.1' || trimmedIP.startsWith('127.')) {
    return true;
  }

  // IPv6 localhost
  if (trimmedIP === '::1' || trimmedIP === '::') {
    return true;
  }

  return false;
};

/**
 * IP 주소 유형 반환
 */
export const getIPType = (ip: string): IPType => {
  if (!isValidIP(ip)) {
    return 'invalid';
  }

  if (isLocalhostIP(ip)) {
    return 'localhost';
  }

  if (isPrivateIP(ip)) {
    return 'private';
  }

  return 'public';
};
// #endregion

// #region 검증 with 메시지
/**
 * IP 주소 유효성 검사 with 에러 메시지
 */
export const validateIP = (ip: string): { isValid: boolean; message?: string } => {
  if (!ip || typeof ip !== 'string') {
    return { isValid: false, message: 'IP 주소를 입력해주세요.' };
  }

  const trimmedIP = ip.trim();
  
  if (!trimmedIP) {
    return { isValid: false, message: 'IP 주소를 입력해주세요.' };
  }

  if (!isValidIP(trimmedIP)) {
    return { isValid: false, message: '올바른 IP 주소 형식이 아닙니다.' };
  }

  return { isValid: true };
};
// #endregion

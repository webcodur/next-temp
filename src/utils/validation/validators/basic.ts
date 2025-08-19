/**
 * 기본 유효성 검사 함수들
 */

import { isValidIP } from './ip';
import { isValidPort } from './port';

// #region 기본 검증 함수들
/**
 * 필수 입력 검사
 */
export const required = (value: string): boolean => {
  return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * 이메일 형식 검사
 */
export const email = (value: string): boolean => {
  if (!value) return true; // 빈 값은 required 규칙에서 따로 처리
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

/**
 * 한국 휴대폰 번호 형식 검사
 */
export const phone = (value: string): boolean => {
  if (!value) return true;
  return /^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/.test(value.replace(/-/g, ''));
};

/**
 * 비밀번호 강도 검사 (8자 이상)
 */
export const password = (value: string): boolean => {
  if (!value) return true;
  return value.length >= 8;
};

/**
 * 비밀번호 확인 검사
 */
export const passwordConfirm = (value: string, originalPassword: string): boolean => {
  return value === originalPassword;
};

/**
 * IP 주소 형식 검사
 */
export const ip = (value: string): boolean => {
  if (!value) return true;
  return isValidIP(value);
};

/**
 * 포트 번호 검사
 */
export const port = (value: string): boolean => {
  if (!value) return true;
  return isValidPort(value);
};

/**
 * 문자열 길이 검사
 */
export const length = (value: string, minLength = 0, maxLength = Infinity): boolean => {
  if (!value) return minLength === 0; // 빈 값 허용 여부는 minLength로 결정
  return value.length >= minLength && value.length <= maxLength;
};

/**
 * 숫자 형식 및 범위 검사
 */
export const number = (value: string, min = -Infinity, max = Infinity): boolean => {
  if (!value) return true;
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * 정수만 허용
 */
export const integer = (value: string): boolean => {
  if (!value) return true;
  return /^\d+$/.test(value);
};

/**
 * 차량번호 형식 검사 (한국 형식)
 */
export const carNumber = (value: string): boolean => {
  if (!value) return true;
  // 기본적인 한국 차량번호 패턴 (더 정교한 검사 필요시 확장 가능)
  return /^[가-힣0-9]{2,3}[가-힣]{1}[0-9]{4}$|^[0-9]{2,3}[가-힣]{1}[0-9]{4}$/.test(value.replace(/\s/g, ''));
};

/**
 * 자유 형식 (항상 유효 - SimpleInput 호환성)
 */
export const free = (): boolean => {
  return true; // 자유 형식은 항상 유효
};
// #endregion

/**
 * validators 통합 export 파일
 */

// 기본 검증 함수들
export * from './basic';

// IP 검증 함수들
export * from './ip';

// 포트 검증 함수들
export * from './port';

// 커스텀 검증 함수들
export * from './custom';

// 모든 검증 함수를 하나의 객체로 통합
import * as basicValidators from './basic';
import * as ipValidators from './ip';
import * as portValidators from './port';
import * as customValidators from './custom';

export const validators = {
  // 기본 검증
  required: basicValidators.required,
  email: basicValidators.email,
  phone: basicValidators.phone,
  password: basicValidators.password,
  passwordConfirm: basicValidators.passwordConfirm,
  length: basicValidators.length,
  number: basicValidators.number,
  integer: basicValidators.integer,
  carNumber: basicValidators.carNumber,
  free: basicValidators.free,
  
  // IP/포트 검증
  ip: basicValidators.ip,
  port: basicValidators.port,
  
  // 커스텀 검증
  custom: customValidators.custom
};

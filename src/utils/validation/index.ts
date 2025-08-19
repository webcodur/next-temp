/**
 * validation 시스템 메인 export 파일
 */

// #region 타입 정의
export * from './types';
// #endregion

// #region 검증 함수들
export * from './validators';
// #endregion

// #region 메시지
export * from './messages';
// #endregion

// #region 필드 검증
export * from './field';
// #endregion

// #region 폼 검증
export * from './form';
// #endregion

// #region 규칙 생성
export * from './rules';
// #endregion

// #region 편의성을 위한 재export
// 자주 사용되는 함수들을 직접 export
import { validateField } from './field';
import { validateForm } from './form';
import { validators } from './validators';
import { defaultMessages, successMessages } from './messages';
import { 
  createRequiredRule, 
  createLengthRule, 
  createNumberRule, 
  createCustomRule,
  getGridFormRulesProps 
} from './rules';

// IP 관련 함수들 (기존 호환성 유지)
import { 
  isValidIPv4, 
  isValidIPv6, 
  isValidIP, 
  isPrivateIP, 
  isLocalhostIP, 
  getIPType, 
  validateIP as validateIPAddress 
} from './validators/ip';

// 포트 관련 함수들 (기존 호환성 유지)
import { 
  isValidPort, 
  validatePort as validatePortNumber 
} from './validators/port';

export {
  // 주요 검증 함수들
  validateField,
  validateForm,
  validators,
  
  // 메시지
  defaultMessages,
  successMessages,
  
  // 규칙 생성
  createRequiredRule,
  createLengthRule,
  createNumberRule,
  createCustomRule,
  getGridFormRulesProps,
  
  // IP 관련 (기존 호환성)
  isValidIPv4,
  isValidIPv6,
  isValidIP,
  isPrivateIP,
  isLocalhostIP,
  getIPType,
  validateIPAddress as validateIP,
  
  // 포트 관련 (기존 호환성)
  isValidPort,
  validatePortNumber as validatePort
};
// #endregion

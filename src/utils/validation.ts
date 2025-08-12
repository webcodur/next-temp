/**
 * 전역 유효성 검사 유틸리티
 * 프로젝트 전체에서 사용되는 모든 유효성 검사 로직을 중앙 관리
 */

import { isValidIP, isValidPort } from '@/utils/ipValidation';

// #region 타입 정의
export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'password' | 'password-confirm' | 'ip' | 'port' | 'length' | 'number' | 'custom' | 'free';
  message?: string;
  // 길이 제한 (length 타입용)
  minLength?: number;
  maxLength?: number;
  // 숫자 범위 (number 타입용)
  min?: number;
  max?: number;
  // 비밀번호 확인용 원본 비밀번호
  originalPassword?: string;
  // 커스텀 검증 함수
  customValidator?: (value: string) => boolean;
  // GridForm 표시 옵션
  showIcon?: boolean;
  // 모드별 적용 여부 (SimpleInput 호환성)
  mode?: 'create' | 'edit' | 'view';
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  hasValue: boolean;
  status?: 'success' | 'error' | 'warning' | 'info';
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule | ValidationRule[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  hasErrors: boolean;
  fieldResults: Record<string, ValidationResult>;
}
// #endregion

// #region 기본 유효성 검사 함수들
export const validators = {
  /**
   * 필수 입력 검사
   */
  required: (value: string): boolean => {
    return value !== null && value !== undefined && value.trim() !== '';
  },

  /**
   * 이메일 형식 검사
   */
  email: (value: string): boolean => {
    if (!value) return true; // 빈 값은 required 규칙에서 따로 처리
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },

  /**
   * 한국 휴대폰 번호 형식 검사
   */
  phone: (value: string): boolean => {
    if (!value) return true;
    return /^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/.test(value.replace(/-/g, ''));
  },

  /**
   * 비밀번호 강도 검사 (8자 이상)
   */
  password: (value: string): boolean => {
    if (!value) return true;
    return value.length >= 8;
  },

  /**
   * 비밀번호 확인 검사
   */
  passwordConfirm: (value: string, originalPassword: string): boolean => {
    return value === originalPassword;
  },

  /**
   * IP 주소 형식 검사
   */
  ip: (value: string): boolean => {
    if (!value) return true;
    return isValidIP(value);
  },

  /**
   * 포트 번호 검사
   */
  port: (value: string): boolean => {
    if (!value) return true;
    return isValidPort(value);
  },

  /**
   * 문자열 길이 검사
   */
  length: (value: string, minLength = 0, maxLength = Infinity): boolean => {
    if (!value) return minLength === 0; // 빈 값 허용 여부는 minLength로 결정
    return value.length >= minLength && value.length <= maxLength;
  },

  /**
   * 숫자 형식 및 범위 검사
   */
  number: (value: string, min = -Infinity, max = Infinity): boolean => {
    if (!value) return true;
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  },

  /**
   * 정수만 허용
   */
  integer: (value: string): boolean => {
    if (!value) return true;
    return /^\d+$/.test(value);
  },

  /**
   * 차량번호 형식 검사 (한국 형식)
   */
  carNumber: (value: string): boolean => {
    if (!value) return true;
    // 기본적인 한국 차량번호 패턴 (더 정교한 검사 필요시 확장 가능)
    return /^[가-힣0-9]{2,3}[가-힣]{1}[0-9]{4}$|^[0-9]{2,3}[가-힣]{1}[0-9]{4}$/.test(value.replace(/\s/g, ''));
  },

  /**
   * 자유 형식 (항상 유효 - SimpleInput 호환성)
   */
  free: (): boolean => {
    return true; // 자유 형식은 항상 유효
  }
};
// #endregion

// #region 기본 메시지 정의
export const defaultMessages = {
  required: '필수 입력 항목입니다',
  email: '올바른 이메일 형식을 입력해주세요 (예: user@domain.com)',
  phone: '올바른 휴대폰 번호를 입력해주세요 (010-0000-0000)',
  password: '8자 이상 입력해주세요',
  'password-confirm': '비밀번호가 일치하지 않습니다',
  ip: '올바른 IP 주소를 입력해주세요 (예: 192.168.0.1)',
  port: '1-65535 범위의 포트 번호를 입력해주세요',
  length: '입력 길이가 올바르지 않습니다',
  number: '올바른 숫자를 입력해주세요',
  integer: '정수만 입력 가능합니다',
  carNumber: '올바른 차량번호를 입력해주세요',
  custom: '입력값이 올바르지 않습니다',
  free: '' // 자유 형식은 메시지 없음
};

export const successMessages = {
  required: '입력되었습니다',
  email: '올바른 이메일 형식입니다',
  phone: '올바른 휴대폰 번호입니다',
  password: '적절한 비밀번호입니다',
  'password-confirm': '비밀번호가 일치합니다',
  ip: '올바른 IP 주소입니다',
  port: '올바른 포트 번호입니다',
  length: '적절한 길이입니다',
  number: '올바른 숫자입니다',
  integer: '올바른 정수입니다',
  carNumber: '올바른 차량번호입니다',
  custom: '올바른 입력입니다',
  free: '' // 자유 형식은 메시지 없음
};
// #endregion

// #region 단일 필드 유효성 검사
/**
 * 단일 필드의 유효성을 검사하고 결과를 반환
 */
export const validateField = (
  value: string,
  rules: ValidationRule | ValidationRule[]
): ValidationResult => {
  const ruleArray = Array.isArray(rules) ? rules : [rules];
  const hasValue = value !== null && value !== undefined && value.trim() !== '';
  
  for (const rule of ruleArray) {
    let isValid = true;
    let message = rule.message || '';
    let status: ValidationResult['status'] = undefined;

    switch (rule.type) {
      case 'required':
        isValid = validators.required(value);
        message = message || defaultMessages.required;
        status = isValid ? 'success' : 'error';
        break;

      case 'email':
        isValid = validators.email(value);
        message = message || (isValid ? successMessages.email : defaultMessages.email);
        status = hasValue ? (isValid ? 'success' : 'error') : undefined;
        break;

      case 'phone':
        isValid = validators.phone(value);
        message = message || (isValid ? successMessages.phone : defaultMessages.phone);
        status = hasValue ? (isValid ? 'success' : 'error') : undefined;
        break;

      case 'password':
        isValid = validators.password(value);
        message = message || (isValid ? successMessages.password : defaultMessages.password);
        status = hasValue ? (isValid ? 'success' : 'error') : undefined;
        break;

      case 'password-confirm':
        isValid = validators.passwordConfirm(value, rule.originalPassword || '');
        message = message || (isValid ? successMessages['password-confirm'] : defaultMessages['password-confirm']);
        status = hasValue ? (isValid ? 'success' : 'error') : undefined;
        break;

      case 'ip':
        isValid = validators.ip(value);
        message = message || (isValid ? successMessages.ip : defaultMessages.ip);
        status = hasValue ? (isValid ? 'success' : 'error') : undefined;
        break;

      case 'port':
        isValid = validators.port(value);
        message = message || (isValid ? successMessages.port : defaultMessages.port);
        status = hasValue ? (isValid ? 'success' : 'error') : undefined;
        break;

      case 'length':
        isValid = validators.length(value, rule.minLength, rule.maxLength);
        if (!message) {
          if (rule.minLength && rule.maxLength) {
            message = isValid 
              ? successMessages.length 
              : `${rule.minLength}-${rule.maxLength}자 사이로 입력해주세요`;
          } else if (rule.minLength) {
            message = isValid 
              ? successMessages.length 
              : `최소 ${rule.minLength}자 이상 입력해주세요`;
          } else if (rule.maxLength) {
            message = isValid 
              ? successMessages.length 
              : `최대 ${rule.maxLength}자까지 입력 가능합니다`;
          } else {
            message = defaultMessages.length;
          }
        }
        status = hasValue ? (isValid ? 'success' : 'error') : undefined;
        break;

      case 'number':
        isValid = validators.number(value, rule.min, rule.max);
        if (!message) {
          if (rule.min !== undefined && rule.max !== undefined) {
            message = isValid 
              ? successMessages.number 
              : `${rule.min}-${rule.max} 범위의 숫자를 입력해주세요`;
          } else {
            message = isValid ? successMessages.number : defaultMessages.number;
          }
        }
        status = hasValue ? (isValid ? 'success' : 'error') : undefined;
        break;

      case 'custom':
        isValid = rule.customValidator ? rule.customValidator(value) : true;
        message = message || (isValid ? successMessages.custom : defaultMessages.custom);
        status = hasValue ? (isValid ? 'success' : 'error') : undefined;
        break;

      case 'free':
        isValid = validators.free();
        message = message || successMessages.free;
        status = undefined; // free 타입은 항상 status 없음
        break;

      default:
        console.warn(`Unknown validation type: ${rule.type}`);
        break;
    }

    // 첫 번째 실패한 규칙에서 중단
    if (!isValid) {
      return {
        isValid: false,
        message,
        hasValue,
        status: status || 'error'
      };
    }
  }

  // 모든 규칙 통과
  return {
    isValid: true,
    message: hasValue ? '올바른 형식입니다' : '',
    hasValue,
    status: hasValue ? 'success' : undefined
  };
};
// #endregion

// #region 전체 폼 유효성 검사
/**
 * 전체 폼의 유효성을 검사하고 결과를 반환
 */
export const validateForm = (
  formData: Record<string, string>,
  validationRules: FieldValidation
): FormValidationResult => {
  const errors: Record<string, string> = {};
  const fieldResults: Record<string, ValidationResult> = {};
  
  // 각 필드별 유효성 검사
  Object.keys(validationRules).forEach(fieldName => {
    const value = formData[fieldName] || '';
    const rules = validationRules[fieldName];
    const result = validateField(value, rules);
    
    fieldResults[fieldName] = result;
    
    if (!result.isValid) {
      errors[fieldName] = result.message;
    }
  });

  const hasErrors = Object.keys(errors).length > 0;
  
  return {
    isValid: !hasErrors,
    errors,
    hasErrors,
    fieldResults
  };
};
// #endregion

// #region 유틸리티 함수들
/**
 * GridForm.Rules에서 사용할 수 있는 props를 생성
 * 메시지는 Rules 컬럼의 아이콘 hover tooltip으로만 표시
 */
export const getGridFormRulesProps = (
  result: ValidationResult,
  ruleText?: string
) => {
  return {
    validationStatus: result.status,
    validationMessage: result.message, // Rules 컬럼 아이콘의 tooltip용
    children: ruleText || ''
  };
};

/**
 * 일반적인 필수 필드 규칙 생성
 */
export const createRequiredRule = (message?: string): ValidationRule => ({
  type: 'required',
  message
});

/**
 * 길이 제한 규칙 생성
 */
export const createLengthRule = (
  minLength?: number, 
  maxLength?: number, 
  message?: string
): ValidationRule => ({
  type: 'length',
  minLength,
  maxLength,
  message
});

/**
 * 숫자 범위 규칙 생성
 */
export const createNumberRule = (
  min?: number, 
  max?: number, 
  message?: string
): ValidationRule => ({
  type: 'number',
  min,
  max,
  message
});

/**
 * 커스텀 유효성 검사 규칙 생성
 */
export const createCustomRule = (
  validator: (value: string) => boolean,
  message?: string
): ValidationRule => ({
  type: 'custom',
  customValidator: validator,
  message
});
// #endregion

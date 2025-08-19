/**
 * 단일 필드 유효성 검사
 */

import type { ValidationRule, ValidationResult } from './types';
import { validators } from './validators';
import { defaultMessages, successMessages } from './messages';

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

    // required 속성이 true면 먼저 required 체크
    if (rule.required && !hasValue) {
      return {
        isValid: false,
        message: '필수 입력 항목입니다',
        hasValue,
        status: 'error'
      };
    }

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
        isValid = validators.custom(value, rule.customValidator);
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

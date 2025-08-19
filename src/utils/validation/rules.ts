/**
 * 유효성 검사 규칙 생성 유틸리티
 */

import type { ValidationRule, ValidationResult } from './types';

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

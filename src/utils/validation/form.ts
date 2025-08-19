/**
 * 전체 폼 유효성 검사
 */

import type { FieldValidation, FormValidationResult, ValidationResult } from './types';
import { validateField } from './field';

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

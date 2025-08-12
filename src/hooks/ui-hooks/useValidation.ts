/**
 * 폼 유효성 검사를 위한 React Hook
 */

import { useState, useCallback, useMemo } from 'react';
import { 
  validateField, 
  validateForm, 
  ValidationRule, 
  ValidationResult, 
  FieldValidation, 
  FormValidationResult 
} from '@/utils/validation';

// #region 타입 정의
export interface UseValidationOptions {
  validateOnChange?: boolean; // 값 변경시 즉시 검증 여부
  validateOnBlur?: boolean;   // 포커스 아웃시 검증 여부
}

export interface UseValidationReturn {
  // 전체 폼 상태
  isValid: boolean;
  hasErrors: boolean;
  errors: Record<string, string>;
  
  // 필드별 유효성 검사 결과
  fieldResults: Record<string, ValidationResult>;
  
  // 액션 함수들
  validateField: (fieldName: string, value: string) => ValidationResult;
  validateForm: (formData: Record<string, string>) => FormValidationResult;
  clearErrors: () => void;
  clearFieldError: (fieldName: string) => void;
  setFieldError: (fieldName: string, message: string) => void;
  
  // GridForm.Rules용 헬퍼
  getFieldRulesProps: (fieldName: string, ruleText?: string) => {
    validationStatus?: 'success' | 'error' | 'warning' | 'info';
    validationMessage?: string;
    children: string;
  };
}
// #endregion

// #region useValidation Hook
export const useValidation = (
  validationRules: FieldValidation,
): UseValidationReturn => {
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fieldResults, setFieldResults] = useState<Record<string, ValidationResult>>({});
  
  // 전체 폼 유효성 상태 계산
  const { isValid, hasErrors } = useMemo(() => {
    const errorCount = Object.keys(errors).length;
    return {
      isValid: errorCount === 0,
      hasErrors: errorCount > 0
    };
  }, [errors]);

  // 단일 필드 유효성 검사
  const validateSingleField = useCallback((fieldName: string, value: string): ValidationResult => {
    const rules = validationRules[fieldName];
    if (!rules) {
      return {
        isValid: true,
        message: '',
        hasValue: !!value,
        status: undefined
      };
    }

    const result = validateField(value, rules);
    
    // 결과 상태 업데이트
    setFieldResults(prev => ({
      ...prev,
      [fieldName]: result
    }));
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (!result.isValid) {
        newErrors[fieldName] = result.message;
      } else {
        delete newErrors[fieldName];
      }
      return newErrors;
    });
    
    return result;
  }, [validationRules]);

  // 전체 폼 유효성 검사
  const validateEntireForm = useCallback((formData: Record<string, string>): FormValidationResult => {
    const result = validateForm(formData, validationRules);
    
    setErrors(result.errors);
    setFieldResults(result.fieldResults);
    
    return result;
  }, [validationRules]);

  // 에러 초기화
  const clearErrors = useCallback(() => {
    setErrors({});
    setFieldResults({});
  }, []);

  // 특정 필드 에러 초기화
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    
    setFieldResults(prev => {
      const newResults = { ...prev };
      delete newResults[fieldName];
      return newResults;
    });
  }, []);

  // 특정 필드 에러 설정 (서버 에러 등)
  const setFieldError = useCallback((fieldName: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: message
    }));
    
    setFieldResults(prev => ({
      ...prev,
      [fieldName]: {
        isValid: false,
        message,
        hasValue: true,
        status: 'error'
      }
    }));
  }, []);

  // GridForm.Rules용 props 생성
  const getFieldRulesProps = useCallback((fieldName: string, ruleText = '') => {
    const result = fieldResults[fieldName];
    
    if (!result) {
      return {
        validationStatus: undefined,
        validationMessage: undefined,
        children: ruleText
      };
    }
    
    return {
      validationStatus: result.status,
      validationMessage: result.message,
      children: ruleText
    };
  }, [fieldResults]);

  return {
    isValid,
    hasErrors,
    errors,
    fieldResults,
    validateField: validateSingleField,
    validateForm: validateEntireForm,
    clearErrors,
    clearFieldError,
    setFieldError,
    getFieldRulesProps
  };
};
// #endregion

// #region 편의 Hook들
/**
 * 간단한 필드 유효성 검사용 Hook
 */
export const useFieldValidation = (
  fieldName: string,
  rules: ValidationRule | ValidationRule[]
) => {
  const [result, setResult] = useState<ValidationResult>({
    isValid: true,
    message: '',
    hasValue: false,
    status: undefined
  });

  const validate = useCallback((value: string) => {
    const validationResult = validateField(value, rules);
    setResult(validationResult);
    return validationResult;
  }, [rules]);

  const clear = useCallback(() => {
    setResult({
      isValid: true,
      message: '',
      hasValue: false,
      status: undefined
    });
  }, []);

  return {
    result,
    validate,
    clear,
    isValid: result.isValid,
    message: result.message,
    status: result.status
  };
};

/**
 * 실시간 유효성 검사용 Hook (입력값 변경시마다 검사)
 */
export const useRealtimeValidation = (
  initialValue: string,
  rules: ValidationRule | ValidationRule[]
) => {
  const [value, setValue] = useState(initialValue);
  const { result, validate } = useFieldValidation('field', rules);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    validate(newValue);
  }, [validate]);

  // 초기값 검증
  useMemo(() => {
    if (initialValue) {
      validate(initialValue);
    }
  }, [initialValue, validate]);

  return {
    value,
    setValue: handleChange,
    result,
    isValid: result.isValid,
    message: result.message,
    status: result.status
  };
};
// #endregion

/**
 * validation 시스템 타입 정의
 */

// #region 기본 타입
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
  // 필수 입력 여부 (type과 별개로)
  required?: boolean;
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

// #region IP 검증 관련 타입
export interface IPValidationResult {
  isValid: boolean;
  message?: string;
}

export type IPType = 'public' | 'private' | 'localhost' | 'invalid';
// #endregion

// #region 포트 검증 관련 타입
export interface PortValidationResult {
  isValid: boolean;
  message?: string;
}
// #endregion

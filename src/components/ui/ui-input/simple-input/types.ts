export interface ValidationRule {
  type: 'email' | 'phone' | 'password' | 'password-confirm' | 'free';
  message?: string;
  mode?: 'create' | 'edit' | 'view';
  showIcon?: boolean;
  // 비밀번호 확인용 원본 비밀번호 (password-confirm 타입에서만 사용)
  originalPassword?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  hasValue: boolean;
}

// 내장 validation 함수들
export const validators = {
  email: (value: string): boolean => {
    if (!value) return true; // 빈 값은 유효한 것으로 처리 (선택사항)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  
  phone: (value: string): boolean => {
    if (!value) return true; // 빈 값은 유효한 것으로 처리 (선택사항)
    return /^(010|011|016|017|018|019)-?\d{3,4}-?\d{4}$/.test(value.replace(/-/g, ''));
  },
  
  password: (value: string): boolean => {
    return value.length >= 8;
  },
  
  passwordConfirm: (value: string, originalPassword: string): boolean => {
    return value === originalPassword;
  },
  
  free: (): boolean => {
    return true; // 자유 형식은 항상 유효
  }
};

// 기본 메시지들
export const defaultMessages = {
  email: '이메일 형식 (예: user@domain.com)',
  phone: '휴대폰 번호 형식 (010-0000-0000)',
  password: '8자 이상 영문/숫자/특수문자 포함',
  'password-confirm': '위 비밀번호와 동일하게 입력',
  free: '자유 형식'
};

// validation 결과 계산 함수
export const getValidationResult = (
  value: string,
  rule: ValidationRule
): ValidationResult => {
  const hasValue = !!value;
  let isValid = true;
  
  if (hasValue) {
    switch (rule.type) {
      case 'email':
        isValid = validators.email(value);
        break;
      case 'phone':
        isValid = validators.phone(value);
        break;
      case 'password':
        isValid = validators.password(value);
        break;
      case 'password-confirm':
        isValid = validators.passwordConfirm(value, rule.originalPassword || '');
        break;
      case 'free':
        isValid = validators.free();
        break;
    }
  }
  
  const message = rule.message || defaultMessages[rule.type];
  
  return {
    isValid,
    message: `입력 규칙: ${message}`,
    hasValue
  };
}; 
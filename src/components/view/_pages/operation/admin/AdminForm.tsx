'use client';

import React from 'react';
import { RotateCcw, Save } from 'lucide-react'; // Trash2 아이콘은 CrudButton에서 처리
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { Admin, ROLE_ID_MAP } from '@/types/admin';
import { ValidationRule } from '@/utils/validation';

export interface AdminFormData {
  account: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirm: string;
}

interface AdminFormProps {
  mode: 'create' | 'edit' | 'view';
  admin?: Admin | null;
  data: AdminFormData;
  onChange: (data: AdminFormData) => void;
  disabled?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  hasChanges?: boolean;
  isValid?: boolean;
}

// ROLE_ID_MAP을 기반으로 동적 생성하여 일관성 보장
const ROLE_OPTIONS = Object.keys(ROLE_ID_MAP).map(roleName => ({
  value: roleName,
  label: roleName
}));

const AdminForm: React.FC<AdminFormProps> = ({
  mode,
  admin,
  data,
  onChange,
  disabled = false,
  showActions = false,
  onReset,
  onSubmit,
  onDelete,
  hasChanges = false,
  isValid = false,
}) => {
  const isReadOnly = disabled || mode === 'view';
  const showPassword = mode === 'create'; // create 모드에서만 비밀번호 필드 표시
  const passwordRequired = mode === 'create';

  const handleFieldChange = (field: keyof AdminFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // 필드별 유효성 규칙 생성 함수
  const getValidationRule = (fieldType: 'account' | 'name' | 'email' | 'phone' | 'dropdown' | 'password' | 'passwordConfirm' | 'date' | 'readonly', required = false, originalPassword?: string): ValidationRule => {
    let validationType: ValidationRule['type'] = 'free';
    
    switch (fieldType) {
      case 'account':
        validationType = 'id';
        break;
      case 'name':
        validationType = 'name';
        break;
      case 'email':
        validationType = 'email';
        break;
      case 'phone':
        validationType = 'phone';
        break;
      case 'password':
        validationType = 'password';
        break;
      case 'passwordConfirm':
        validationType = 'password-confirm';
        break;
      case 'dropdown':
      case 'readonly':
        validationType = 'free';
        break;
      case 'date':
        validationType = 'date';
        break;
    }
    
    const result: ValidationRule = { 
      type: validationType, 
      mode, 
      required,
      ...(originalPassword && { originalPassword })
    };
    return result;
  };

  // 액션 버튼들 정의 - 가이드에 따라 유틸(start) / 액션(end) 분리
  const topRightActions = null; // 상단에는 버튼 배치하지 않음

  // 유틸 버튼 (start 사이드) - 초기화/복구
  const resetButtonText = mode === 'create' ? '초기화' : '복구';
  const resetButtonTitle = mode === 'create' 
    ? (!hasChanges ? '변경사항이 없습니다' : '입력 내용 초기화') 
    : (!hasChanges ? '변경사항이 없습니다' : '변경사항 되돌리기');
    
  const bottomLeftActions = showActions ? (
    <Button 
      variant="secondary" 
      size="default"
      onClick={onReset} 
      disabled={!hasChanges || disabled}
      title={resetButtonTitle}
    >
      <RotateCcw size={16} />
      {resetButtonText}
    </Button>
  ) : null;

  // 액션 버튼 (end 사이드) - 삭제, 저장
  const bottomRightActions = showActions ? (
    <div className="flex gap-3">
      {onDelete && (
        <CrudButton 
          action="delete"
          size="default"
          onClick={onDelete}
          disabled={disabled}
          title="관리자 삭제"
        />
      )}
      <Button 
        variant="primary" 
        size="default"
        onClick={onSubmit} 
        disabled={!isValid || disabled}
        title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '변경사항 저장'}
      >
        <Save size={16} />
        저장
      </Button>
    </div>
  ) : null;

  // 기본 필드 정의
  const baseFields: GridFormFieldSchema[] = [
    {
      id: 'account',
      label: '아이디',
      required: mode === 'create',
      rules: '영문, 숫자 4-20자',
      align: 'start',
      component: (
        <SimpleTextInput
          value={data.account}
          onChange={(value) => handleFieldChange('account', value)}
          placeholder="계정명"
          disabled={disabled || mode !== 'create'}
          autocomplete="off"
          validationRule={getValidationRule('account', mode === 'create')}
        />
      )
    },
    {
      id: 'name',
      label: '이름',
      required: true,
      rules: '한글, 영문 2-50자',
      align: 'start',
      component: (
        <SimpleTextInput
          value={data.name}
          onChange={(value) => handleFieldChange('name', value)}
          placeholder="이름"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('name', true)}
        />
      )
    },
    {
      id: 'email',
      label: '이메일',
      rules: '유효한 이메일 형식',
      align: 'start',
      component: (
        <SimpleTextInput
          type="email"
          value={data.email}
          onChange={(value) => handleFieldChange('email', value)}
          placeholder="이메일"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('email', false)}
        />
      )
    },
    {
      id: 'phone',
      label: '연락처',
      rules: '010-0000-0000 형식',
      align: 'start',
      component: (
        <SimpleTextInput
          value={data.phone}
          onChange={(value) => handleFieldChange('phone', value)}
          placeholder="010-0000-0000"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('phone', false)}
        />
      )
    },
    {
      id: 'role',
      label: '권한',
      required: true,
      rules: '역할 및 권한 설정',
      align: 'start',
      component: (
        <SimpleDropdown
          value={data.role}
          onChange={(value) => handleFieldChange('role', value)}
          options={ROLE_OPTIONS}
          placeholder="권한을 선택하세요"
          disabled={isReadOnly}
          validationRule={getValidationRule('dropdown', true)}
        />
      )
    }
  ];

  // 비밀번호 필드 (create 모드에서만)
  const passwordFields: GridFormFieldSchema[] = showPassword ? [
    {
      id: 'password',
      label: '비밀번호',
      required: passwordRequired,
      rules: '8자 이상 영문/숫자/특수문자',
      align: 'start',
      component: (
        <SimpleTextInput
          type="password"
          value={data.password}
          onChange={(value) => handleFieldChange('password', value)}
          placeholder="비밀번호"
          disabled={disabled}
          autocomplete="new-password"
          validationRule={getValidationRule('password', passwordRequired)}
        />
      )
    },
    {
      id: 'confirm',
      label: '비밀번호 확인',
      required: passwordRequired,
      rules: '위와 동일한 비밀번호',
      align: 'start',
      component: (
        <SimpleTextInput
          type="password"
          value={data.confirm}
          onChange={(value) => handleFieldChange('confirm', value)}
          placeholder="비밀번호 확인"
          disabled={disabled}
          autocomplete="new-password"
          validationRule={getValidationRule('passwordConfirm', passwordRequired, data.password)}
        />
      )
    }
  ] : [];

  // 추가 정보 필드 (view/edit 모드에서만)
  const additionalFields: GridFormFieldSchema[] = mode !== 'create' ? [
    {
      id: 'parkinglot',
      label: '주차장',
      rules: '시스템 자동 연결',
      align: 'start',
      component: (
        <SimpleTextInput
          value={admin?.parkinglot?.name || '-'}
          onChange={() => {}}
          disabled={true}
          validationRule={getValidationRule('readonly', false)}
        />
      )
    },
    {
      id: 'createdAt',
      label: '등록일자',
      rules: '시스템 자동 기록',
      align: 'start',
      component: (
        <SimpleDatePicker
          value={admin?.createdAt || null}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
          validationRule={getValidationRule('readonly', false)}
        />
      )
    }
  ] : [];

  const fields = [...baseFields, ...passwordFields, ...additionalFields];

  return (
    <GridFormAuto 
      fields={fields}
      gap="16px"
      topRightActions={topRightActions}
      bottomLeftActions={bottomLeftActions}
      bottomRightActions={bottomRightActions}
    />
  );
};

export default AdminForm; 
'use client';

import React from 'react';
import { Eraser, RotateCcw, Building } from 'lucide-react';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import { SimpleAddressInput } from '@/components/ui/ui-input/simple-input/SimpleAddressInput';
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { InstanceDetail, ENUM_InstanceType } from '@/types/instance';
import { ValidationRule } from '@/utils/validation';

export interface InstanceFormData {
  name: string;
  ownerName: string;
  address1Depth: string;
  address2Depth: string;
  address3Depth: string;
  instanceType: ENUM_InstanceType | '';
  password: string;
  memo: string;
}

interface InstanceFormProps {
  mode: 'create' | 'edit';
  instance?: InstanceDetail | null;
  data: InstanceFormData;
  onChange: (data: InstanceFormData) => void;
  disabled?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  hasChanges?: boolean;
  isValid?: boolean;
}

const INSTANCE_TYPE_OPTIONS = [
  { value: 'GENERAL', label: '일반' },
  { value: 'TEMP', label: '임시' },
  { value: 'COMMERCIAL', label: '상업' },
];

const InstanceForm: React.FC<InstanceFormProps> = ({
  mode,
  instance,
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
  const isReadOnly = disabled;

  const handleFieldChange = (field: keyof InstanceFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // 필드별 유효성 규칙 생성 함수
  const getValidationRule = (fieldType: 'name' | 'owner' | 'address' | 'dropdown' | 'password' | 'text' | 'date' | 'readonly', required = false): ValidationRule => {
    let validationType: ValidationRule['type'] = 'free';
    
    switch (fieldType) {
      case 'name':
      case 'owner':
        validationType = 'custom';
        break;
      case 'address':
        validationType = 'free';
        break;
      case 'password':
        validationType = 'password';
        break;
      case 'dropdown':
      case 'text':
      case 'readonly':
      case 'date':
        validationType = 'free';
        break;
    }
    
    const result: ValidationRule = { type: validationType, mode, required };
    return result;
  };

  // 유틸/액션 버튼 구성
  const handleClearAllFields = () => {
    onChange({
      name: '',
      ownerName: '',
      address1Depth: '',
      address2Depth: '',
      address3Depth: '',
      instanceType: '',
      password: '',
      memo: '',
    });
  };

  const bottomLeftActions = showActions
    ? (
      mode === 'create'
        ? (
          <Button
            variant="outline"
            size="default"
            onClick={handleClearAllFields}
            disabled={disabled}
            title="모든 입력 필드를 비웁니다"
            icon={Eraser}
          >
            초기화
          </Button>
        )
        : mode === 'edit'
          ? (
            <Button
              variant="secondary"
              size="default"
              onClick={onReset}
              disabled={!hasChanges || disabled}
              title={!hasChanges ? '변경사항이 없습니다' : '폼 로딩 시점의 값으로 복구합니다'}
              icon={RotateCcw}
            >
              복구
            </Button>
          )
          : null
    )
    : null;

  const bottomRightActions = showActions
    ? (
      mode === 'create'
        ? (
          <CrudButton
            action="save"
            size="default"
            onClick={onSubmit}
            disabled={!isValid || disabled}
            title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '저장'}
          />
        )
        : mode === 'edit'
          ? (
            <div className="flex gap-3">
              {onDelete && (
                <CrudButton
                  action="delete"
                  size="default"
                  onClick={onDelete}
                  disabled={disabled}
                  title="상세 항목을 삭제합니다"
                />
              )}
              <CrudButton
                action="save"
                size="default"
                onClick={onSubmit}
                disabled={!isValid || disabled}
                title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '저장'}
              />
            </div>
          )
          : null
    )
    : null;

  // 폼 필드 정의
  const baseFields: GridFormFieldSchema[] = [
    {
      id: 'name',
      label: '세대 이름',
      required: true,
      rules: '세대 식별명 (예: A101)',
      component: (
        <SimpleTextInput
          value={data.name}
          onChange={(value) => handleFieldChange('name', value)}
          placeholder="세대 이름"
          disabled={isReadOnly}
          validationRule={getValidationRule('name', true)}
        />
      )
    },
    {
      id: 'ownerName',
      label: '소유자',
      rules: '한글, 영문 2-50자',
      component: (
        <SimpleTextInput
          value={data.ownerName}
          onChange={(value) => handleFieldChange('ownerName', value)}
          placeholder="소유자"
          disabled={isReadOnly}
          validationRule={getValidationRule('owner', false)}
        />
      )
    },
    {
      id: 'address1Depth',
      label: '동 정보',
      required: true,
      rules: '동 정보',
      component: (
        <SimpleTextInput
          value={data.address1Depth}
          onChange={(value) => handleFieldChange('address1Depth', value)}
          placeholder="동 정보"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('address', true)}
        />
      )
    },
    {
      id: 'address2Depth',
      label: '호수 정보',
      required: true,
      rules: '호수 정보',
      component: (
        <SimpleTextInput
          value={data.address2Depth}
          onChange={(value) => handleFieldChange('address2Depth', value)}
          placeholder="호수 정보"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('address', true)}
        />
      )
    },
    {
      id: 'address3Depth',
      label: '기타 주소 정보',
      rules: '기타 주소 정보',
      component: (
        <SimpleAddressInput
          value={data.address3Depth}
          onChange={(value) => handleFieldChange('address3Depth', value)}
          placeholder="기타 주소 정보"
          disabled={isReadOnly}
          validationRule={getValidationRule('address', false)}
        />
      )
    },

    {
      id: 'instanceType',
      label: '세대 타입',
      required: true,
      rules: '일반/임시/상업 선택',
      component: (
        <SimpleDropdown
          value={data.instanceType}
          onChange={(value) => handleFieldChange('instanceType', value)}
          options={INSTANCE_TYPE_OPTIONS}
          placeholder="타입을 선택하세요"
          disabled={isReadOnly}
          validationRule={getValidationRule('dropdown', true)}
        />
      )
    },
    {
      id: 'password',
      label: '비밀번호',
      required: true,
      rules: '4자리 이상 숫자/문자',
      component: (
        <SimpleTextInput
          type="password"
          value={data.password}
          onChange={(value) => handleFieldChange('password', value)}
          placeholder="세대 비밀번호"
          disabled={isReadOnly}
          autocomplete="new-password"
          validationRule={getValidationRule('password', true)}
        />
      )
    },
    {
      id: 'memo',
      label: '메모',
      rules: '자유 형식 텍스트',
      component: (
        <SimpleTextInput
          value={data.memo}
          onChange={(value) => handleFieldChange('memo', value)}
          placeholder="메모"
          disabled={isReadOnly}
          validationRule={getValidationRule('text', false)}
        />
      )
    }
  ];

  // edit 모드 전용 필드
  const editFields: GridFormFieldSchema[] = mode === 'edit' && instance ? [
    {
      id: 'parkinglotId',
      label: '주차장 ID',
      rules: '시스템 자동 연결',
      component: (
        <SimpleTextInput
          value={instance.parkinglotId?.toString() || '-'}
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
      component: (
        <SimpleDatePicker
          value={instance.createdAt}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
          validationRule={getValidationRule('readonly', false)}
        />
      )
    },
    {
      id: 'updatedAt',
      label: '수정일자',
      rules: '시스템 자동 기록',
      component: (
        <SimpleDatePicker
          value={instance.updatedAt}
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

  const fields = [...baseFields, ...editFields];

  return (
    <SectionPanel 
      title="세대 기본 정보"
      subtitle="세대의 기본 설정을 관리합니다."
      icon={<Building size={18} />}
    >
      <GridFormAuto 
        fields={fields}
        gap="16px"
        bottomLeftActions={bottomLeftActions}
        bottomRightActions={bottomRightActions}
      />
    </SectionPanel>
  );
};

export default InstanceForm;

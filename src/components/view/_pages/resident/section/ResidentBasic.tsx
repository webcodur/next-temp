'use client';

import React from 'react';
import { Eraser, RotateCcw } from 'lucide-react';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import TitleRow from '@/components/ui/ui-layout/title-row/TitleRow';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { ResidentDetail } from '@/types/resident';

export interface ResidentFormData {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: 'M' | 'F' | '';
  emergencyContact: string;
  memo: string;
}

interface ResidentFormProps {
  mode: 'create' | 'edit';
  resident?: ResidentDetail | null;
  data: ResidentFormData;
  onChange: (data: ResidentFormData) => void;
  disabled?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  hasChanges?: boolean;
  isValid?: boolean;
}

const GENDER_OPTIONS = [
  { value: 'M', label: '남성' },
  { value: 'F', label: '여성' },
];

const ResidentForm: React.FC<ResidentFormProps> = ({
  mode,
  resident,
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

  const handleFieldChange = (field: keyof ResidentFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // 유틸/액션 버튼 구성
  const handleClearAllFields = () => {
    onChange({
      name: '',
      phone: '',
      email: '',
      birthDate: '',
      gender: '',
      emergencyContact: '',
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
      label: '이름',
      required: true,
      rules: '한글, 영문 2-50자',
      component: (
        <SimpleTextInput
          value={data.name}
          onChange={(value) => handleFieldChange('name', value)}
          placeholder="이름"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'phone',
      label: '전화번호',
      rules: '010-0000-0000 형식',
      component: (
        <SimpleTextInput
          value={data.phone}
          onChange={(value) => handleFieldChange('phone', value)}
          placeholder="전화번호"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'email',
      label: '이메일',
      rules: '유효한 이메일 형식',
      component: (
        <SimpleTextInput
          type="email"
          value={data.email}
          onChange={(value) => handleFieldChange('email', value)}
          placeholder="이메일"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'birthDate',
      label: '생년월일',
      rules: 'YYYY-MM-DD 형식',
      component: (
        <SimpleDatePicker
          value={data.birthDate}
          onChange={(value) => handleFieldChange('birthDate', value || '')}
          disabled={isReadOnly}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
        />
      )
    },
    {
      id: 'gender',
      label: '성별',
      rules: '남성/여성 선택',
      component: (
        <SimpleDropdown
          value={data.gender}
          onChange={(value) => handleFieldChange('gender', value)}
          options={GENDER_OPTIONS}
          placeholder="성별을 선택하세요"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'emergencyContact',
      label: '비상연락처',
      rules: '010-0000-0000 형식',
      component: (
        <SimpleTextInput
          value={data.emergencyContact}
          onChange={(value) => handleFieldChange('emergencyContact', value)}
          placeholder="비상연락처"
          disabled={isReadOnly}
          validationRule={{ type: 'free', mode: mode }}
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
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    }
  ];

  // edit 모드 전용 필드
  const editFields: GridFormFieldSchema[] = mode === 'edit' && resident ? [
    {
      id: 'residentId',
      label: '거주자 ID',
      rules: '시스템 자동 생성',
      component: (
        <SimpleTextInput
          value={resident.id?.toString() || '-'}
          onChange={() => {}}
          disabled={true}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'createdAt',
      label: '등록일자',
      rules: '시스템 자동 기록',
      component: (
        <SimpleDatePicker
          value={resident.createdAt}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
        />
      )
    },
    {
      id: 'updatedAt',
      label: '수정일자',
      rules: '시스템 자동 기록',
      component: (
        <SimpleDatePicker
          value={resident.updatedAt}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd"
          showTimeSelect={false}
          utcMode={true}
        />
      )
    }
  ] : [];

  const fields = [...baseFields, ...editFields];

  return (
    <>
      <TitleRow title="거주자 기본 정보" subtitle="거주자의 개인 정보를 관리합니다." />
      <GridFormAuto 
        fields={fields}
        gap="16px"
        bottomLeftActions={bottomLeftActions}
        bottomRightActions={bottomRightActions}
      />
    </>
  );
};

export default ResidentForm;

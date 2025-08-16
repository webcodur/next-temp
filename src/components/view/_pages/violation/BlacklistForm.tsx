'use client';

import React from 'react';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { Button } from '@/components/ui/ui-input/button/Button';
import { RotateCcw, Save } from 'lucide-react';
import { BlacklistResponse } from '@/types/blacklist';

export interface BlacklistFormData {
  registrationReason: string;
  blockedUntil: Date | null;
  blockReason: string;
  unblockReason: string;
}

interface BlacklistFormProps {
  data: BlacklistFormData;
  onChange: (data: BlacklistFormData) => void;
  onFieldChange?: (field: keyof BlacklistFormData, value: string | Date | null) => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  isValid?: boolean;
  blacklist?: BlacklistResponse | null;
}

const REGISTRATION_REASON_OPTIONS = [
  { value: 'VIOLATION_ACCUMULATION', label: '위반 누적' },
  { value: 'SERIOUS_VIOLATION', label: '심각한 위반' },
  { value: 'REPEATED_OFFENDER', label: '상습 위반자' },
  { value: 'SECURITY_THREAT', label: '보안 위협' },
  { value: 'CIVIL_COMPLAINT', label: '민원' },
  { value: 'COURT_ORDER', label: '법원 명령' },
  { value: 'ADMIN_DISCRETION', label: '관리자 판단' },
  { value: 'OTHER', label: '기타' },
];

const BlacklistForm: React.FC<BlacklistFormProps> = ({
  data,
  onChange,
  onFieldChange,
  onCancel,
  onSubmit,
  isSubmitting = false,
  isValid = false,
  blacklist,
}) => {
  const handleChange = (field: keyof BlacklistFormData, value: string | Date | null) => {
    onFieldChange?.(field, value);
    onChange({
      ...data,
      [field]: value as never,
    });
  };

  const bottomRightActions = (
    <div className="flex gap-3">
      <Button variant="secondary" size="default" onClick={onCancel} disabled={isSubmitting}>
        <RotateCcw size={16} />
        취소
      </Button>
      <Button variant="primary" size="default" onClick={onSubmit} disabled={!isValid || isSubmitting}>
        <Save size={16} />
        저장
      </Button>
    </div>
  );

  // 읽기 전용 필드 (blacklist가 있을 때만)
  const readOnlyFields: GridFormFieldSchema[] = blacklist ? [
    {
      id: 'carNumber',
      label: '차량번호',
      rules: '시스템 자동 입력',
      component: (
        <SimpleTextInput
          value={blacklist.carNumber}
          onChange={() => {}}
          disabled
          validationRule={{ type: 'free', mode: 'view' }}
        />
      )
    },
    {
      id: 'blacklistType',
      label: '등록 유형',
      rules: '자동/수동 구분',
      component: (
        <SimpleTextInput
          value={blacklist.blacklistType === 'AUTO' ? '자동' : '수동'}
          onChange={() => {}}
          disabled
          validationRule={{ type: 'free', mode: 'view' }}
        />
      )
    },
    {
      id: 'isActive',
      label: '상태',
      rules: '활성/비활성 상태',
      component: (
        <SimpleTextInput
          value={blacklist.isActive ? '활성' : '비활성'}
          onChange={() => {}}
          disabled
          validationRule={{ type: 'free', mode: 'view' }}
        />
      )
    },
    {
      id: 'blockedAt',
      label: '차단일시',
      rules: '시스템 자동 기록',
      component: (
        <SimpleDatePicker
          value={blacklist.blockedAt || null}
          onChange={() => {}}
          disabled={true}
          dateFormat="yyyy-MM-dd HH:mm:ss"
          showTimeSelect={true}
          utcMode={true}
        />
      )
    }
  ] : [];

  // 편집 가능한 필드
  const editableFields: GridFormFieldSchema[] = [
    {
      id: 'registrationReason',
      label: '등록 사유',
      required: true,
      rules: '위반 유형 선택',
      component: (
        <SimpleDropdown
          value={data.registrationReason}
          onChange={(value) => handleChange('registrationReason', value)}
          options={REGISTRATION_REASON_OPTIONS}
          placeholder="등록 사유를 선택하세요"
          validationRule={{ type: 'free', mode: 'edit' }}
        />
      )
    },
    {
      id: 'blockedUntil',
      label: '차단 종료 시각',
      required: true,
      rules: '날짜 및 시간 선택',
      component: (
        <SimpleDatePicker
          value={data.blockedUntil}
          onChange={(value) => handleChange('blockedUntil', value)}
          placeholder="날짜와 시간을 선택하세요"
          dateFormat="yyyy-MM-dd HH:mm"
          showTimeSelect
          validationRule={{ type: 'free', mode: 'edit' }}
        />
      )
    },
    {
      id: 'blockReason',
      label: '차단 사유',
      rules: '자유 형식 텍스트',
      component: (
        <SimpleTextInput
          value={data.blockReason}
          onChange={(value) => handleChange('blockReason', value)}
          placeholder="차단 사유를 입력하세요"
          validationRule={{ type: 'free', mode: 'edit' }}
        />
      )
    },
    {
      id: 'unblockReason',
      label: '해제 사유',
      rules: '자유 형식 텍스트',
      component: (
        <SimpleTextInput
          value={data.unblockReason}
          onChange={(value) => handleChange('unblockReason', value)}
          placeholder="해제 사유를 입력하세요"
          validationRule={{ type: 'free', mode: 'edit' }}
        />
      )
    }
  ];

  const fields = [...readOnlyFields, ...editableFields];

  return (
    <GridFormAuto 
      fields={fields}
      gap="16px" 
      bottomRightActions={bottomRightActions}
    />
  );
};

export default BlacklistForm;


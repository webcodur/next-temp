'use client';

import React from 'react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/SimpleDatePicker';
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

  return (
    <GridForm gap="16px" bottomRightActions={bottomRightActions}>
      {/* 읽기 전용 정보 섹션 */}
      {blacklist && (
        <>
          <GridForm.Row>
            <GridForm.Label>차량번호</GridForm.Label>
            <GridForm.Rules>시스템 자동 입력</GridForm.Rules>
            <GridForm.Content>
              <SimpleTextInput
                value={blacklist.carNumber}
                onChange={() => {}}
                disabled
                validationRule={{ type: 'free', mode: 'view' }}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>등록 유형</GridForm.Label>
            <GridForm.Rules>자동/수동 구분</GridForm.Rules>
            <GridForm.Content>
              <SimpleTextInput
                value={blacklist.blacklistType === 'AUTO' ? '자동' : '수동'}
                onChange={() => {}}
                disabled
                validationRule={{ type: 'free', mode: 'view' }}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>상태</GridForm.Label>
            <GridForm.Rules>활성/비활성 상태</GridForm.Rules>
            <GridForm.Content>
              <SimpleTextInput
                value={blacklist.isActive ? '활성' : '비활성'}
                onChange={() => {}}
                disabled
                validationRule={{ type: 'free', mode: 'view' }}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>차단일시</GridForm.Label>
            <GridForm.Rules>시스템 자동 기록</GridForm.Rules>
            <GridForm.Content>
              <SimpleTextInput
                value={blacklist.blockedAt ? new Date(blacklist.blockedAt).toLocaleString() : '-'}
                onChange={() => {}}
                disabled
                validationRule={{ type: 'free', mode: 'view' }}
              />
            </GridForm.Content>
          </GridForm.Row>
        </>
      )}
      <GridForm.Row>
        <GridForm.Label required>등록 사유</GridForm.Label>
        <GridForm.Rules>위반 유형 선택</GridForm.Rules>
        <GridForm.Content>
          <SimpleDropdown
            value={data.registrationReason}
            onChange={(value) => handleChange('registrationReason', value)}
            options={REGISTRATION_REASON_OPTIONS}
            placeholder="등록 사유를 선택하세요"
            validationRule={{ type: 'free', mode: 'edit' }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label required>차단 종료 시각</GridForm.Label>
        <GridForm.Rules>날짜 및 시간 선택</GridForm.Rules>
        <GridForm.Content>
          <SimpleDatePicker
            value={data.blockedUntil}
            onChange={(value) => handleChange('blockedUntil', value)}
            placeholder="날짜와 시간을 선택하세요"
            dateFormat="yyyy-MM-dd HH:mm"
            showTimeSelect
            validationRule={{ type: 'free', mode: 'edit' }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>차단 사유</GridForm.Label>
        <GridForm.Rules>자유 형식 텍스트</GridForm.Rules>
        <GridForm.Content>
          <SimpleTextInput
            value={data.blockReason}
            onChange={(value) => handleChange('blockReason', value)}
            placeholder="차단 사유를 입력하세요"
            validationRule={{ type: 'free', mode: 'edit' }}
          />
        </GridForm.Content>
      </GridForm.Row>

      <GridForm.Row>
        <GridForm.Label>해제 사유</GridForm.Label>
        <GridForm.Rules>자유 형식 텍스트</GridForm.Rules>
        <GridForm.Content>
          <SimpleTextInput
            value={data.unblockReason}
            onChange={(value) => handleChange('unblockReason', value)}
            placeholder="해제 사유를 입력하세요"
            validationRule={{ type: 'free', mode: 'edit' }}
          />
        </GridForm.Content>
      </GridForm.Row>
    </GridForm>
  );
};

export default BlacklistForm;


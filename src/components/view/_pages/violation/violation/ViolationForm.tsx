'use client';

import React from 'react';
import { RotateCcw, Save, User, Search } from 'lucide-react';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleTextArea } from '@/components/ui/ui-input/simple-input/SimpleTextArea';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleNumberInput } from '@/components/ui/ui-input/simple-input/SimpleNumberInput';
import { ImageUrlInput } from '@/components/ui/ui-input/simple-input/ImageUrlInput';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import { Button } from '@/components/ui/ui-input/button/Button';
import type { 
  CarViolationType,
  ViolationReporterType
} from '@/types/carViolation';
import type { Admin } from '@/types/admin';

export interface ViolationFormData {
  carNumber: string;
  violationType: CarViolationType;
  violationCode: string;
  violationLocation: string;
  violationTime: Date | null;
  description: string;
  evidenceImageUrls: string[];
  reporterType: ViolationReporterType;
  reporterId: string;
  severityLevel: number;
  penaltyPoints: number;
}

interface ViolationFormProps {
  mode: 'create' | 'edit' | 'view';
  data: ViolationFormData;
  onChange: (data: ViolationFormData) => void;
  disabled?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  hasChanges?: boolean;
  isValid?: boolean;
  selectedAdmin?: Admin | null;
  onAdminSelect?: () => void;
}

// #region 상수 정의
const VIOLATION_TYPE_OPTIONS = [
  { value: 'UNAUTHORIZED_PARKING', label: '무단 주차' },
  { value: 'OVERTIME_PARKING', label: '초과 주차' },
  { value: 'RESERVED_SPOT_VIOLATION', label: '지정석 위반' },
  { value: 'FIRE_LANE_PARKING', label: '소방차로 주차' },
  { value: 'DISABLED_SPOT_VIOLATION', label: '장애인 구역 위반' },
  { value: 'DOUBLE_PARKING', label: '이중 주차' },
  { value: 'BLOCKING_EXIT', label: '출구 차단' },
  { value: 'NO_PERMIT_PARKING', label: '허가증 없는 주차' },
  { value: 'EXPIRED_PERMIT', label: '허가증 만료' },
  { value: 'SPEEDING', label: '과속' },
  { value: 'NOISE_VIOLATION', label: '소음 위반' },
  { value: 'VANDALISM', label: '기물 파손' },
  { value: 'OTHER', label: '기타' },
];

const VIOLATION_CODE_MAPPING: Record<CarViolationType, string> = {
  UNAUTHORIZED_PARKING: 'VP001',
  OVERTIME_PARKING: 'VP002',
  RESERVED_SPOT_VIOLATION: 'VP003',
  FIRE_LANE_PARKING: 'VP004',
  DISABLED_SPOT_VIOLATION: 'VP005',
  DOUBLE_PARKING: 'VP006',
  BLOCKING_EXIT: 'VP007',
  NO_PERMIT_PARKING: 'VP008',
  EXPIRED_PERMIT: 'VP009',
  SPEEDING: 'VP010',
  NOISE_VIOLATION: 'VP011',
  VANDALISM: 'VP012',
  OTHER: 'VP013',
};

const REPORTER_TYPE_OPTIONS = [
  { value: 'SYSTEM', label: '시스템' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'RESIDENT', label: '입주민' },
  { value: 'SECURITY', label: '경비원' },
];
// #endregion

const ViolationForm: React.FC<ViolationFormProps> = ({
  mode,
  data,
  onChange,
  disabled = false,
  showActions = false,
  onReset,
  onSubmit,
  onCancel,
  hasChanges = false,
  isValid = false,
  selectedAdmin,
  onAdminSelect,
}) => {
  const isReadOnly = disabled || mode === 'view';

  const handleFieldChange = (field: keyof ViolationFormData, value: string | string[] | Date | null | number) => {
    onChange({
      ...data,
      [field]: value,
    });
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

  // 액션 버튼 (end 사이드) - 취소, 등록/저장
  const submitButtonText = mode === 'create' ? '등록' : '저장';
  const submitButtonTitle = disabled 
    ? `${submitButtonText} 중...` 
    : !isValid 
      ? '필수 항목을 입력해주세요' 
      : `위반 기록 ${submitButtonText}`;

  const bottomRightActions = showActions ? (
    <div className="flex gap-3">
      {onCancel && (
        <Button 
          variant="ghost"
          size="default"
          onClick={onCancel}
          disabled={disabled}
          title="취소"
        >
          취소
        </Button>
      )}
      <Button 
        variant="primary" 
        size="default"
        onClick={onSubmit} 
        disabled={!isValid || disabled}
        title={submitButtonTitle}
      >
        <Save size={16} />
        {submitButtonText}
      </Button>
    </div>
  ) : null;

  // 기본 필드 정의
  const formFields: GridFormFieldSchema[] = [
    {
      id: 'carNumber',
      label: '차량번호',
      required: true,
      rules: '차량번호를 정확히 입력하세요',
      align: 'start',
      component: (
        <SimpleTextInput
          value={data.carNumber}
          onChange={(value) => handleFieldChange('carNumber', value)}
          placeholder="차량번호를 입력하세요 (예: 12가3456)"
          disabled={isReadOnly}
        />
      )
    },
    {
      id: 'violationType',
      label: '위반 유형',
      required: true,
      rules: '위반 유형을 선택하세요',
      align: 'start',
      component: (
        <SimpleDropdown
          value={data.violationType}
          options={VIOLATION_TYPE_OPTIONS}
          onChange={(value) => {
            const selectedViolationType = value as CarViolationType;
            handleFieldChange('violationType', selectedViolationType);
            handleFieldChange('violationCode', VIOLATION_CODE_MAPPING[selectedViolationType]);
          }}
          disabled={isReadOnly}
        />
      )
    },
    {
      id: 'violationCode',
      label: '위반 코드',
      required: true,
      rules: '자동 생성되는 위반 코드',
      align: 'start',
      component: (
        <SimpleDropdown
          value={data.violationCode}
          options={VIOLATION_TYPE_OPTIONS.map(option => ({
            value: VIOLATION_CODE_MAPPING[option.value as CarViolationType],
            label: `${VIOLATION_CODE_MAPPING[option.value as CarViolationType]} - ${option.label}`
          }))}
          onChange={(value) => {
            handleFieldChange('violationCode', value);
            // 위반 코드에 해당하는 위반 유형도 함께 업데이트
            const violationType = Object.entries(VIOLATION_CODE_MAPPING).find(
              ([, code]) => code === value
            )?.[0] as CarViolationType;
            if (violationType) {
              handleFieldChange('violationType', violationType);
            }
          }}
          disabled={isReadOnly}
        />
      )
    },
    {
      id: 'violationLocation',
      label: '위반 장소',
      rules: '위반이 발생한 장소를 입력하세요',
      align: 'start',
      component: (
        <SimpleTextInput
          value={data.violationLocation}
          onChange={(value) => handleFieldChange('violationLocation', value)}
          placeholder="위반 발생 장소를 입력하세요"
          disabled={isReadOnly}
        />
      )
    },
    {
      id: 'violationTime',
      label: '위반 시각',
      required: true,
      rules: '위반이 발생한 시각을 선택하세요',
      align: 'start',
      component: (
        <SimpleDatePicker
          value={data.violationTime}
          onChange={(value) => {
            const date = value ? new Date(value) : null;
            handleFieldChange('violationTime', date);
          }}
          dateFormat="yyyy-MM-dd HH:mm"
          placeholder="위반 시각을 선택하세요"
          showTimeSelect={true}
          disabled={isReadOnly}
          utcMode={false}
          validationRule={{ type: 'free', mode: mode }}
        />
      )
    },
    {
      id: 'reporterType',
      label: '신고자 유형',
      rules: '신고자의 유형을 선택하세요',
      align: 'start',
      component: (
        <SimpleDropdown
          value={data.reporterType}
          options={REPORTER_TYPE_OPTIONS}
          onChange={(value) => handleFieldChange('reporterType', value)}
          disabled={isReadOnly}
        />
      )
    },
    {
      id: 'reporterId',
      label: '신고자 선택',
      rules: '신고자를 선택하세요',
      align: 'start',
      component: (
        <div className="flex gap-2 items-center">
          {selectedAdmin ? (
            // 선택된 관리자 정보 표시
            <div className="flex-1 flex gap-3 items-center p-3 border rounded-md border-border bg-muted/50">
              <div className="flex justify-center items-center w-8 h-8 rounded-full bg-primary/10">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {selectedAdmin.name} ({selectedAdmin.account})
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {selectedAdmin.id} | {selectedAdmin.role?.name || '권한 없음'}
                </div>
              </div>
            </div>
          ) : (
            // 선택되지 않은 상태
            <div className="flex-1 flex gap-2 items-center p-3 border border-dashed rounded-md border-muted-foreground/30 bg-muted/20">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                신고자를 선택해주세요
              </span>
            </div>
          )}
          
          {/* 선택 버튼 */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdminSelect}
            disabled={isReadOnly}
            className="flex-shrink-0"
          >
            <Search className="w-4 h-4 mr-1" />
            {selectedAdmin ? '변경' : '선택'}
          </Button>
        </div>
      )
    },
    {
      id: 'severityLevel',
      label: '심각도',
      required: true,
      rules: '1 이상의 숫자를 입력하세요',
      align: 'start',
      component: (
        <SimpleNumberInput
          value={data.severityLevel}
          onChange={(value) => handleFieldChange('severityLevel', typeof value === 'number' ? value : 1)}
          min={1}
          disabled={isReadOnly}
        />
      )
    },
    {
      id: 'penaltyPoints',
      label: '벌점',
      required: true,
      rules: '1 이상의 벌점을 입력하세요',
      align: 'start',
      component: (
        <SimpleNumberInput
          value={data.penaltyPoints}
          onChange={(value) => {
            const numValue = typeof value === 'number' ? value : 1;
            const clampedValue = Math.max(1, numValue);
            handleFieldChange('penaltyPoints', clampedValue);
          }}
          min={1}
          disabled={isReadOnly}
        />
      )
    },
    {
      id: 'description',
      label: '설명',
      rules: '위반 상황에 대한 자세한 설명',
      align: 'start',
      component: (
        <SimpleTextArea
          value={data.description}
          onChange={(value) => handleFieldChange('description', value)}
          placeholder="위반 상황에 대한 설명을 입력하세요"
          rows={3}
          disabled={isReadOnly}
        />
      )
    },
    {
      id: 'evidenceImageUrls',
      label: '증거 이미지 URL',
      rules: '최대 5개의 이미지 URL 입력',
      align: 'start',
      component: (
        <ImageUrlInput
          value={data.evidenceImageUrls}
          onChange={(value) => handleFieldChange('evidenceImageUrls', value)}
          placeholder="이미지 URL을 입력하세요"
          maxImages={5}
        />
      )
    }
  ];

  return (
    <GridFormAuto 
      fields={formFields}
      gap="16px"
      topRightActions={topRightActions}
      bottomLeftActions={bottomLeftActions}
      bottomRightActions={bottomRightActions}
    />
  );
};

export default ViolationForm;

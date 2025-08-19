'use client';

import React from 'react';
import { Eraser, RotateCcw, Router } from 'lucide-react';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { ParkingDevice } from '@/types/device';
import { ValidationRule } from '@/utils/validation';

// #region 타입 정의 및 상수
export interface DeviceFormData {
  name: string;
  ip: string;
  port: string;
  serverPort: string;
  cctvUrl: string;
  status: string;
  deviceType: string;
  isTicketing: string;
  isReceipting: string;
  representativePhone: string;
  sequence: string;
}

interface DeviceFormProps {
  mode: 'create' | 'edit' | 'view';
  device?: ParkingDevice | null;
  data: DeviceFormData;
  onChange: (data: DeviceFormData) => void;
  disabled?: boolean;
  showActions?: boolean;
  onReset?: () => void;
  onSubmit?: () => void;
  onDelete?: () => void;
  hasChanges?: boolean;
  isValid?: boolean;
}

const DEVICE_TYPE_OPTIONS = [
  { value: '1', label: '라즈베리파이' },
  { value: '2', label: '통합보드' },
];
const STATUS_OPTIONS = [
  { value: '1', label: '자동운행' },
  { value: '2', label: '항시열림' },
  { value: '3', label: '바이패스' },
];
const YES_NO_OPTIONS = [
  { value: 'Y', label: '예' },
  { value: 'N', label: '아니오' },
];
// #endregion

const DeviceForm: React.FC<DeviceFormProps> = ({
  mode,
  device,
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

  // #region 핸들러 및 유틸리티 함수
  const handleFieldChange = (field: keyof DeviceFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // 필드별 유효성 규칙 생성 함수
  const getValidationRule = (fieldType: 'name' | 'ip' | 'port' | 'serverPort' | 'cctvUrl' | 'phone' | 'sequence' | 'status' | 'deviceType' | 'ticketing' | 'receipting', required = false): ValidationRule => {
    // 단일 ValidationRule 객체로 반환 (배열 대신)
    let validationType: ValidationRule['type'] = 'free';
    
    switch (fieldType) {
      case 'ip':
        validationType = 'ip';
        break;
      case 'port':
      case 'serverPort':
        validationType = 'port';
        break;
      case 'phone':
        validationType = 'phone';
        break;
      case 'name':
      case 'cctvUrl':
      case 'sequence':
      case 'status':
      case 'deviceType':
      case 'ticketing':
      case 'receipting':
        validationType = 'free';
        break;
    }
    
    const result: ValidationRule = { type: validationType, mode, required };
    return result;
  };

  // 초기화 핸들러 (생성 폼 전용)
  const handleClearAllFields = () => {
    onChange({
      name: '',
      ip: '',
      port: '',
      serverPort: '',
      cctvUrl: '',
      status: '',
      deviceType: '',
      isTicketing: '',
      isReceipting: '',
      representativePhone: '',
      sequence: '',
    });
  };
  // #endregion

  // #region 액션 버튼 구성
  const bottomLeftActions = showActions
    ? (
      mode === 'create' ? (
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
      ) : mode === 'edit' ? (
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
      ) : null
    )
    : null;

  const bottomRightActions = showActions
    ? (
      mode === 'create' ? (
        <CrudButton
          action="save"
          size="default"
          onClick={onSubmit}
          disabled={!isValid || disabled}
          title={disabled ? '저장 중...' : !isValid ? '필수 항목을 입력해주세요' : '저장'}
        />
      ) : mode === 'edit' ? (
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
      ) : null
    )
    : null;
  // #endregion

  // #region 필드 구성
  const allFields: GridFormFieldSchema[] = [
    // 기본 정보
    {
      id: 'name',
      label: '차단기명',
      required: mode === 'create',
      rules: '식별 가능한 고유명',
      component: (
        <SimpleTextInput
          value={data.name}
          onChange={(value) => handleFieldChange('name', value)}
          placeholder="차단기명"
          disabled={isReadOnly}
          validationRule={getValidationRule('name', mode === 'create')}
        />
      )
    },
    {
      id: 'ip',
      label: 'IP 주소',
      required: mode === 'create',
      rules: 'IPv4 형식 (192.168.0.1)',
      component: (
        <SimpleTextInput
          value={data.ip}
          onChange={(value) => handleFieldChange('ip', value)}
          placeholder="192.168.1.100"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('ip', mode === 'create')}
        />
      )
    },
    {
      id: 'port',
      label: '포트',
      required: mode === 'create',
      rules: '1-65535 범위 숫자',
      component: (
        <SimpleTextInput
          value={data.port}
          onChange={(value) => handleFieldChange('port', value)}
          placeholder="8080"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('port', mode === 'create')}
        />
      )
    },
    {
      id: 'serverPort',
      label: '서버 포트',
      rules: '1-65535 범위 숫자',
      component: (
        <SimpleTextInput
          value={data.serverPort}
          onChange={(value) => handleFieldChange('serverPort', value)}
          placeholder="9090"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('serverPort', false)}
        />
      )
    },
    {
      id: 'cctvUrl',
      label: 'CCTV URL',
      required: mode === 'create',
      rules: '유효한 URL 형식',
      component: (
        <SimpleTextInput
          value={data.cctvUrl}
          onChange={(value) => handleFieldChange('cctvUrl', value)}
          placeholder="http://192.168.1.100:8080/stream"
          disabled={isReadOnly}
          validationRule={getValidationRule('cctvUrl', mode === 'create')}
        />
      )
    },
    {
      id: 'status',
      label: '운영 상태',
      required: mode === 'create',
      rules: '자동/열림/바이패스 선택',
      component: (
        <SimpleDropdown
          value={data.status}
          onChange={(value) => handleFieldChange('status', value)}
          options={STATUS_OPTIONS}
          placeholder="운영 상태를 선택하세요"
          disabled={isReadOnly}
          validationRule={getValidationRule('status', mode === 'create')}
        />
      )
    },
    {
      id: 'deviceType',
      label: '디바이스 타입',
      required: mode === 'create',
      rules: '라즈베리/통합보드 선택',
      component: (
        <SimpleDropdown
          value={data.deviceType}
          onChange={(value) => handleFieldChange('deviceType', value)}
          options={DEVICE_TYPE_OPTIONS}
          placeholder="디바이스 타입을 선택하세요"
          disabled={isReadOnly}
          validationRule={getValidationRule('deviceType', mode === 'create')}
        />
      )
    },
    {
      id: 'isTicketing',
      label: '발권 기능',
      rules: 'Y/N 선택',
      component: (
        <SimpleDropdown
          value={data.isTicketing}
          onChange={(value) => handleFieldChange('isTicketing', value)}
          options={YES_NO_OPTIONS}
          placeholder="발권 기능 사용 여부"
          disabled={isReadOnly}
          validationRule={getValidationRule('ticketing', false)}
        />
      )
    },
    {
      id: 'isReceipting',
      label: '영수증 기능',
      rules: 'Y/N 선택',
      component: (
        <SimpleDropdown
          value={data.isReceipting}
          onChange={(value) => handleFieldChange('isReceipting', value)}
          options={YES_NO_OPTIONS}
          placeholder="영수증 기능 사용 여부"
          disabled={isReadOnly}
          validationRule={getValidationRule('receipting', false)}
        />
      )
    },
    {
      id: 'representativePhone',
      label: '대표전화',
      rules: '02-0000-0000 형식',
      component: (
        <SimpleTextInput
          value={data.representativePhone}
          onChange={(value) => handleFieldChange('representativePhone', value)}
          placeholder="02-1234-5678"
          disabled={isReadOnly}
          autocomplete="off"
          validationRule={getValidationRule('phone', false)}
        />
      )
    },
    {
      id: 'sequence',
      label: '순번',
      rules: '양수 (1 이상)',
      component: (
        <SimpleTextInput
          value={data.sequence}
          onChange={(value) => handleFieldChange('sequence', value)}
          placeholder="1"
          disabled={true}
          validationRule={getValidationRule('sequence', false)}
        />
      )
    },
    // 추가 정보 (view/edit 모드에서만)
    ...(mode !== 'create' && device ? [
      {
        id: 'parkinglotId',
        label: '주차장 ID',
        rules: '시스템 자동 연결',
        component: (
          <SimpleTextInput
            value={device.parkinglotId?.toString() || '-'}
            onChange={() => {}}
            disabled={true}
            validationRule={getValidationRule('sequence', false)}
          />
        )
      },
      {
        id: 'createdAt',
        label: '등록일자',
        rules: '시스템 자동 기록',
        component: (
          <SimpleDatePicker
            value={device.createdAt || null}
            onChange={() => {}}
            disabled={true}
            dateFormat="yyyy-MM-dd"
            showTimeSelect={false}
            utcMode={true}
            validationRule={getValidationRule('sequence', false)}
          />
        )
      },
      {
        id: 'updatedAt',
        label: '수정일자',
        rules: '시스템 자동 기록',
        component: (
          <SimpleDatePicker
            value={device.updatedAt || null}
            onChange={() => {}}
            disabled={true}
            dateFormat="yyyy-MM-dd"
            showTimeSelect={false}
            utcMode={true}
            validationRule={getValidationRule('sequence', false)}
          />
        )
      }
    ] : [])
  ];
  // #endregion

  // #region 렌더링
  return (
    <div className="space-y-6">
      <SectionPanel 
        title="차단기 정보" 
        subtitle="차단기 설정 및 운영 정보를 관리합니다."
        icon={<Router size={18} />}
      >
        <GridFormAuto fields={allFields} gap="16px" />
      </SectionPanel>

      {/* 액션 버튼 표시 */}
      {showActions && (
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-3">
            {bottomLeftActions}
          </div>
          <div className="flex gap-3">
            {bottomRightActions}
          </div>
        </div>
      )}
    </div>
  );
  // #endregion
};

export default DeviceForm;

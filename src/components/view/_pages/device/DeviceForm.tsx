'use client';

import React, { useMemo } from 'react';
import { Eraser, RotateCcw, Router, Settings, Info } from 'lucide-react';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { ParkingDevice } from '@/types/device';
import { validateIP, validatePort } from '@/utils/ipValidation';

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

  const handleFieldChange = (field: keyof DeviceFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // 유효성 검사 메시지
  const validationMessages = useMemo(() => {
    const messages: Record<string, string> = {};
    
    if (data.ip.trim()) {
      const ipValidation = validateIP(data.ip);
      if (!ipValidation.isValid) {
        messages.ip = ipValidation.message || '올바른 IP 주소를 입력해주세요.';
      }
    }

    if (data.port.trim()) {
      const portValidation = validatePort(data.port);
      if (!portValidation.isValid) {
        messages.port = portValidation.message || '올바른 포트 번호를 입력해주세요.';
      }
    }

    if (data.serverPort.trim()) {
      const serverPortValidation = validatePort(data.serverPort);
      if (!serverPortValidation.isValid) {
        messages.serverPort = serverPortValidation.message || '올바른 서버 포트 번호를 입력해주세요.';
      }
    }

    return messages;
  }, [data.ip, data.port, data.serverPort]);

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

  // 하단 버튼 구성
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

  return (
    <div className="space-y-6">
      {/* 기본 정보 섹션 */}
      <div>
        {(() => {
          const basicFields: GridFormFieldSchema[] = [
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
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
                />
              )
            },
            {
              id: 'cctvUrl',
              label: 'CCTV URL',
              required: mode === 'create',
              rules: '유횤한 URL 형식',
              component: (
                <SimpleTextInput
                  value={data.cctvUrl}
                  onChange={(value) => handleFieldChange('cctvUrl', value)}
                  placeholder="http://192.168.1.100:8080/stream"
                  disabled={isReadOnly}
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
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
                  validationRule={{
                    type: 'phone',
                    mode: mode
                  }}
                />
              )
            },
            {
              id: 'sequence',
              label: '순번',
              rules: '좋자 (1 이상)',
              component: (
                <SimpleTextInput
                  value={data.sequence}
                  onChange={(value) => handleFieldChange('sequence', value)}
                  placeholder="1"
                  disabled={true}
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
                />
              )
            }
          ];

          return (
            <SectionPanel 
              title="차단기 기본 정보" 
              subtitle="차단기의 기본 설정을 관리합니다."
              icon={<Router size={18} />}
            >
              <div className="p-4">
                <GridFormAuto fields={basicFields} gap="16px" />
              </div>
            </SectionPanel>
          );
        })()}
      </div>

      {/* 네트워크 설정 섹션 */}
      <SectionPanel 
        title="네트워크 설정"
        subtitle="IP, 포트 등 네트워크 연결 정보를 설정합니다."
        icon={<Settings size={18} />}
      >
        <div className="p-4">
          <GridFormAuto
          fields={[
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
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
                  errorMessage={validationMessages.ip}
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
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
                  errorMessage={validationMessages.port}
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
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
                  errorMessage={validationMessages.serverPort}
                />
              )
            }
          ]}
          gap="16px"
        />
      </div>
      </SectionPanel>

      {/* 운영 설정 섹션 */}
      <SectionPanel 
        title="운영 설정"
        subtitle="차단기 운영 상태 및 기능을 설정합니다."
        icon={<Settings size={18} />}
      >
        <div className="p-4">
          <GridFormAuto
          fields={[
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
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
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
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
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
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
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
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
                />
              )
            }
          ]}
          gap="16px"
        />
      </div>
      </SectionPanel>

      {/* view/edit 모드에서만 표시되는 추가 정보 */}
      {mode !== 'create' && device && (
        <SectionPanel 
          title="추가 정보"
          subtitle="차단기의 시스템 관련 정보입니다."
          icon={<Info size={18} />}
        >
          <div className="p-4">
            <GridFormAuto
            fields={[
              {
                id: 'parkinglotId',
                label: '주차장 ID',
                rules: '시스템 자동 연결',
                component: (
                  <SimpleTextInput
                    value={device.parkinglotId?.toString() || '-'}
                    onChange={() => {}}
                    disabled={true}
                    validationRule={{
                      type: 'free',
                      mode: mode
                    }}
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
                  />
                )
              }
            ]}
            gap="16px"
          />
          </div>
        </SectionPanel>
      )}

      {/* 생성 모드이거나 추가 정보가 없는 경우 버튼 액션만 표시 */}
      {(mode === 'create' || !device) && showActions && (
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
};

export default DeviceForm;

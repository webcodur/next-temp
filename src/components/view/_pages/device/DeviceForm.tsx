'use client';

import React, { useMemo } from 'react';
import { Eraser, RotateCcw } from 'lucide-react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import TitleRow from '@/components/ui/ui-layout/title-row/TitleRow';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
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
        <TitleRow title="차단기 기본 정보" subtitle="차단기의 기본 설정을 관리합니다." />
        <div className="h-4" />
        <GridForm labelWidth="120px" gap="16px">
          <GridForm.Row>
            <GridForm.Label required={mode === 'create'}>
              차단기명
            </GridForm.Label>
            <GridForm.Rules>
              식별 가능한 고유명
            </GridForm.Rules>
            <GridForm.Content>
              <SimpleTextInput
                value={data.name}
                onChange={(value) => handleFieldChange('name', value)}
                placeholder="차단기명을 입력해주세요"
                disabled={isReadOnly}
                validationRule={{
                  type: 'free',
                  mode: mode
                }}
              />
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label required={mode === 'create'}>
              CCTV URL
            </GridForm.Label>
            <GridForm.Rules>
              유횤한 URL 형식
            </GridForm.Rules>
            <GridForm.Content>
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
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>
              대표전화
            </GridForm.Label>
            <GridForm.Rules>
              02-0000-0000 형식
            </GridForm.Rules>
            <GridForm.Content>
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
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>
              순번
            </GridForm.Label>
            <GridForm.Rules>
              좋자 (1 이상)
            </GridForm.Rules>
            <GridForm.Content>
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
            </GridForm.Content>
          </GridForm.Row>
        </GridForm>
      </div>

      {/* 네트워크 설정 섹션 */}
      <div>
        <TitleRow title="네트워크 설정" subtitle="IP, 포트 등 네트워크 연결 정보를 설정합니다." />
        <div className="h-4" />
        <GridForm labelWidth="120px" gap="16px">
          <GridForm.Row>
            <GridForm.Label required={mode === 'create'}>
              IP 주소
            </GridForm.Label>
            <GridForm.Rules>
              IPv4 형식 (192.168.0.1)
            </GridForm.Rules>
            <GridForm.Content>
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
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label required={mode === 'create'}>
              포트
            </GridForm.Label>
            <GridForm.Rules>
              1-65535 범위 숫자
            </GridForm.Rules>
            <GridForm.Content>
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
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>
              서버 포트
            </GridForm.Label>
            <GridForm.Rules>
              1-65535 범위 숫자
            </GridForm.Rules>
            <GridForm.Content>
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
            </GridForm.Content>
          </GridForm.Row>
        </GridForm>
      </div>

      {/* 운영 설정 섹션 */}
      <div>
        <TitleRow title="운영 설정" subtitle="차단기 운영 상태 및 기능을 설정합니다." />
        <div className="h-4" />
        <GridForm labelWidth="120px" gap="16px">
          <GridForm.Row>
            <GridForm.Label required={mode === 'create'}>
              운영 상태
            </GridForm.Label>
            <GridForm.Rules>
              자동/열림/바이패스 선택
            </GridForm.Rules>
            <GridForm.Content>
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
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label required={mode === 'create'}>
              디바이스 타입
            </GridForm.Label>
            <GridForm.Rules>
              라즈베리/통합보드 선택
            </GridForm.Rules>
            <GridForm.Content>
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
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>
              발권 기능
            </GridForm.Label>
            <GridForm.Rules>
              Y/N 선택
            </GridForm.Rules>
            <GridForm.Content>
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
            </GridForm.Content>
          </GridForm.Row>

          <GridForm.Row>
            <GridForm.Label>
              영수증 기능
            </GridForm.Label>
            <GridForm.Rules>
              Y/N 선택
            </GridForm.Rules>
            <GridForm.Content>
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
            </GridForm.Content>
          </GridForm.Row>
        </GridForm>
      </div>

      {/* view/edit 모드에서만 표시되는 추가 정보 */}
      {mode !== 'create' && device && (
        <div>
          <TitleRow title="추가 정보" subtitle="차단기의 시스템 관련 정보입니다." />
          <div className="h-4" />
          <GridForm 
            labelWidth="120px" 
            gap="16px"
            bottomLeftActions={bottomLeftActions}
            bottomRightActions={bottomRightActions}
          >
            <GridForm.Row>
              <GridForm.Label>
                주차장 ID
              </GridForm.Label>
              <GridForm.Rules>
                시스템 자동 연결
              </GridForm.Rules>
              <GridForm.Content>
                <SimpleTextInput
                  value={device.parkinglotId?.toString() || '-'}
                  onChange={() => {}}
                  disabled={true}
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
                />
              </GridForm.Content>
            </GridForm.Row>

            <GridForm.Row>
              <GridForm.Label>
                등록일자
              </GridForm.Label>
              <GridForm.Rules>
                시스템 자동 기록
              </GridForm.Rules>
              <GridForm.Content>
                <SimpleTextInput
                  value={device.createdAt ? new Date(device.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }) : '-'}
                  onChange={() => {}}
                  disabled={true}
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
                />
              </GridForm.Content>
            </GridForm.Row>

            <GridForm.Row>
              <GridForm.Label>
                수정일자
              </GridForm.Label>
              <GridForm.Rules>
                시스템 자동 기록
              </GridForm.Rules>
              <GridForm.Content>
                <SimpleTextInput
                  value={device.updatedAt ? new Date(device.updatedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }) : '-'}
                  onChange={() => {}}
                  disabled={true}
                  validationRule={{
                    type: 'free',
                    mode: mode
                  }}
                />
              </GridForm.Content>
            </GridForm.Row>
          </GridForm>
        </div>
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

'use client';

import React, { useMemo } from 'react';
import { RotateCcw, Send, Trash2 } from 'lucide-react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { Button } from '@/components/ui/ui-input/button/Button';
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

  // 액션 버튼들 정의
  const topRightActions = showActions && onDelete ? (
    <Button 
      variant="destructive" 
      size="default"
      onClick={onDelete}
      disabled={disabled}
      title="차단기 삭제"
    >
      <Trash2 size={16} />
      삭제
    </Button>
  ) : null;

  const bottomRightActions = showActions ? (
    <div className="flex gap-3">
      <Button 
        variant="secondary" 
        size="default"
        onClick={onReset} 
        disabled={!hasChanges || disabled}
        title={!hasChanges ? '변경사항이 없습니다' : '변경사항 되돌리기'}
      >
        <RotateCcw size={16} />
        복구
      </Button>
      <Button 
        variant="primary" 
        size="default"
        onClick={onSubmit} 
        disabled={!isValid || disabled}
        title={disabled ? '전송 중...' : !isValid ? '필수 항목을 입력해주세요' : '변경사항 저장'}
      >
        <Send size={16} />
        전송
      </Button>
    </div>
  ) : null;

  return (
    <GridForm 
      labelWidth="120px" 
      gap="16px"
      topRightActions={topRightActions}
      bottomRightActions={bottomRightActions}
    >
      <GridForm.Row>
        <GridForm.Label required={mode === 'create'}>
          차단기명
        </GridForm.Label>
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
          IP 주소
        </GridForm.Label>
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

      <GridForm.Row>
        <GridForm.Label required={mode === 'create'}>
          CCTV URL
        </GridForm.Label>
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
        <GridForm.Label required={mode === 'create'}>
          운영 상태
        </GridForm.Label>
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

      <GridForm.Row>
        <GridForm.Label>
          대표전화
        </GridForm.Label>
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
          설치 순서
        </GridForm.Label>
        <GridForm.Content>
          <SimpleTextInput
            type="number"
            value={data.sequence}
            onChange={(value) => handleFieldChange('sequence', value)}
            placeholder="1"
            disabled={isReadOnly}
            validationRule={{
              type: 'free',
              mode: mode
            }}
          />
        </GridForm.Content>
      </GridForm.Row>

      {/* view/edit 모드에서만 표시되는 추가 정보 */}
      {mode !== 'create' && device && (
        <>
          <GridForm.Row>
            <GridForm.Label>
              주차장 ID
            </GridForm.Label>
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
        </>
      )}

    </GridForm>
  );
};

export default DeviceForm;

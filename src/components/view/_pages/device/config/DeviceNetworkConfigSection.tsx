'use client';

import React, { useState, useMemo } from 'react';
import { Save, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { updateParkingDeviceNetwork } from '@/services/devices/devices@id_network_PUT';
import { ParkingDevice } from '@/types/device';
import { validateIP, validatePort } from '@/utils/ipValidation';

interface NetworkConfigData {
  ip: string;
  port: string;
  serverPort: string;
}

interface DeviceNetworkConfigSectionProps {
  device: ParkingDevice;
  onDataChange: () => void;
}

export default function DeviceNetworkConfigSection({ 
  device, 
  onDataChange 
}: DeviceNetworkConfigSectionProps) {
  // #region 상태 관리
  const [formData, setFormData] = useState<NetworkConfigData>({
    ip: device.ip,
    port: device.port,
    serverPort: device.serverPort || '',
  });
  const [originalData] = useState<NetworkConfigData>({
    ip: device.ip,
    port: device.port,
    serverPort: device.serverPort || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    return (
      formData.ip !== originalData.ip ||
      formData.port !== originalData.port ||
      formData.serverPort !== originalData.serverPort
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    if (!hasChanges) return false;
    
    // 기본 필수 필드 체크
    if (!formData.ip.trim() || !formData.port.trim()) {
      return false;
    }

    // IP 주소 유효성 검사
    const ipValidation = validateIP(formData.ip);
    if (!ipValidation.isValid) {
      return false;
    }

    // 포트 번호 유효성 검사
    const portValidation = validatePort(formData.port);
    if (!portValidation.isValid) {
      return false;
    }

    // 서버 포트가 있는 경우 유효성 검사
    if (formData.serverPort.trim()) {
      const serverPortValidation = validatePort(formData.serverPort);
      if (!serverPortValidation.isValid) {
        return false;
      }
    }

    return true;
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleFieldChange = (field: keyof NetworkConfigData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 유효성 검사 메시지
  const validationMessages = useMemo(() => {
    const messages: Record<string, string> = {};
    
    if (formData.ip.trim()) {
      const ipValidation = validateIP(formData.ip);
      if (!ipValidation.isValid) {
        messages.ip = ipValidation.message || '올바른 IP 주소를 입력해주세요.';
      }
    }

    if (formData.port.trim()) {
      const portValidation = validatePort(formData.port);
      if (!portValidation.isValid) {
        messages.port = portValidation.message || '올바른 포트 번호를 입력해주세요.';
      }
    }

    if (formData.serverPort.trim()) {
      const serverPortValidation = validatePort(formData.serverPort);
      if (!serverPortValidation.isValid) {
        messages.serverPort = serverPortValidation.message || '올바른 서버 포트 번호를 입력해주세요.';
      }
    }

    return messages;
  }, [formData.ip, formData.port, formData.serverPort]);

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const updateData = {
        ip: formData.ip,
        port: formData.port,
        serverPort: formData.serverPort || undefined,
      };

      const result = await updateParkingDeviceNetwork(device.id, updateData);

      if (result.success) {
        setModalMessage('네트워크 설정이 성공적으로 저장되었습니다.');
        setSuccessModalOpen(true);
        // 상위 컴포넌트에 데이터 변경 알림
        onDataChange();
      } else {
        console.error('네트워크 설정 저장 실패:', result.errorMsg);
        setModalMessage(`네트워크 설정 저장에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('네트워크 설정 저장 중 오류:', error);
      setModalMessage('네트워크 설정 저장 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (!hasChanges) return;
    
    setFormData(originalData);
  };
  // #endregion

  return (
    <div className="space-y-6">
      {/* 네트워크 설정 섹션 */}
      {(() => {
        const fields: GridFormFieldSchema[] = [
          {
            id: 'ip',
            label: 'IP 주소',
            required: true,
            rules: 'IPv4 형식 (192.168.0.1)',
            component: (
              <SimpleTextInput
                value={formData.ip}
                onChange={(value) => handleFieldChange('ip', value)}
                placeholder="192.168.1.100"
                disabled={isSubmitting}
                validationRule={{
                  type: 'ip',
                  mode: 'edit',
                  message: 'IPv4/IPv6 허용, 예: 192.168.1.100'
                }}
                errorMessage={validationMessages.ip}
              />
            )
          },
          {
            id: 'port',
            label: '포트',
            required: true,
            rules: '1-65535 범위 숫자',
            component: (
              <SimpleTextInput
                value={formData.port}
                onChange={(value) => handleFieldChange('port', value)}
                placeholder="8080"
                disabled={isSubmitting}
                validationRule={{
                  type: 'port',
                  mode: 'edit'
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
                value={formData.serverPort}
                onChange={(value) => handleFieldChange('serverPort', value)}
                placeholder="9090"
                disabled={isSubmitting}
                validationRule={{
                  type: 'port',
                  mode: 'edit'
                }}
                errorMessage={validationMessages.serverPort}
              />
            )
          }
        ];

        return (
          <GridFormAuto 
            fields={fields}
            title="네트워크 설정"
            subtitle="IP, 포트 등 네트워크 설정을 관리합니다."
            gap="20px"
            bottomLeftActions={(
              <Button 
                variant="secondary" 
                onClick={handleReset}
                disabled={!hasChanges || isSubmitting}
                title={!hasChanges ? '변경사항이 없습니다' : '변경사항 되돌리기'}
              >
                <RotateCcw size={16} />
                복구
              </Button>
            )}
            bottomRightActions={(
              <Button 
                variant="primary" 
                onClick={handleSubmit} 
                disabled={!isValid || isSubmitting}
                title={isSubmitting ? '저장 중...' : !isValid ? '변경사항이 없거나 유효하지 않습니다' : '설정 저장'}
              >
                <Save size={16} />
                {isSubmitting ? '저장 중...' : '저장'}
              </Button>
            )}
          />
        );
      })()}

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 모달 */}
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { Save, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import TitleRow from '@/components/ui/ui-layout/title-row/TitleRow';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { updateParkingDeviceOperation } from '@/services/devices/devices@id_operation_PUT';
import { ParkingDevice } from '@/types/device';

interface OperationConfigData {
  deviceType: string;
  isTicketing: string;
  isReceipting: string;
}

interface DeviceOperationConfigSectionProps {
  device: ParkingDevice;
  onDataChange: () => void;
}

const DEVICE_TYPE_OPTIONS = [
  { value: '1', label: '라즈베리파이' },
  { value: '2', label: '통합보드' },
];

const YES_NO_OPTIONS = [
  { value: 'Y', label: '예' },
  { value: 'N', label: '아니오' },
];

export default function DeviceOperationConfigSection({ 
  device, 
  onDataChange 
}: DeviceOperationConfigSectionProps) {
  // #region 상태 관리
  const [formData, setFormData] = useState<OperationConfigData>({
    deviceType: device.deviceType.toString(),
    isTicketing: device.isTicketing || 'N',
    isReceipting: device.isReceipting || 'N',
  });
  const [originalData] = useState<OperationConfigData>({
    deviceType: device.deviceType.toString(),
    isTicketing: device.isTicketing || 'N',
    isReceipting: device.isReceipting || 'N',
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
      formData.deviceType !== originalData.deviceType ||
      formData.isTicketing !== originalData.isTicketing ||
      formData.isReceipting !== originalData.isReceipting
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    return hasChanges && formData.deviceType;
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleFieldChange = (field: keyof OperationConfigData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const updateData = {
        deviceType: parseInt(formData.deviceType),
        isTicketing: formData.isTicketing,
        isReceipting: formData.isReceipting,
      };

      const result = await updateParkingDeviceOperation(device.id, updateData);

      if (result.success) {
        setModalMessage('운영 설정이 성공적으로 저장되었습니다.');
        setSuccessModalOpen(true);
        // 상위 컴포넌트에 데이터 변경 알림
        onDataChange();
      } else {
        console.error('운영 설정 저장 실패:', result.errorMsg);
        setModalMessage(`운영 설정 저장에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('운영 설정 저장 중 오류:', error);
      setModalMessage('운영 설정 저장 중 오류가 발생했습니다.');
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
      {/* 운영 설정 섹션 */}
      <TitleRow title="운영 설정" subtitle="디바이스 타입, 발권/영수증 기능을 관리합니다." />
      <GridForm 
        
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
      >
        <GridForm.Row>
          <GridForm.Label required>
            디바이스 타입
          </GridForm.Label>
          <GridForm.Rules>
            라즈베리/통합보드 선택
          </GridForm.Rules>
          <GridForm.Content>
            <SimpleDropdown
              value={formData.deviceType}
              onChange={(value) => handleFieldChange('deviceType', value)}
              options={DEVICE_TYPE_OPTIONS}
              placeholder="디바이스 타입을 선택하세요"
              disabled={isSubmitting}
              validationRule={{
                type: 'free',
                mode: 'edit'
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
              value={formData.isTicketing}
              onChange={(value) => handleFieldChange('isTicketing', value)}
              options={YES_NO_OPTIONS}
              placeholder="발권 기능 사용 여부"
              disabled={isSubmitting}
              validationRule={{
                type: 'free',
                mode: 'edit'
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
              value={formData.isReceipting}
              onChange={(value) => handleFieldChange('isReceipting', value)}
              options={YES_NO_OPTIONS}
              placeholder="영수증 기능 사용 여부"
              disabled={isSubmitting}
              validationRule={{
                type: 'free',
                mode: 'edit'
              }}
            />
          </GridForm.Content>
        </GridForm.Row>
      </GridForm>

      {/* 운영 설정 설명 */}
      <div className="p-4 mt-6 rounded-lg bg-muted/30">
        <h3 className="mb-2 text-sm font-semibold text-foreground">설정 안내</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• <strong>라즈베리파이:</strong> 소형 차단기용 컨트롤러</li>
          <li>• <strong>통합보드:</strong> 대형 차단기용 고성능 컨트롤러</li>
          <li>• <strong>발권 기능:</strong> 주차 요금 정산용 티켓 발행</li>
          <li>• <strong>영수증 기능:</strong> 결제 완료 후 영수증 발행</li>
        </ul>
      </div>

      {/* 액션 버튼은 GridForm 하단에 배치됨 */}

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

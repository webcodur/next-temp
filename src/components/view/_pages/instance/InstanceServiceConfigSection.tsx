'use client';

import React, { useState, useMemo } from 'react';
import { Save, RotateCcw, Settings } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { updateInstanceServiceConfig } from '@/services/instances/instances@id_service-config_PUT';
import { InstanceDetail } from '@/types/instance';

interface ServiceConfigData {
  canAddNewResident: boolean;
  isCommonEntranceSubscribed: boolean;
  isTemporaryAccess: boolean;
  tempCarLimit: number;
}

interface InstanceServiceConfigSectionProps {
  instance: InstanceDetail;
  onDataChange: () => void;
}

export default function InstanceServiceConfigSection({ 
  instance, 
  onDataChange 
}: InstanceServiceConfigSectionProps) {
  // #region 상태 관리
  const [formData, setFormData] = useState<ServiceConfigData>({
    canAddNewResident: instance.instanceServiceConfig?.canAddNewResident ?? true,
    isCommonEntranceSubscribed: instance.instanceServiceConfig?.isCommonEntranceSubscribed ?? false,
    isTemporaryAccess: instance.instanceServiceConfig?.isTemporaryAccess ?? false,
    tempCarLimit: instance.instanceServiceConfig?.tempCarLimit ?? 0,
  });
  const [originalData] = useState<ServiceConfigData>({
    canAddNewResident: instance.instanceServiceConfig?.canAddNewResident ?? true,
    isCommonEntranceSubscribed: instance.instanceServiceConfig?.isCommonEntranceSubscribed ?? false,
    isTemporaryAccess: instance.instanceServiceConfig?.isTemporaryAccess ?? false,
    tempCarLimit: instance.instanceServiceConfig?.tempCarLimit ?? 0,
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
      formData.canAddNewResident !== originalData.canAddNewResident ||
      formData.isCommonEntranceSubscribed !== originalData.isCommonEntranceSubscribed ||
      formData.isTemporaryAccess !== originalData.isTemporaryAccess ||
      formData.tempCarLimit !== originalData.tempCarLimit
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    return hasChanges && formData.tempCarLimit >= 0;
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleFieldChange = (field: keyof ServiceConfigData, value: boolean | number) => {
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
        canAddNewResident: formData.canAddNewResident,
        isCommonEntranceSubscribed: formData.isCommonEntranceSubscribed,
        isTemporaryAccess: formData.isTemporaryAccess,
        tempCarLimit: formData.tempCarLimit,
      };

      const result = await updateInstanceServiceConfig(instance.id, updateData);

      if (result.success) {
        setModalMessage('서비스 설정이 성공적으로 저장되었습니다.');
        setSuccessModalOpen(true);
        // 상위 컴포넌트에 데이터 변경 알림
        onDataChange();
      } else {
        console.error('서비스 설정 저장 실패:', result.errorMsg);
        setModalMessage(`서비스 설정 저장에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('서비스 설정 저장 중 오류:', error);
      setModalMessage('서비스 설정 저장 중 오류가 발생했습니다.');
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
      <SectionPanel 
        title="서비스 설정" 
        subtitle="세대의 서비스 관련 설정을 관리합니다."
        icon={<Settings size={18} />}
      >
        {(() => {
          const fields: GridFormFieldSchema[] = [
          {
            id: 'canAddNewResident',
            label: '신규 입주민 등록 허용',
            rules: '등록 권한',
            component: (
              <SimpleToggleSwitch
                checked={formData.canAddNewResident}
                onChange={(checked) => handleFieldChange('canAddNewResident', checked)}
                disabled={isSubmitting}
                size="md"
              />
            )
          },
          {
            id: 'isCommonEntranceSubscribed',
            label: '공동현관 구독',
            rules: '현관 서비스',
            component: (
              <SimpleToggleSwitch
                checked={formData.isCommonEntranceSubscribed}
                onChange={(checked) => handleFieldChange('isCommonEntranceSubscribed', checked)}
                disabled={isSubmitting}
                size="md"
              />
            )
          },
          {
            id: 'isTemporaryAccess',
            label: '임시 출입 허용',
            rules: '출입 권한',
            component: (
              <SimpleToggleSwitch
                checked={formData.isTemporaryAccess}
                onChange={(checked) => handleFieldChange('isTemporaryAccess', checked)}
                disabled={isSubmitting}
                size="md"
              />
            )
          },
          {
            id: 'tempCarLimit',
            label: '임시 차량 한도',
            rules: '0 이상 숫자',
            component: (
              <SimpleTextInput
                type="number"
                value={formData.tempCarLimit.toString()}
                onChange={(value) => handleFieldChange('tempCarLimit', parseInt(value) || 0)}
                placeholder="임시 차량 한도"
                disabled={isSubmitting}
                validationRule={{
                  type: 'free',
                  mode: 'edit'
                }}
              />
            )
          }
        ];

          return (
            <GridFormAuto 
              fields={fields}
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
      </SectionPanel>

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

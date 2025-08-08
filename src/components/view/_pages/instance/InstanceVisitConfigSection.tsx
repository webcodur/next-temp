'use client';

import React, { useState, useMemo } from 'react';
import { Save, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import TitleRow from '@/components/ui/ui-layout/title-row/TitleRow';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { updateInstanceVisitConfig } from '@/services/instances/instances@id_visit-config_PUT';
import { InstanceDetail } from '@/types/instance';

interface VisitConfigData {
  availableVisitTime: number;
  purchasedVisitTime: number;
  visitRequestLimit: number;
}

interface InstanceVisitConfigSectionProps {
  instance: InstanceDetail;
  onDataChange: () => void;
}

export default function InstanceVisitConfigSection({ 
  instance, 
  onDataChange 
}: InstanceVisitConfigSectionProps) {
  // #region 상태 관리
  const [formData, setFormData] = useState<VisitConfigData>({
    availableVisitTime: instance.instanceVisitConfig?.availableVisitTime ?? 0,
    purchasedVisitTime: instance.instanceVisitConfig?.purchasedVisitTime ?? 0,
    visitRequestLimit: instance.instanceVisitConfig?.visitRequestLimit ?? 10,
  });
  const [originalData] = useState<VisitConfigData>({
    availableVisitTime: instance.instanceVisitConfig?.availableVisitTime ?? 0,
    purchasedVisitTime: instance.instanceVisitConfig?.purchasedVisitTime ?? 0,
    visitRequestLimit: instance.instanceVisitConfig?.visitRequestLimit ?? 10,
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
      formData.availableVisitTime !== originalData.availableVisitTime ||
      formData.purchasedVisitTime !== originalData.purchasedVisitTime ||
      formData.visitRequestLimit !== originalData.visitRequestLimit
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    return hasChanges && 
           formData.availableVisitTime >= 0 && 
           formData.purchasedVisitTime >= 0 && 
           formData.visitRequestLimit > 0;
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleFieldChange = (field: keyof VisitConfigData, value: number) => {
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
        availableVisitTime: formData.availableVisitTime,
        purchasedVisitTime: formData.purchasedVisitTime,
        visitRequestLimit: formData.visitRequestLimit,
      };

      const result = await updateInstanceVisitConfig(instance.id, updateData);

      if (result.success) {
        setModalMessage('방문 설정이 성공적으로 저장되었습니다.');
        setSuccessModalOpen(true);
        // 상위 컴포넌트에 데이터 변경 알림
        onDataChange();
      } else {
        console.error('방문 설정 저장 실패:', result.errorMsg);
        setModalMessage(`방문 설정 저장에 실패했습니다: ${result.errorMsg}`);
        setErrorModalOpen(true);
      }
    } catch (error) {
      console.error('방문 설정 저장 중 오류:', error);
      setModalMessage('방문 설정 저장 중 오류가 발생했습니다.');
      setErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (!hasChanges) return;
    
    const confirmMessage = '수정된 내용을 모두 되돌리시겠습니까?';
    if (!confirm(confirmMessage)) return;
    
    setFormData(originalData);
  };
  // #endregion

  return (
    <div className="space-y-6">
      {/* 방문 설정 섹션 */}
      <TitleRow title="방문 설정" subtitle="호실의 방문 관련 설정을 관리합니다." />
      <GridForm 
        labelWidth="180px" 
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
          <GridForm.Label>
            방문 가능 시간 (분)
          </GridForm.Label>
          <GridForm.Content>
            <SimpleTextInput
              type="number"
              value={formData.availableVisitTime.toString()}
              onChange={(value) => handleFieldChange('availableVisitTime', parseInt(value) || 0)}
              placeholder="방문 가능 시간을 입력해주세요"
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
            구매한 방문 시간 (분)
          </GridForm.Label>
          <GridForm.Content>
            <SimpleTextInput
              type="number"
              value={formData.purchasedVisitTime.toString()}
              onChange={(value) => handleFieldChange('purchasedVisitTime', parseInt(value) || 0)}
              placeholder="구매한 방문 시간을 입력해주세요"
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
            방문 요청 한도
          </GridForm.Label>
          <GridForm.Content>
            <SimpleTextInput
              type="number"
              value={formData.visitRequestLimit.toString()}
              onChange={(value) => handleFieldChange('visitRequestLimit', parseInt(value) || 1)}
              placeholder="방문 요청 한도를 입력해주세요"
              disabled={isSubmitting}
              validationRule={{
                type: 'free',
                mode: 'edit'
              }}
            />
          </GridForm.Content>
        </GridForm.Row>
      </GridForm>

      {/* 방문 시간 통계 정보 */}
      <div className="p-4 mt-6 rounded-lg bg-muted">
        <h4 className="mb-2 text-sm font-medium text-foreground">방문 시간 현황</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">총 방문 시간:</span>
            <span className="ml-2 font-medium">
              {formData.availableVisitTime + formData.purchasedVisitTime}분
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">평균 요청당 시간:</span>
            <span className="ml-2 font-medium">
              {formData.visitRequestLimit > 0 
                ? Math.round((formData.availableVisitTime + formData.purchasedVisitTime) / formData.visitRequestLimit)
                : 0
              }분
            </span>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-border">
        <Button 
          variant="secondary" 
          onClick={handleReset}
          disabled={!hasChanges || isSubmitting}
          title={!hasChanges ? '변경사항이 없습니다' : '변경사항 되돌리기'}
        >
          <RotateCcw size={16} />
          복구
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={!isValid || isSubmitting}
          title={isSubmitting ? '저장 중...' : !isValid ? '변경사항이 없거나 유효하지 않습니다' : '설정 저장'}
        >
          <Save size={16} />
          {isSubmitting ? '저장 중...' : '저장'}
        </Button>
      </div>
      
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

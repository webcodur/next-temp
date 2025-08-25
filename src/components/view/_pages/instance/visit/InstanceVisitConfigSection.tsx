'use client';

import React, { useState, useMemo } from 'react';
import { Save, RotateCcw, CalendarCheck } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { SimpleNumberInput } from '@/components/ui/ui-input/simple-input/SimpleNumberInput';
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
        console.error('방문 설정 저장 실패:', '대상 작업에 실패했습니다.');
        // 에러 처리는 통합 모듈에서 담당
      }
    } catch (error) {
      console.error('방문 설정 저장 중 오류:', error);
      // 에러 처리는 통합 모듈에서 담당
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
        title="방문 설정" 
        subtitle="세대의 방문 관련 설정을 관리합니다."
        icon={<CalendarCheck size={18} />}
      >
        <div className="space-y-6">
          {/* 방문 시간 통계 정보 */}
          <div className="p-4 rounded-lg bg-muted">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* 총 방문 시간 */}
              <div>
                <span className="text-muted-foreground">총 방문 시간:</span>
                <span className="ml-2 font-medium">
                  {formData.availableVisitTime + formData.purchasedVisitTime}분
                </span>
              </div>
              {/* 평균 요청당 시간 */}
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

          {(() => {
        const fields: GridFormFieldSchema[] = [
          {
            id: 'availableVisitTime',
            label: '방문 가능 시간 (분)',
            rules: '0 이상 숫자',
            component: (
              <SimpleNumberInput
                value={formData.availableVisitTime}
                onChange={(value) => handleFieldChange('availableVisitTime', typeof value === 'number' ? value : 0)}
                placeholder="방문 가능 시간"
                disabled={isSubmitting}
                min={0}
              />
            )
          },
          {
            id: 'purchasedVisitTime',
            label: '구매한 방문 시간 (분)',
            rules: '0 이상 숫자',
            component: (
              <SimpleNumberInput
                value={formData.purchasedVisitTime}
                onChange={(value) => handleFieldChange('purchasedVisitTime', typeof value === 'number' ? value : 0)}
                placeholder="구매 방문 시간"
                disabled={isSubmitting}
                min={0}
              />
            )
          },
          {
            id: 'visitRequestLimit',
            label: '방문 요청 한도',
            rules: '1 이상 숫자',
            component: (
              <SimpleNumberInput
                value={formData.visitRequestLimit}
                onChange={(value) => handleFieldChange('visitRequestLimit', typeof value === 'number' ? value : 1)}
                placeholder="방문 요청 한도"
                disabled={isSubmitting}
                min={1}
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
        </div>
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

      {/* 오류 모달 제거됨 - 통합 모듈에서 처리 */}
    </div>
  );
}

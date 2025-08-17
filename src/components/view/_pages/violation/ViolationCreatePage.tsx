'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import ViolationForm, { ViolationFormData } from './ViolationForm';
import { AlertTriangle } from 'lucide-react';
import { createViolation } from '@/services/violations';
import type { 
  CreateCarViolationRequest
} from '@/types/carViolation';

// #region 타입 정의
// ViolationFormData는 ViolationForm.tsx에서 import
// #endregion

// #region 상수 정의
const INITIAL_FORM_DATA: ViolationFormData = {
  carNumber: '',
  violationType: 'UNAUTHORIZED_PARKING',
  violationCode: 'VP001',
  violationLocation: '',
  violationTime: null,
  description: '',
  evidenceImageUrls: [],
  reporterType: 'ADMIN',
  reporterId: '',
  severityLevel: 1,
  penaltyPoints: 1,
};
// #endregion

export default function ViolationCreatePage() {
  const router = useRouter();

  // #region 상태 관리
  const [formData, setFormData] = useState<ViolationFormData>(INITIAL_FORM_DATA);
  const [originalData] = useState<ViolationFormData>(INITIAL_FORM_DATA); // create 모드에서는 변경하지 않음
  const [creating, setCreating] = useState(false);
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);
  const [blacklistedCarNumber, setBlacklistedCarNumber] = useState('');
  // #endregion

  // #region 변경 감지 및 유효성 검사
  const hasChanges = useMemo(() => {
    return (
      formData.carNumber !== originalData.carNumber ||
      formData.violationType !== originalData.violationType ||
      formData.violationCode !== originalData.violationCode ||
      formData.violationLocation !== originalData.violationLocation ||
      formData.violationTime !== originalData.violationTime ||
      formData.description !== originalData.description ||
      JSON.stringify(formData.evidenceImageUrls) !== JSON.stringify(originalData.evidenceImageUrls) ||
      formData.reporterType !== originalData.reporterType ||
      formData.reporterId !== originalData.reporterId ||
      formData.severityLevel !== originalData.severityLevel ||
      formData.penaltyPoints !== originalData.penaltyPoints
    );
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    return Boolean(
      formData.carNumber.trim() &&
      formData.violationCode.trim() &&
      formData.violationTime &&
      formData.severityLevel >= 1 &&
      formData.penaltyPoints >= 1
    );
  }, [formData]);

  const canCreate = useMemo(() => {
    return isValid && !creating;
  }, [isValid, creating]);
  // #endregion

  // #region 이벤트 핸들러
  const handleFormChange = useCallback((data: ViolationFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const handleCancel = useCallback(() => {
    router.push('/parking/violation/history');
  }, [router]);

  const handleCreate = useCallback(async () => {
    if (!canCreate) return;

    // 위반 시각이 필수이므로 추가 검증
    if (!formData.violationTime) {
      console.error('위반 시각은 필수입니다.');
      return;
    }

    try {
      setCreating(true);
      
      const createRequest: CreateCarViolationRequest = {
        carNumber: formData.carNumber.trim(),
        violationType: formData.violationType,
        violationCode: formData.violationCode,
        violationLocation: formData.violationLocation.trim() || undefined,
        violationTime: formData.violationTime.toISOString(),
        description: formData.description.trim() || undefined,
        evidenceImageUrls: formData.evidenceImageUrls.length > 0 
          ? formData.evidenceImageUrls
          : undefined,
        reporterType: formData.reporterType,
        reporterId: formData.reporterId ? parseInt(formData.reporterId) : undefined,
        severityLevel: formData.severityLevel,
        penaltyPoints: formData.penaltyPoints,
      };

      const result = await createViolation(createRequest);
      if (result.success && result.data) {
        // 자동 블랙리스트 등록 여부 확인
        if (result.data.isAutoBlacklisted) {
          setBlacklistedCarNumber(result.data.carNumber);
          setShowBlacklistModal(true);
        } else {
          router.push('/parking/violation/history');
        }
      } else {
        console.error('위반 기록 생성 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('위반 기록 생성 중 오류:', error);
    } finally {
      setCreating(false);
    }
  }, [canCreate, formData, router]);

  const handleBlacklistModalClose = useCallback(() => {
    setShowBlacklistModal(false);
    setBlacklistedCarNumber('');
    router.push('/parking/violation/history');
  }, [router]);

  const handleGoToBlacklist = useCallback(() => {
    setShowBlacklistModal(false);
    setBlacklistedCarNumber('');
    router.push('/parking/violation/blacklist');
  }, [router]);
  // #endregion

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* 페이지 헤더 */}
        <PageHeader
          title="위반 기록 추가"
          subtitle="새로운 차량 위반 기록을 등록합니다"
        />

        {/* 위반 기록 생성 섹션 */}
        <SectionPanel 
          title="위반 기록 정보"
          subtitle="새로운 차량 위반 기록의 상세 정보를 입력합니다"
          icon={<AlertTriangle size={18} />}
        >
          <ViolationForm
            mode="create"
            data={formData}
            onChange={handleFormChange}
            disabled={creating}
            showActions={true}
            onReset={handleReset}
            onSubmit={handleCreate}
            onCancel={handleCancel}
            hasChanges={hasChanges}
            isValid={isValid}
          />
        </SectionPanel>
      </div>

      {/* 블랙리스트 모달 */}
      <Modal
        isOpen={showBlacklistModal}
        onClose={handleBlacklistModalClose}
        size="md"
      >
        <div className="flex gap-3 items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">자동 블랙리스트 등록</h3>
        </div>
        
        <div className="mb-6">
          <p className="mb-3 text-gray-700">
            차량번호 <strong>{blacklistedCarNumber}</strong>가 3회 위반으로 인해 자동으로 블랙리스트에 등록되었습니다.
          </p>
          <p className="text-sm text-gray-600">
            해당 차량은 주차장 이용이 제한되며, 관리자 승인 후 이용이 가능합니다.
          </p>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            onClick={handleBlacklistModalClose}
          >
            확인
          </Button>
          <Button
            variant="primary"
            onClick={handleGoToBlacklist}
          >
            블랙리스트 목록 보기
          </Button>
        </div>
      </Modal>
    </>
  );
}
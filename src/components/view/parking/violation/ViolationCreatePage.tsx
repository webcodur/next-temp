'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';

import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { ImageUrlInput } from '@/components/ui/ui-input/simple-input/ImageUrlInput';
import { PickDate } from '@/components/ui/ui-input/datepicker/Datepicker';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { createViolation } from '@/services/violations';
import type { 
  CreateCarViolationRequest,
  CarViolationType,
  ViolationReporterType
} from '@/types/carViolation';

// #region 타입 정의
interface FormData {
  carNumber: string;
  violationType: CarViolationType;
  violationCode: string;
  violationLocation: string;
  violationTime: Date | null;
  description: string;
  evidenceImageUrls: string[];
  reporterType: ViolationReporterType;
  reporterId: string;
  severityLevel: number;
  penaltyPoints: number;
}
// #endregion

// #region 상수 정의
const VIOLATION_TYPE_OPTIONS = [
  { value: 'UNAUTHORIZED_PARKING', label: '무단 주차' },
  { value: 'OVERTIME_PARKING', label: '초과 주차' },
  { value: 'RESERVED_SPOT_VIOLATION', label: '지정석 위반' },
  { value: 'FIRE_LANE_PARKING', label: '소방차로 주차' },
  { value: 'DISABLED_SPOT_VIOLATION', label: '장애인 구역 위반' },
  { value: 'DOUBLE_PARKING', label: '이중 주차' },
  { value: 'BLOCKING_EXIT', label: '출구 차단' },
  { value: 'NO_PERMIT_PARKING', label: '허가증 없는 주차' },
  { value: 'EXPIRED_PERMIT', label: '허가증 만료' },
  { value: 'SPEEDING', label: '과속' },
  { value: 'NOISE_VIOLATION', label: '소음 위반' },
  { value: 'VANDALISM', label: '기물 파손' },
  { value: 'OTHER', label: '기타' },
];

const VIOLATION_CODE_MAPPING: Record<CarViolationType, string> = {
  UNAUTHORIZED_PARKING: 'VP001',
  OVERTIME_PARKING: 'VP002',
  RESERVED_SPOT_VIOLATION: 'VP003',
  FIRE_LANE_PARKING: 'VP004',
  DISABLED_SPOT_VIOLATION: 'VP005',
  DOUBLE_PARKING: 'VP006',
  BLOCKING_EXIT: 'VP007',
  NO_PERMIT_PARKING: 'VP008',
  EXPIRED_PERMIT: 'VP009',
  SPEEDING: 'VP010',
  NOISE_VIOLATION: 'VP011',
  VANDALISM: 'VP012',
  OTHER: 'VP013',
};

const REPORTER_TYPE_OPTIONS = [
  { value: 'SYSTEM', label: '시스템' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'RESIDENT', label: '입주민' },
  { value: 'SECURITY', label: '경비원' },
];

const INITIAL_FORM_DATA: FormData = {
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
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [creating, setCreating] = useState(false);
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);
  const [blacklistedCarNumber, setBlacklistedCarNumber] = useState('');
  // #endregion

  // #region 폼 유효성 검사
  const isFormValid = useMemo(() => {
    return (
      formData.carNumber.trim() !== '' &&
      formData.violationCode.trim() !== '' &&
      formData.violationTime !== null &&
      formData.severityLevel >= 1 &&
      formData.penaltyPoints >= 1
    );
  }, [formData]);

  const canCreate = useMemo(() => {
    return isFormValid && !creating;
  }, [isFormValid, creating]);
  // #endregion

  // #region 이벤트 핸들러
  const handleInputChange = useCallback((field: keyof FormData, value: string | string[] | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

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
        violationCode: formData.violationType,
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
          leftActions={
            <Button variant="ghost" onClick={handleCancel}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              뒤로가기
            </Button>
          }
        />

        {/* 메인 폼 */}
        <div className="p-6 rounded-lg border bg-card border-border">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SimpleTextInput
              label="차량번호 *"
              value={formData.carNumber}
              onChange={(value) => handleInputChange('carNumber', value)}
              placeholder="차량번호를 입력하세요 (예: 12가3456)"
            />
            
            <SimpleDropdown
              label="위반 유형 *"
              value={formData.violationType}
              options={VIOLATION_TYPE_OPTIONS}
              onChange={(value) => {
                const selectedViolationType = value as CarViolationType;
                handleInputChange('violationType', selectedViolationType);
                handleInputChange('violationCode', VIOLATION_CODE_MAPPING[selectedViolationType]);
              }}
            />
            
            <SimpleDropdown
              label="위반 코드 *"
              value={formData.violationCode}
              options={VIOLATION_TYPE_OPTIONS.map(option => ({
                value: VIOLATION_CODE_MAPPING[option.value as CarViolationType],
                label: `${VIOLATION_CODE_MAPPING[option.value as CarViolationType]} - ${option.label}`
              }))}
              onChange={(value) => {
                handleInputChange('violationCode', value);
                // 위반 코드에 해당하는 위반 유형도 함께 업데이트
                const violationType = Object.entries(VIOLATION_CODE_MAPPING).find(
                  ([, code]) => code === value
                )?.[0] as CarViolationType;
                if (violationType) {
                  handleInputChange('violationType', violationType);
                }
              }}
            />
            
            <SimpleTextInput
              label="위반 장소"
              value={formData.violationLocation}
              onChange={(value) => handleInputChange('violationLocation', value)}
              placeholder="위반 발생 장소를 입력하세요"
            />
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                위반 시각 *
              </label>
              <PickDate
                selected={formData.violationTime}
                onChange={(date) => handleInputChange('violationTime', date)}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="위반 시각을 선택하세요"
                showTimeSelect={true}
                className="w-full"
              />
            </div>
            
            <SimpleDropdown
              label="신고자 유형"
              value={formData.reporterType}
              options={REPORTER_TYPE_OPTIONS}
              onChange={(value) => handleInputChange('reporterType', value)}
            />
            
            <SimpleTextInput
              label="신고자 ID"
              type="number"
              value={formData.reporterId}
              onChange={(value) => handleInputChange('reporterId', value)}
              placeholder="신고자 사용자 ID를 입력하세요"
            />
            
            <SimpleTextInput
              label="심각도 *"
              type="number"
              value={formData.severityLevel.toString()}
              onChange={(value) => handleInputChange('severityLevel', (parseInt(value) || 1).toString())}
            />
            
            <SimpleTextInput
              label="벌점 *"
              type="number"
              value={formData.penaltyPoints.toString()}
              onChange={(value) => {
                const numValue = parseInt(value) || 1;
                const clampedValue = Math.max(1, numValue);
                handleInputChange('penaltyPoints', clampedValue.toString());
              }}
            />
            
            <div className="md:col-span-2">
              <SimpleTextInput
                label="설명"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="위반 상황에 대한 설명을 입력하세요"
              />
            </div>
            
            <div className="md:col-span-2">
              <ImageUrlInput
                label="증거 이미지 URL"
                value={formData.evidenceImageUrls}
                onChange={(value) => handleInputChange('evidenceImageUrls', value)}
                placeholder="이미지 URL을 입력하세요"
                maxImages={5}
              />
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={creating}
          >
            취소
          </Button>
          
          <Button
            onClick={handleCreate}
            disabled={!canCreate}
            loading={creating}
          >
            등록
          </Button>
        </div>
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
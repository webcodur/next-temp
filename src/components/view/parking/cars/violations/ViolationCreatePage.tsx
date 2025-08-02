'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/ui-input/button/Button';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { ArrowLeft } from 'lucide-react';
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
  violationTime: string;
  description: string;
  evidenceImageUrls: string;
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

const REPORTER_TYPE_OPTIONS = [
  { value: 'SYSTEM', label: '시스템' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'RESIDENT', label: '입주민' },
  { value: 'SECURITY', label: '경비원' },
];

const INITIAL_FORM_DATA: FormData = {
  carNumber: '',
  violationType: 'UNAUTHORIZED_PARKING',
  violationCode: '',
  violationLocation: '',
  violationTime: '',
  description: '',
  evidenceImageUrls: '',
  reporterType: 'ADMIN',
  reporterId: '',
  severityLevel: 1,
  penaltyPoints: 0,
};
// #endregion

export default function ViolationCreatePage() {
  const router = useRouter();

  // #region 상태 관리
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [creating, setCreating] = useState(false);
  // #endregion

  // #region 폼 유효성 검사
  const isFormValid = useMemo(() => {
    return (
      formData.carNumber.trim() !== '' &&
      formData.violationCode.trim() !== '' &&
      formData.violationTime !== '' &&
      formData.severityLevel >= 1 &&
      formData.penaltyPoints >= 0
    );
  }, [formData]);

  const canCreate = useMemo(() => {
    return isFormValid && !creating;
  }, [isFormValid, creating]);
  // #endregion

  // #region 이벤트 핸들러
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCancel = useCallback(() => {
    router.push('/parking/cars/violation');
  }, [router]);

  const handleCreate = useCallback(async () => {
    if (!canCreate) return;

    try {
      setCreating(true);
      
      const createRequest: CreateCarViolationRequest = {
        carNumber: formData.carNumber.trim(),
        violationType: formData.violationType,
        violationCode: formData.violationCode.trim(),
        violationLocation: formData.violationLocation.trim() || undefined,
        violationTime: formData.violationTime,
        description: formData.description.trim() || undefined,
        evidenceImageUrls: formData.evidenceImageUrls 
          ? formData.evidenceImageUrls.split('\n').filter(url => url.trim())
          : undefined,
        reporterType: formData.reporterType,
        reporterId: formData.reporterId ? parseInt(formData.reporterId) : undefined,
        severityLevel: formData.severityLevel,
        penaltyPoints: formData.penaltyPoints,
      };

      const result = await createViolation(createRequest);
      
      if (result.success && result.data) {
        console.log('위반 기록이 성공적으로 생성되었습니다');
        router.push('/parking/cars/violation');
      } else {
        console.error('위반 기록 생성 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('위반 기록 생성 중 오류:', error);
    } finally {
      setCreating(false);
    }
  }, [canCreate, formData, router]);
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>
        <div>
          <h1 className="text-2xl font-bold">위반 기록 추가</h1>
          <p className="text-muted-foreground">
            새로운 차량 위반 기록을 등록한다
          </p>
        </div>
      </div>

      {/* 메인 폼 */}
      <div className="bg-card rounded-lg border border-border p-6">
        <GridForm labelWidth="120px">
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
            onChange={(value) => handleInputChange('violationType', value)}

          />
          
          <SimpleTextInput
            label="위반 코드 *"
            value={formData.violationCode}
            onChange={(value) => handleInputChange('violationCode', value)}
            placeholder="위반 코드를 입력하세요 (예: VP001)"

          />
          
          <SimpleTextInput
            label="위반 장소"
            value={formData.violationLocation}
            onChange={(value) => handleInputChange('violationLocation', value)}
            placeholder="위반 발생 장소를 입력하세요"
          />
          
          <SimpleTextInput
            label="위반 시각 *"
            type="datetime-local"
            value={formData.violationTime}
            onChange={(value) => handleInputChange('violationTime', value)}

          />
          
          <SimpleTextInput
            label="설명"
            value={formData.description}
            onChange={(value) => handleInputChange('description', value)}
            placeholder="위반 상황에 대한 설명을 입력하세요"

          />
          
          <SimpleTextInput
            label="증거 이미지 URL"
            value={formData.evidenceImageUrls}
            onChange={(value) => handleInputChange('evidenceImageUrls', value)}
            placeholder="이미지 URL을 줄바꿈으로 구분하여 입력하세요"

          />
          
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
            onChange={(value) => handleInputChange('penaltyPoints', (parseInt(value) || 0).toString())}


          />
        </GridForm>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end gap-2">
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
  );
}
'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleCheckbox } from '@/components/ui/ui-input/simple-input/SimpleCheckbox';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { getCarViolationDetail, updateCarViolation, processCarViolation } from '@/services/carViolations';
import type { 
  CarViolation, 
  UpdateCarViolationRequest,
  ProcessCarViolationRequest,
  CarViolationType,
  ViolationStatus,
  ViolationReporterType
} from '@/types/carViolation';

// #region 타입 정의
interface ViolationDetailPageProps {
  id: number;
}

interface FormData {
  description: string;
  evidenceImageUrls: string;
  severityLevel: number;
  penaltyPoints: number;
  status: ViolationStatus;
  processingNote: string;
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

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'PROCESSED', label: '처리됨' },
  { value: 'DISMISSED', label: '기각됨' },
  { value: 'APPEALED', label: '이의제기' },
  { value: 'CANCELLED', label: '취소됨' },
];

const REPORTER_TYPE_OPTIONS = [
  { value: 'SYSTEM', label: '시스템' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'RESIDENT', label: '입주민' },
  { value: 'SECURITY', label: '경비원' },
];
// #endregion

// #region 유틸리티 함수
function getViolationTypeText(type: CarViolationType): string {
  return VIOLATION_TYPE_OPTIONS.find(option => option.value === type)?.label || type;
}

function getReporterTypeText(type: ViolationReporterType): string {
  return REPORTER_TYPE_OPTIONS.find(option => option.value === type)?.label || type;
}

function violationToFormData(violation: CarViolation): FormData {
  return {
    description: violation.description || '',
    evidenceImageUrls: violation.evidenceImageUrls?.join('\n') || '',
    severityLevel: violation.severityLevel,
    penaltyPoints: violation.penaltyPoints,
    status: violation.status,
    processingNote: violation.processingNote || '',
  };
}
// #endregion

export default function ViolationDetailPage({ id }: ViolationDetailPageProps) {
  const router = useRouter();

  // #region 상태 관리
  const [violation, setViolation] = useState<CarViolation | null>(null);
  const [originalData, setOriginalData] = useState<CarViolation | null>(null);
  const [formData, setFormData] = useState<FormData>({
    description: '',
    evidenceImageUrls: '',
    severityLevel: 1,
    penaltyPoints: 0,
    status: 'ACTIVE',
    processingNote: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  // #endregion

  // #region 데이터 로드
  const loadViolation = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getCarViolationDetail(id);
      
      if (result.success && result.data) {
        setViolation(result.data);
        setOriginalData(result.data);
        setFormData(violationToFormData(result.data));
      } else {
        console.error('위반 기록 로딩 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('위반 기록 로딩 중 오류:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadViolation();
  }, [loadViolation]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    if (!originalData) return false;
    
    const original = violationToFormData(originalData);
    return JSON.stringify(original) !== JSON.stringify(formData);
  }, [originalData, formData]);

  const canSave = useMemo(() => {
    return hasChanges && !saving && !processing;
  }, [hasChanges, saving, processing]);
  // #endregion

  // #region 이벤트 핸들러
  const handleInputChange = useCallback((field: keyof FormData, value: string | number | ViolationStatus) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleReset = useCallback(() => {
    if (originalData) {
      setFormData(violationToFormData(originalData));
    }
  }, [originalData]);

  const handleSave = useCallback(async () => {
    if (!canSave || !violation) return;

    try {
      setSaving(true);
      
      const updateRequest: UpdateCarViolationRequest = {
        description: formData.description || undefined,
        evidenceImageUrls: formData.evidenceImageUrls 
          ? formData.evidenceImageUrls.split('\n').filter(url => url.trim())
          : undefined,
        severityLevel: formData.severityLevel,
        penaltyPoints: formData.penaltyPoints,
        status: formData.status,
      };

      const result = await updateCarViolation(violation.id, updateRequest);
      
      if (result.success && result.data) {
        setViolation(result.data);
        setOriginalData(result.data);
        setFormData(violationToFormData(result.data));
        console.log('위반 기록이 성공적으로 저장되었습니다');
      } else {
        console.error('위반 기록 저장 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('위반 기록 저장 중 오류:', error);
    } finally {
      setSaving(false);
    }
  }, [canSave, violation, formData]);

  const handleProcess = useCallback(async () => {
    if (!violation || !formData.processingNote.trim()) return;

    try {
      setProcessing(true);
      
      const processRequest: ProcessCarViolationRequest = {
        processingNote: formData.processingNote,
        status: formData.status,
      };

      const result = await processCarViolation(violation.id, processRequest);
      
      if (result.success && result.data) {
        setViolation(result.data);
        setOriginalData(result.data);
        setFormData(violationToFormData(result.data));
        console.log('위반 기록 처리가 완료되었습니다');
      } else {
        console.error('위반 기록 처리 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('위반 기록 처리 중 오류:', error);
    } finally {
      setProcessing(false);
    }
  }, [violation, formData.processingNote, formData.status]);

  const handleBack = useCallback(() => {
    router.push('/parking/cars/violation');
  }, [router]);
  // #endregion

  if (loading) {
    return <div className="flex justify-center p-8">로딩 중...</div>;
  }

  if (!violation) {
    return <div className="flex justify-center p-8">위반 기록을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="위반 차량 상세" 
        subtitle={`차량 위반 기록의 상세 정보를 조회하고 관리합니다. | 차량번호: ${violation.carNumber} | 위반 ID: ${violation.id}`}
        leftActions={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            title="뒤로가기"
          >
            <ArrowLeft size={16} />
          </Button>
        }
      />

      {/* 메인 폼 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <GridForm labelWidth="150px">
          {/* 시스템 생성 필드 (읽기 전용) */}
          <GridForm.Row>
            <GridForm.Label>위반 ID</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={violation.id.toString()}
                disabled
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>차량번호</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={violation.carNumber}
                disabled
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>위반 유형</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={getViolationTypeText(violation.violationType)}
                disabled
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>위반 코드</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={violation.violationCode}
                disabled
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>위반 장소</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={violation.violationLocation || ''}
                disabled
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>위반 시각</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={new Date(violation.violationTime).toLocaleString('ko-KR')}
                disabled
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>신고자 유형</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={getReporterTypeText(violation.reporterType)}
                disabled
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>처리 완료</GridForm.Label>
            <GridForm.Content>
              <SimpleCheckbox
                checked={violation.isProcessed}
                disabled
              />
            </GridForm.Content>
          </GridForm.Row>
          
          {violation.processedAt && (
            <GridForm.Row>
              <GridForm.Label>처리 시각</GridForm.Label>
              <GridForm.Content>
                <SimpleTextInput
                  value={new Date(violation.processedAt).toLocaleString('ko-KR')}
                  disabled
                />
              </GridForm.Content>
            </GridForm.Row>
          )}
          
          <GridForm.Row>
            <GridForm.Label>생성일</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={new Date(violation.createdAt).toLocaleString('ko-KR')}
                disabled
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>수정일</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                value={new Date(violation.updatedAt).toLocaleString('ko-KR')}
                disabled
              />
            </GridForm.Content>
          </GridForm.Row>

          {/* 편집 가능한 필드 */}
          <GridForm.Row>
            <GridForm.Label>설명</GridForm.Label>
            <GridForm.Content>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="위반 상황에 대한 설명을 입력하세요"
                rows={3}
                className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>증거 이미지 URL</GridForm.Label>
            <GridForm.Content>
              <textarea
                value={formData.evidenceImageUrls}
                onChange={(e) => handleInputChange('evidenceImageUrls', e.target.value)}
                placeholder="이미지 URL을 줄바꿈으로 구분하여 입력하세요"
                rows={3}
                className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>심각도</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                type="number"
                value={formData.severityLevel.toString()}
                onChange={(value) => handleInputChange('severityLevel', parseInt(value) || 1)}
                placeholder="1-10 사이의 값"
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>벌점</GridForm.Label>
            <GridForm.Content>
              <SimpleTextInput
                type="number"
                value={formData.penaltyPoints.toString()}
                onChange={(value) => handleInputChange('penaltyPoints', parseInt(value) || 0)}
                placeholder="0-100 사이의 값"
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>상태</GridForm.Label>
            <GridForm.Content>
              <SimpleDropdown
                value={formData.status}
                options={STATUS_OPTIONS}
                onChange={(value) => handleInputChange('status', value as ViolationStatus)}
                placeholder="상태를 선택하세요"
              />
            </GridForm.Content>
          </GridForm.Row>
          
          <GridForm.Row>
            <GridForm.Label>처리 메모</GridForm.Label>
            <GridForm.Content>
              <textarea
                value={formData.processingNote}
                onChange={(e) => handleInputChange('processingNote', e.target.value)}
                placeholder="처리 관련 메모를 입력하세요"
                rows={3}
                className="p-2 w-full rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </GridForm.Content>
          </GridForm.Row>
        </GridForm>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2 justify-end">
        <Button
          variant="ghost"
          onClick={handleReset}
          disabled={!hasChanges || saving || processing}
        >
          <RotateCcw className="mr-2 w-4 h-4" />
          초기화
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={!canSave || saving}
        >
          {saving ? '저장 중...' : '저장'}
        </Button>
        
        <Button
          variant="accent"
          onClick={handleProcess}
          disabled={!formData.processingNote.trim() || processing || saving}
        >
          {processing ? '처리 중...' : '처리 완료'}
        </Button>
      </div>
    </div>
  );
}
'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
// import { useRouter } from 'next/navigation';


import { Button } from '@/components/ui/ui-input/button/Button';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleNumberInput } from '@/components/ui/ui-input/simple-input/SimpleNumberInput';
import { SimpleTextArea } from '@/components/ui/ui-input/simple-input/SimpleTextArea';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { SimpleCheckbox } from '@/components/ui/ui-input/simple-input/SimpleCheckbox';
import { SimpleDatePicker } from '@/components/ui/ui-input/simple-input/time/SimpleDatePicker';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import AdminSelectModal from '@/components/ui/ui-layout/modal/AdminSelectModal';
import { ImagePreview, ImageData } from '@/components/ui/ui-effects/image-preview/ImagePreview';
import { RotateCcw, Eye, ImageIcon, AlertTriangle, Info, Edit, User, Search } from 'lucide-react';
import Image from 'next/image';
import { getViolationDetail, updateViolation, processViolation } from '@/services/violations';
import type { 
  CarViolation, 
  UpdateCarViolationRequest,
  ProcessCarViolationRequest,
  CarViolationType,
  ViolationStatus,
  ViolationReporterType
} from '@/types/carViolation';
import type { Admin } from '@/types/admin';

// #region 타입 정의
interface ViolationDetailPageProps {
  id: number;
}

interface ProcessFormData {
  status: ViolationStatus;
  processingNote: string;
}

interface EditFormData {
  description: string;
  evidenceImageUrls: string;
  severityLevel: number;
  penaltyPoints: number;
  status: ViolationStatus;
  processingNote: string;
  reporterId: string;
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

function violationToProcessForm(violation: CarViolation): ProcessFormData {
  return {
    status: violation.status,
    processingNote: violation.processingNote || '',
  };
}

function violationToEditForm(violation: CarViolation): EditFormData {
  return {
    description: violation.description || '',
    evidenceImageUrls: Array.isArray(violation.evidenceImageUrls) 
      ? violation.evidenceImageUrls.join('\n') 
      : '',
    severityLevel: violation.severityLevel,
    penaltyPoints: violation.penaltyPoints,
    status: violation.status,
    processingNote: violation.processingNote || '',
    reporterId: violation.reporterId?.toString() || '',
  };
}

function parseImageUrls(urlsText: string): string[] {
  return urlsText
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)
    .map(url => {
      // URL 유효성 검사 및 임시 조치
      try {
        // 기본 URL 형식 검사
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
          // 상대 경로나 잘못된 URL인 경우 기본 이미지로 대체
          return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0NCA4OC41NDQ0IDgxIDEwMCA4MUMxMTAuNDU2IDgxIDExOSA4OS41NDQ0IDExOSAxMDBDMTE5IDExMC40NTYgMTEwLjQ1NiAxMTkgMTAwIDExOUM4OC41NDQ0IDExOSA4MCAxMTAuNDU2IDgwIDEwMFoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+';
        }
        return url;
      } catch {
        // URL 파싱 실패 시 기본 이미지 반환
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0NCA4OC41NDQ0IDgxIDEwMCA4MUMxMTAuNDU2IDgxIDExOSA4OS41NDQ0IDExOSAxMDBDMTE5IDExMC40NTYgMTEwLjQ1NiAxMTkgMTAwIDExOUM4OC41NDQ0IDExOSA4MCAxMTAuNDU2IDgwIDEwMFoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+';
      }
    });
}

function urlsToImageData(urls: string[]): ImageData[] {
  return urls.map((url, index) => ({
    src: url,
    alt: `증거 이미지 ${index + 1}`,
    title: `증거 이미지 ${index + 1}`,
    description: `위반 차량의 증거 이미지입니다.`,
  }));
}
// #endregion

export default function ViolationDetailPage({ id }: ViolationDetailPageProps) {
  // const router = useRouter();

  // #region 상태 관리
  const [violation, setViolation] = useState<CarViolation | null>(null);
  const [originalData, setOriginalData] = useState<CarViolation | null>(null);
  const [processForm, setProcessForm] = useState<ProcessFormData>({
    status: 'ACTIVE',
    processingNote: '',
  });
  const [editForm, setEditForm] = useState<EditFormData>({
    description: '',
    evidenceImageUrls: '',
    severityLevel: 1,
    penaltyPoints: 0,
    status: 'ACTIVE',
    processingNote: '',
    reporterId: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // 관리자 선택 모달 관련 상태
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showAdminSelectModal, setShowAdminSelectModal] = useState(false);
  // #endregion

  // #region 데이터 로드
  const loadViolation = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getViolationDetail(id);
      
      if (result.success && result.data) {
        setViolation(result.data);
        setOriginalData(result.data);
        setProcessForm(violationToProcessForm(result.data));
        setEditForm(violationToEditForm(result.data));
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
  const hasEditChanges = useMemo(() => {
    if (!originalData) return false;
    
    const original = violationToEditForm(originalData);
    return JSON.stringify(original) !== JSON.stringify(editForm);
  }, [originalData, editForm]);

  const canSave = useMemo(() => {
    return hasEditChanges && !saving && !processing;
  }, [hasEditChanges, saving, processing]);

  const canProcess = useMemo(() => {
    return processForm.processingNote.trim() && !processing && !saving;
  }, [processForm.processingNote, processing, saving]);

  const imageUrls = useMemo(() => {
    return parseImageUrls(editForm.evidenceImageUrls);
  }, [editForm.evidenceImageUrls]);

  const imageData = useMemo(() => {
    return urlsToImageData(imageUrls);
  }, [imageUrls]);
  // #endregion

  // #region 이벤트 핸들러
  const handleProcessInputChange = useCallback((field: keyof ProcessFormData, value: string | ViolationStatus) => {
    setProcessForm(prev => ({ ...prev, [field]: value }));
    
    // 공통 필드는 편집 모듈과 동기화
    if (field === 'status' || field === 'processingNote') {
      setEditForm(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const handleEditInputChange = useCallback((field: keyof EditFormData, value: string | number | ViolationStatus) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
    
    // 공통 필드는 처리 모듈과 동기화
    if (field === 'status') {
      setProcessForm(prev => ({ ...prev, status: value as ViolationStatus }));
    } else if (field === 'processingNote') {
      setProcessForm(prev => ({ ...prev, processingNote: value as string }));
    }
  }, []);

  const handleEditReset = useCallback(() => {
    if (originalData) {
      const editData = violationToEditForm(originalData);
      const processData = violationToProcessForm(originalData);
      setEditForm(editData);
      setProcessForm(processData);
    }
  }, [originalData]);

  const handleSave = useCallback(async () => {
    if (!canSave || !violation) return;

    try {
      setSaving(true);
      
      const updateRequest: UpdateCarViolationRequest = {
        description: editForm.description || undefined,
        evidenceImageUrls: editForm.evidenceImageUrls 
          ? editForm.evidenceImageUrls.split('\n').filter(url => url.trim())
          : undefined,
        severityLevel: editForm.severityLevel,
        penaltyPoints: editForm.penaltyPoints,
        status: editForm.status,
        processingNote: editForm.processingNote || undefined,
        reporterId: editForm.reporterId ? parseInt(editForm.reporterId) : undefined,
      };

      const result = await updateViolation(violation.id, updateRequest);
      
      if (result.success && result.data) {
        setViolation(result.data);
        setOriginalData(result.data);
        setEditForm(violationToEditForm(result.data));
        console.log('위반 기록이 성공적으로 저장되었습니다');
      } else {
        console.error('위반 기록 저장 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('위반 기록 저장 중 오류:', error);
    } finally {
      setSaving(false);
    }
  }, [canSave, violation, editForm]);

  const handleProcess = useCallback(async () => {
    if (!violation || !processForm.processingNote.trim()) return;

    try {
      setProcessing(true);
      
      const processRequest: ProcessCarViolationRequest = {
        processingNote: processForm.processingNote,
        status: processForm.status,
      };

      const result = await processViolation(violation.id, processRequest);
      
      if (result.success && result.data) {
        setViolation(result.data);
        setOriginalData(result.data);
        setProcessForm(violationToProcessForm(result.data));
        setEditForm(violationToEditForm(result.data));
        console.log('위반 기록 처리가 완료되었습니다');
      } else {
        console.error('위반 기록 처리 실패:', result.errorMsg);
      }
    } catch (error) {
      console.error('위반 기록 처리 중 오류:', error);
    } finally {
      setProcessing(false);
    }
  }, [violation, processForm.processingNote, processForm.status]);



  const handleImagePreview = useCallback((index: number = 0) => {
    if (imageData.length === 0) return;
    setSelectedImageIndex(index);
    setImagePreviewOpen(true);
  }, [imageData.length]);

  const handleImagePreviewClose = useCallback(() => {
    setImagePreviewOpen(false);
  }, []);

  const handleAdminSelectOpen = useCallback(() => {
    setShowAdminSelectModal(true);
  }, []);

  const handleAdminSelectClose = useCallback(() => {
    setShowAdminSelectModal(false);
  }, []);

  const handleAdminSelect = useCallback((admin: Admin) => {
    setSelectedAdmin(admin);
    setEditForm(prev => ({
      ...prev,
      reporterId: admin.id.toString()
    }));
    setShowAdminSelectModal(false);
  }, []);
  // #endregion

  // #region 렌더링
  if (loading) {
    return <div className="flex justify-center p-8">로딩 중...</div>;
  }

  if (!violation) {
    return <div className="flex justify-center p-8">위반 기록을 찾을 수 없습니다.</div>;
  }

  // violation이 null이 아님을 보장한 후 사용

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={`위반 차량 상세 - ${violation.carNumber}`}
        subtitle={`${getViolationTypeText(violation.violationType)} | ${new Date(violation.violationTime).toLocaleDateString('ko-KR')}`}
      />

      {/* 퀵 메뉴 - 위반 기록 처리 */}
      {(() => {
        const fields: GridFormFieldSchema[] = [
          {
            id: 'status',
            label: '처리 상태',
            rules: '상태 선택',
            component: (
              <SimpleDropdown
                value={processForm.status}
                options={STATUS_OPTIONS}
                onChange={(value) => handleProcessInputChange('status', value as ViolationStatus)}
                placeholder="상태를 선택하세요"
              />
            )
          },
          {
            id: 'processingNote',
            label: '처리 메모',
            rules: '처리 내용 입력',
            component: (
              <SimpleTextArea
                value={processForm.processingNote}
                onChange={(value) => handleProcessInputChange('processingNote', value)}
                placeholder="처리 관련 메모를 입력하세요"
                rows={2}
              />
            )
          }
        ];
        return (
          <SectionPanel 
            title="빠른 처리" 
            subtitle="위반 사항을 빠르게 처리합니다."
            icon={<AlertTriangle size={18} />}
          >
            <GridFormAuto fields={fields} className="overflow-visible" />
              <div className="flex gap-2 justify-end mt-4">
                <Button
                  variant="primary"
                  onClick={handleProcess}
                  disabled={!canProcess}
                >
                  {processing ? '처리 중...' : '처리 완료'}
                </Button>
              </div>
          </SectionPanel>
        );
      })()}

      {/* 메인 상세 정보 */}
      {/* 위반 정보 필드 정의 */}
        {(() => {
          const readOnlyFields: GridFormFieldSchema[] = [
              {
                id: 'violationId',
                label: '위반 ID',
                rules: '자동 생성',
                component: (
                  <SimpleTextInput
                    value={violation.id.toString()}
                    disabled
                  />
                )
              },
              {
                id: 'carNumber',
                label: '차량번호',
                rules: '시스템 입력',
                component: (
                  <SimpleTextInput
                    value={violation.carNumber}
                    disabled
                  />
                )
              },
              {
                id: 'violationType',
                label: '위반 유형',
                rules: '위반 분류',
                component: (
                  <SimpleTextInput
                    value={getViolationTypeText(violation.violationType)}
                    disabled
                  />
                )
              },
              {
                id: 'violationCode',
                label: '위반 코드',
                rules: '시스템 코드',
                component: (
                  <SimpleTextInput
                    value={violation.violationCode}
                    disabled
                  />
                )
              },
              {
                id: 'violationLocation',
                label: '위반 장소',
                rules: '위반 위치',
                component: (
                  <SimpleTextInput
                    value={violation.violationLocation || ''}
                    disabled
                  />
                )
              },
              {
                id: 'violationTime',
                label: '위반 시각',
                rules: '발생 일시',
                component: (
                  <SimpleDatePicker
                    value={violation.violationTime}
                    onChange={() => {}}
                    disabled={true}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    showTimeSelect={true}
                    utcMode={true}
                    validationRule={{ type: 'free', mode: 'view' }}
                  />
                )
              },
              {
                id: 'reporterType',
                label: '신고자 유형',
                rules: '신고 주체',
                component: (
                  <SimpleTextInput
                    value={getReporterTypeText(violation.reporterType)}
                    disabled
                  />
                )
              },
              {
                id: 'isProcessed',
                label: '처리 완료',
                rules: '처리 상태',
                component: (
                  <SimpleCheckbox
                    checked={violation.isProcessed}
                    disabled
                  />
                )
              }
            ];

            // 처리 시각이 있는 경우 추가
            if (violation.processedAt) {
              readOnlyFields.push({
                id: 'processedAt',
                label: '처리 시각',
                rules: '완료 일시',
                component: (
                  <SimpleDatePicker
                    value={violation.processedAt || null}
                    onChange={() => {}}
                    disabled={true}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    showTimeSelect={true}
                    utcMode={true}
                    validationRule={{ type: 'free', mode: 'view' }}
                  />
                )
              });
            }

            // 생성일, 수정일 추가
            readOnlyFields.push(
              {
                id: 'createdAt',
                label: '생성일',
                rules: '등록 일시',
                component: (
                  <SimpleDatePicker
                    value={violation.createdAt}
                    onChange={() => {}}
                    disabled={true}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    showTimeSelect={true}
                    utcMode={true}
                    validationRule={{ type: 'free', mode: 'view' }}
                  />
                )
              },
              {
                id: 'updatedAt',
                label: '수정일',
                rules: '최종 변경',
                component: (
                  <SimpleDatePicker
                    value={violation.updatedAt}
                    onChange={() => {}}
                    disabled={true}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    showTimeSelect={true}
                    utcMode={true}
                    validationRule={{ type: 'free', mode: 'view' }}
                  />
                )
              }
            );

            return (
              <SectionPanel 
                title="위반 상세 정보" 
                subtitle="위반 사항의 상세 내용과 시스템 기록 정보입니다."
                icon={<Info size={18} />}
              >
                <GridFormAuto fields={readOnlyFields} />
              </SectionPanel>
            );
        })()}
          
        {/* 편집 가능한 필드 */}
        {(() => {
            const editableFields: GridFormFieldSchema[] = [
              {
                id: 'editStatus',
                label: '처리 상태',
                rules: '상태 변경',
                component: (
                  <SimpleDropdown
                    value={editForm.status}
                    options={STATUS_OPTIONS}
                    onChange={(value) => handleEditInputChange('status', value as ViolationStatus)}
                    placeholder="상태를 선택하세요"
                  />
                )
              },
              {
                id: 'editProcessingNote',
                label: '처리 메모',
                rules: '처리 내용',
                component: (
                  <SimpleTextArea
                    value={editForm.processingNote}
                    onChange={(value) => handleEditInputChange('processingNote', value)}
                    placeholder="처리 관련 메모를 입력하세요"
                    rows={2}
                  />
                )
              },
              {
                id: 'editDescription',
                label: '설명',
                rules: '상황 설명',
                component: (
                  <SimpleTextArea
                    value={editForm.description}
                    onChange={(value) => handleEditInputChange('description', value)}
                    placeholder="위반 상황에 대한 설명을 입력하세요"
                    rows={3}
                  />
                )
              },
              {
                id: 'editEvidenceImageUrls',
                label: '증거 이미지 URL',
                rules: '이미지 주소',
                component: (
              <div className="space-y-3">
                <SimpleTextArea
                  value={editForm.evidenceImageUrls}
                  onChange={(value) => handleEditInputChange('evidenceImageUrls', value)}
                  placeholder="이미지 URL을 줄바꿈으로 구분하여 입력하세요"
                  rows={3}
                />
                
                {/* 이미지 미리보기 섹션 */}
                {imageUrls.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium" style={{color: 'hsl(var(--foreground))'}}>
                        이미지 미리보기 ({imageUrls.length}개)
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleImagePreview(0)}
                        className="text-xs"
                      >
                        <Eye className="mr-1 w-3 h-3" />
                        전체보기
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {imageUrls.slice(0, 8).map((url, index) => (
                        <button
                          key={index}
                          onClick={() => handleImagePreview(index)}
                          className="overflow-hidden relative rounded border-2 transition-colors group aspect-square"
                          style={{
                            borderColor: 'hsl(var(--border))'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'hsl(var(--primary))';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'hsl(var(--border))';
                          }}
                          title={`이미지 ${index + 1} 보기`}
                          data-image-index={index}
                        >
                          <Image
                            src={url}
                            alt={`증거 이미지 ${index + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            onError={() => {
                              // 에러 발생 시 기본 이미지 아이콘 표시
                              const parent = document.querySelector(`[data-image-index="${index}"]`);
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="flex justify-center items-center w-full h-full" style="color: hsl(var(--muted-foreground)); background-color: hsl(var(--muted));">
                                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                    </svg>
                                  </div>
                                `;
                              }
                            }}
                            unoptimized
                          />
                          <div className="flex absolute inset-0 justify-center items-center transition-colors bg-black/0 group-hover:bg-black/20">
                            <Eye className="w-4 h-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        </button>
                      ))}
                      
                      {imageUrls.length > 8 && (
                        <button
                          onClick={() => handleImagePreview(8)}
                          className="flex overflow-hidden relative justify-center items-center rounded border-2 border-dashed transition-colors aspect-square"
                          style={{
                            backgroundColor: 'hsl(var(--muted))',
                            borderColor: 'hsl(var(--border))'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'hsl(var(--primary))';
                            e.currentTarget.style.backgroundColor = 'hsl(var(--muted) / 0.8)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'hsl(var(--border))';
                            e.currentTarget.style.backgroundColor = 'hsl(var(--muted))';
                          }}
                        >
                          <div className="text-center">
                            <ImageIcon className="mx-auto mb-1 w-4 h-4" style={{color: 'hsl(var(--muted-foreground))'}} />
                            <span className="text-xs" style={{color: 'hsl(var(--muted-foreground))'}}>
                              +{imageUrls.length - 8}
                            </span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}
                  </div>
                )
              },
              {
                id: 'editSeverityLevel',
                label: '심각도',
                rules: '1-10 범위',
                component: (
                  <SimpleNumberInput
                    value={editForm.severityLevel}
                    onChange={(value) => handleEditInputChange('severityLevel', typeof value === 'number' ? value : 1)}
                    placeholder="1-10 사이의 값"
                    min={1}
                    max={10}
                  />
                )
              },
              {
                id: 'editPenaltyPoints',
                label: '벌점',
                rules: '0-100 범위',
                component: (
                  <SimpleNumberInput
                    value={editForm.penaltyPoints}
                    onChange={(value) => handleEditInputChange('penaltyPoints', typeof value === 'number' ? value : 0)}
                    placeholder="0-100 사이의 값"
                    min={0}
                    max={100}
                  />
                )
              },
              {
                id: 'editReporterId',
                label: '신고자 선택',
                rules: '신고자를 선택하세요',
                component: (
                  <div className="flex gap-2 items-center">
                    {selectedAdmin ? (
                      // 선택된 관리자 정보 표시
                      <div className="flex-1 flex gap-3 items-center p-3 border rounded-md border-border bg-muted/50">
                        <div className="flex justify-center items-center w-8 h-8 rounded-full bg-primary/10">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {selectedAdmin.name} ({selectedAdmin.account})
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {selectedAdmin.id} | {selectedAdmin.role?.name || '권한 없음'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 선택되지 않은 상태
                      <div className="flex-1 flex gap-2 items-center p-3 border border-dashed rounded-md border-muted-foreground/30 bg-muted/20">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          신고자를 선택해주세요
                        </span>
                      </div>
                    )}
                    
                    {/* 선택 버튼 */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAdminSelectOpen}
                      disabled={saving || processing}
                      className="flex-shrink-0"
                    >
                      <Search className="w-4 h-4 mr-1" />
                      {selectedAdmin ? '변경' : '선택'}
                    </Button>
                  </div>
                )
              }
            ];

            return (
              <SectionPanel 
                title="위반 정보 수정" 
                subtitle="위반 사항의 상태 및 세부 정보를 수정할 수 있습니다."
                icon={<Edit size={18} />}
              >
                <GridFormAuto fields={editableFields} />
                  {/* 상세 정보 액션 버튼 */}
                  <div className="flex gap-2 justify-end mt-6">
                    <Button
                      variant="ghost"
                      onClick={handleEditReset}
                      disabled={!hasEditChanges || saving || processing}
                    >
                      <RotateCcw className="mr-2 w-4 h-4" />
                      초기화
                    </Button>
                    
                    <Button
                      onClick={handleSave}
                      disabled={!canSave}
                    >
                      {saving ? '저장 중...' : '저장'}
                    </Button>
                  </div>
              </SectionPanel>
            );
        })()}

      {/* 이미지 미리보기 모달 */}
      {imageData.length > 0 && (
        <ImagePreview
          images={imageData}
          isOpen={imagePreviewOpen}
          onClose={handleImagePreviewClose}
          initialIndex={selectedImageIndex}
          showThumbnails={true}
          enableZoom={true}
          enableRotation={true}
          enableDownload={true}
        />
      )}

      {/* 관리자 선택 모달 */}
      <AdminSelectModal
        isOpen={showAdminSelectModal}
        onClose={handleAdminSelectClose}
        onSelect={handleAdminSelect}
        title="신고자 선택"
        selectedAdminId={selectedAdmin?.id}
      />
    </div>
  );
  // #endregion
}
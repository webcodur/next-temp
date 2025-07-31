'use client';

import React, { useState, useEffect, useCallback, useMemo, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Lock, Unlock, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import { getHouseholdDetail } from '@/services/household/household@id_GET';
import { getHouseholdInstanceList } from '@/services/household/household@id_instance_GET';
import { updateHousehold } from '@/services/household/household@id_PUT';
import { deleteHousehold } from '@/services/household/household@id_DELETE';
import type { Household, HouseholdInstance, HouseholdType, UpdateHouseholdRequest } from '@/types/household';

interface HouseholdDetailPageProps {
  params: Promise<{ id: string }>;
}

// #region 타입 정의
interface HouseholdFormData {
  address1Depth: string;
  address2Depth: string;
  address3Depth: string;
  householdType: HouseholdType | '';
  memo: string;
}
// #endregion

export default function HouseholdDetailPage({ params }: HouseholdDetailPageProps) {
  // #region 상태 관리
  const resolvedParams = use(params);
  const router = useRouter();
  const [household, setHousehold] = useState<Household | null>(null);
  const [instances, setInstances] = useState<HouseholdInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<HouseholdFormData>({
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
    householdType: '',
    memo: '',
  });
  const [originalData, setOriginalData] = useState<HouseholdFormData>({
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
    householdType: '',
    memo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // #endregion

  // #region 데이터 로딩
  const loadHouseholdDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const id = parseInt(resolvedParams.id);
      if (isNaN(id)) {
        throw new Error('잘못된 호실 ID입니다.');
      }

      // 호실 상세 정보 조회
      const householdResponse = await getHouseholdDetail(id);
      if (!householdResponse.success) {
        throw new Error(householdResponse.errorMsg || '호실 정보 조회 실패');
      }

      // 호실의 인스턴스 목록 조회
      const instancesResponse = await getHouseholdInstanceList(id);
      if (!instancesResponse.success) {
        console.warn('인스턴스 목록 조회 실패:', instancesResponse.errorMsg);
        setInstances([]);
      } else {
        setInstances(instancesResponse.data?.data || []);
      }

      const householdData = householdResponse.data;
      setHousehold(householdData);

      // 폼 데이터 초기화
      const initialData = {
        address1Depth: householdData.address1Depth,
        address2Depth: householdData.address2Depth,
        address3Depth: householdData.address3Depth || '',
        householdType: householdData.householdType,
        memo: householdData.memo || '',
      };
      setFormData(initialData);
      setOriginalData(initialData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    loadHouseholdDetail();
  }, [loadHouseholdDetail]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    if (!isEditMode) return false;
    
    return (
      formData.address1Depth !== originalData.address1Depth ||
      formData.address2Depth !== originalData.address2Depth ||
      formData.address3Depth !== originalData.address3Depth ||
      formData.householdType !== originalData.householdType ||
      formData.memo !== originalData.memo
    );
  }, [formData, originalData, isEditMode]);

  const isValid = useMemo(() => {
    if (!isEditMode || !hasChanges) return false;
    
    return formData.address1Depth.trim() && 
           formData.address2Depth.trim() && 
           formData.householdType;
  }, [formData, isEditMode, hasChanges]);
  // #endregion

  // #region 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.address1Depth.trim()) {
      newErrors.address1Depth = '동을 입력해주세요.';
    }
    if (!formData.address2Depth.trim()) {
      newErrors.address2Depth = '호수를 입력해주세요.';
    }
    if (!formData.householdType) {
      newErrors.householdType = '세대 타입을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // #endregion

  // #region 이벤트 핸들러
  const handleEditToggle = useCallback(() => {
    if (isEditMode && hasChanges) {
      const confirmMessage = '편집 중인 내용이 있습니다. 정말로 취소하시겠습니까?';
      if (!confirm(confirmMessage)) return;
    }
    
    setIsEditMode(!isEditMode);
    
    // 편집 모드 해제 시 원래 데이터로 복원
    if (isEditMode) {
      setFormData(originalData);
      setErrors({});
    }
  }, [isEditMode, hasChanges, originalData]);

  const handleSave = async () => {
    if (!household || !validateForm() || !hasChanges) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData: UpdateHouseholdRequest = {
        address1Depth: formData.address1Depth,
        address2Depth: formData.address2Depth,
        address3Depth: formData.address3Depth || undefined,
        householdType: formData.householdType as HouseholdType,
        memo: formData.memo || undefined,
      };

      const response = await updateHousehold(household.id, requestData);
      
      if (response.success) {
        alert('호실 정보가 성공적으로 수정되었습니다.');
        // 데이터 새로고침
        await loadHouseholdDetail();
        setIsEditMode(false);
      } else {
        throw new Error(response.errorMsg || '수정 실패');
      }
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      alert(error instanceof Error ? error.message : '수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!household || !confirm('정말로 이 호실을 삭제하시겠습니까?')) return;
    
    try {
      const response = await deleteHousehold(household.id);
      if (response.success) {
        alert('호실이 삭제되었습니다.');
        router.push('/parking/household-management/household');
      } else {
        throw new Error(response.errorMsg || '삭제 실패');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
    }
  };

  const handleFieldChange = (field: keyof HouseholdFormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 제거
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleReset = () => {
    if (!household) return;
    
    setFormData(originalData);
    setErrors({});
  };
  // #endregion

  // #region 유틸리티 함수
  const formatRoomNumber = (household: Household) => {
    return `${household.address1Depth} ${household.address2Depth}${household.address3Depth ? ' ' + household.address3Depth : ''}`;
  };

  const getHouseholdTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      GENERAL: '일반 세대',
      TEMP: '임시 세대',
      COMMERCIAL: '상업 세대',
    };
    return typeMap[type] || type;
  };
  // #endregion

  // #region 액션 버튼
  const leftActions = (
    <Link
      href="/parking/household-management/household"
      className="flex gap-2 items-center px-3 py-2 transition-colors text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="w-4 h-4" />
      목록으로
    </Link>
  );

  const rightActions = household ? (
    <div className="flex gap-2">
      {/* 편집 모드 토글 버튼 */}
      <button
        onClick={handleEditToggle}
        disabled={isSubmitting}
        className="flex gap-2 items-center px-4 py-2 rounded-lg border transition-colors border-border hover:bg-muted disabled:opacity-50"
        title={isEditMode ? "편집 모드 해제" : "편집 모드 활성화"}
      >
        {isEditMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        {isEditMode ? '취소' : '편집'}
      </button>
      
      {/* 삭제 버튼 */}
      <button
        onClick={handleDelete}
        disabled={isEditMode || isSubmitting}
        className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4" />
        삭제
      </button>
    </div>
  ) : null;
  // #endregion

  // #region 로딩/에러 상태
  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="호실 상세"
          leftActions={leftActions}
        />
        <div className="p-8 text-center">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !household) {
    return (
      <div className="p-6">
        <PageHeader
          title="호실 상세"
          leftActions={leftActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">{error || '호실 정보를 찾을 수 없습니다.'}</p>
          <button 
            onClick={loadHouseholdDetail}
            className="px-4 py-2 mt-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  // #endregion

  return (
    <div className="p-6">
      <PageHeader
        title={`호실 상세 - ${formatRoomNumber(household)}`}
        subtitle={isEditMode ? "호실 정보를 수정합니다" : ""}
        leftActions={leftActions}
        rightActions={rightActions}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 호실 정보 */}
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">호실 정보</h2>
          
          {isEditMode ? (
            /* 편집 모드 - 폼 */
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  type="select"
                  label="동 *"
                  placeholder="동 선택"
                  value={formData.address1Depth}
                  onChange={handleFieldChange('address1Depth')}
                  options={[
                    { value: '101동', label: '101동' },
                    { value: '102동', label: '102동' },
                    { value: '103동', label: '103동' },
                    { value: '104동', label: '104동' },
                    { value: '105동', label: '105동' },
                  ]}
                />
                {errors.address1Depth && (
                  <div className="col-span-full text-sm text-red-600">{errors.address1Depth}</div>
                )}
                
                <Field
                  type="text"
                  label="호수 *"
                  placeholder="예: 1001호"
                  value={formData.address2Depth}
                  onChange={handleFieldChange('address2Depth')}
                />
                {errors.address2Depth && (
                  <div className="col-span-full text-sm text-red-600">{errors.address2Depth}</div>
                )}
                
                <Field
                  type="text"
                  label="세부 주소"
                  placeholder="예: A동"
                  value={formData.address3Depth}
                  onChange={handleFieldChange('address3Depth')}
                />
                
                <Field
                  type="select"
                  label="세대 타입 *"
                  placeholder="타입 선택"
                  value={formData.householdType}
                  onChange={handleFieldChange('householdType')}
                  options={[
                    { value: 'GENERAL', label: '일반 세대' },
                    { value: 'TEMP', label: '임시 세대' },
                    { value: 'COMMERCIAL', label: '상업 세대' },
                  ]}
                />
                {errors.householdType && (
                  <div className="col-span-full text-sm text-red-600">{errors.householdType}</div>
                )}
              </div>

              <Field
                type="text"
                label="메모"
                placeholder="특이사항이나 추가 정보를 입력하세요"
                value={formData.memo}
                onChange={handleFieldChange('memo')}
              />

              {/* 편집 모드 버튼들 */}
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="flex gap-2 items-center px-4 py-2 rounded-lg border transition-colors border-border hover:bg-muted disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  초기화
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting || !isValid}
                  className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          ) : (
            /* 조회 모드 - 읽기 전용 */
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">호실번호:</span>
                <span className="font-medium">{formatRoomNumber(household)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">세대 타입:</span>
                <span className="font-medium">{getHouseholdTypeLabel(household.householdType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">등록일:</span>
                <span className="font-medium">{new Date(household.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">수정일:</span>
                <span className="font-medium">{new Date(household.updatedAt).toLocaleDateString()}</span>
              </div>
              {household.memo && (
                <div className="pt-2">
                  <span className="text-gray-600">메모:</span>
                  <p className="mt-1 text-sm text-gray-800">{household.memo}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 입주세대 목록 */}
        <div className="p-6 bg-white rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">입주세대</h2>
            <Link
              href={`/parking/household-management/household-instance/create?householdId=${household.id}`}
              className="flex gap-2 items-center px-3 py-1 text-sm rounded transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              세대 배정
            </Link>
          </div>
          
          {instances.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              현재 입주한 세대가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {instances.map((instance) => (
                <div key={instance.id} className="p-3 bg-gray-50 rounded border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{instance.instanceName || '세대명 없음'}</h3>
                      <p className="text-sm text-gray-600">
                        입주일: {instance.startDate ? new Date(instance.startDate).toLocaleDateString() : '-'}
                      </p>
                      {instance.endDate && (
                        <p className="text-sm text-gray-600">
                          예정 퇴거일: {new Date(instance.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/parking/household-management/household-instance/${instance.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        상세
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
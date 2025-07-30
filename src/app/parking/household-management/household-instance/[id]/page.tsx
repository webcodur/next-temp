'use client';

import React, { useState, useEffect, useCallback, useMemo, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Lock, Unlock, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import { getHouseholdInstanceDetail } from '@/services/household/household_instance@instanceId_GET';
import { updateHouseholdInstance } from '@/services/household/household_instance@instanceId_PUT';
import { deleteHouseholdInstance } from '@/services/household/household_instance@instanceId_DELETE';
import type { HouseholdInstance, UpdateHouseholdInstanceRequest } from '@/types/household';

interface HouseholdInstanceDetailPageProps {
  params: Promise<{ id: string }>;
}

// #region 타입 정의
interface HouseholdInstanceFormData {
  instanceName: string;
  startDate: string;
  endDate: string;
  memo: string;
}
// #endregion

export default function HouseholdInstanceDetailPage({ params }: HouseholdInstanceDetailPageProps) {
  // #region 상태 관리
  const resolvedParams = use(params);
  const router = useRouter();
  const [instance, setInstance] = useState<HouseholdInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'settings'>('info');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<HouseholdInstanceFormData>({
    instanceName: '',
    startDate: '',
    endDate: '',
    memo: '',
  });
  const [originalData, setOriginalData] = useState<HouseholdInstanceFormData>({
    instanceName: '',
    startDate: '',
    endDate: '',
    memo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // #endregion

  // #region 데이터 로딩
  const loadInstanceDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const id = parseInt(resolvedParams.id);
      if (isNaN(id)) {
        throw new Error('잘못된 세대 인스턴스 ID입니다.');
      }

      const response = await getHouseholdInstanceDetail(id);
      if (!response.success) {
        throw new Error(response.errorMsg || '세대 인스턴스 정보 조회 실패');
      }

      const instanceData = response.data;
      setInstance(instanceData);

      // 폼 데이터 초기화
      const initialData = {
        instanceName: instanceData.instanceName || '',
        startDate: instanceData.startDate || '',
        endDate: instanceData.endDate || '',
        memo: instanceData.memo || '',
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
    loadInstanceDetail();
  }, [loadInstanceDetail]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    if (!isEditMode || activeTab !== 'info') return false;
    
    return (
      formData.instanceName !== originalData.instanceName ||
      formData.startDate !== originalData.startDate ||
      formData.endDate !== originalData.endDate ||
      formData.memo !== originalData.memo
    );
  }, [formData, originalData, isEditMode, activeTab]);

  const isValid = useMemo(() => {
    if (!isEditMode || !hasChanges || activeTab !== 'info') return false;
    
    return formData.instanceName.trim();
  }, [formData, isEditMode, hasChanges, activeTab]);
  // #endregion

  // #region 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.instanceName.trim()) {
      newErrors.instanceName = '세대명을 입력해주세요.';
    }
    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = '퇴거 예정일은 입주일보다 이후여야 합니다.';
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

    // 편집 모드 활성화 시 info 탭으로 이동
    if (!isEditMode) {
      setActiveTab('info');
    }
  }, [isEditMode, hasChanges, originalData]);

  const handleSave = async () => {
    if (!instance || !validateForm() || !hasChanges) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData: UpdateHouseholdInstanceRequest = {
        instanceName: formData.instanceName || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        memo: formData.memo || undefined,
      };

      const response = await updateHouseholdInstance(instance.id, requestData);
      
      if (response.success) {
        alert('입주세대 정보가 성공적으로 수정되었습니다.');
        // 데이터 새로고침
        await loadInstanceDetail();
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
    if (!instance || !confirm('정말로 이 입주세대를 삭제하시겠습니까?')) return;
    
    try {
      const response = await deleteHouseholdInstance(instance.id);
      if (response.success) {
        alert('입주세대가 삭제되었습니다.');
        router.push('/parking/household-management/household-instance');
      } else {
        throw new Error(response.errorMsg || '삭제 실패');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
    }
  };

  const handleFieldChange = (field: keyof HouseholdInstanceFormData) => (value: string) => {
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
    if (!instance) return;
    
    setFormData(originalData);
    setErrors({});
  };
  // #endregion

  // #region 유틸리티 함수
  const formatRoomNumber = (instance: HouseholdInstance) => {
    if (!instance.household) return '정보 없음';
    return `${instance.household.address1Depth} ${instance.household.address2Depth}${instance.household.address3Depth ? ' ' + instance.household.address3Depth : ''}`;
  };

  const getStatusInfo = (instance: HouseholdInstance) => {
    if (instance.deletedAt) {
      return { label: '퇴거', className: 'bg-gray-100 text-gray-800' };
    }
    if (instance.endDate && new Date(instance.endDate) < new Date()) {
      return { label: '퇴거', className: 'bg-gray-100 text-gray-800' };
    }
    return { label: '거주중', className: 'bg-green-100 text-green-800' };
  };
  // #endregion

  // #region 액션 버튼
  const leftActions = (
    <Link
      href="/parking/household-management/household-instance"
      className="flex gap-2 items-center px-3 py-2 transition-colors text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="w-4 h-4" />
      목록으로
    </Link>
  );

  const rightActions = instance ? (
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

  // #region 탭 렌더링
  const renderTabContent = () => {
    if (!instance) return null;

    switch (activeTab) {
      case 'info':
        const statusInfo = getStatusInfo(instance);
        return (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 세대 정보 */}
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">세대 정보</h2>
              
              {isEditMode ? (
                /* 편집 모드 - 폼 */
                <div className="space-y-4">
                  <Field
                    type="text"
                    label="세대명 *"
                    placeholder="세대명을 입력하세요"
                    value={formData.instanceName}
                    onChange={handleFieldChange('instanceName')}
                  />
                  {errors.instanceName && (
                    <div className="text-sm text-red-600">{errors.instanceName}</div>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        입주일
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleFieldChange('startDate')(e.target.value)}
                        className="px-3 py-2 w-full rounded-md border"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        예정 퇴거일
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleFieldChange('endDate')(e.target.value)}
                        className="px-3 py-2 w-full rounded-md border"
                      />
                    </div>
                    {errors.endDate && (
                      <div className="col-span-full text-sm text-red-600">{errors.endDate}</div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      메모
                    </label>
                    <textarea
                      placeholder="특이사항이나 추가 정보를 입력하세요"
                      value={formData.memo}
                      onChange={(e) => handleFieldChange('memo')(e.target.value)}
                      rows={3}
                      className="px-3 py-2 w-full rounded-md border"
                    />
                  </div>

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
                    <span className="text-gray-600">세대명:</span>
                    <span className="font-medium">{instance.instanceName || '세대명 없음'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">호실:</span>
                    <span className="font-medium">{formatRoomNumber(instance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">입주일:</span>
                    <span className="font-medium">
                      {instance.startDate ? new Date(instance.startDate).toLocaleDateString() : '-'}
                    </span>
                  </div>
                  {instance.endDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">예정 퇴거일:</span>
                      <span className="font-medium">{new Date(instance.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">상태:</span>
                    <span className={`px-2 py-1 text-sm rounded-full ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">등록일:</span>
                    <span className="font-medium">{new Date(instance.createdAt).toLocaleDateString()}</span>
                  </div>
                  {instance.memo && (
                    <div className="pt-2">
                      <span className="text-gray-600">메모:</span>
                      <p className="mt-1 text-sm text-gray-800">{instance.memo}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 호실 정보 */}
            {instance.household && (
              <div className="p-6 bg-white rounded-lg border shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">호실 정보</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">동:</span>
                    <span className="font-medium">{instance.household.address1Depth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">호수:</span>
                    <span className="font-medium">{instance.household.address2Depth}</span>
                  </div>
                  {instance.household.address3Depth && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">세부 주소:</span>
                      <span className="font-medium">{instance.household.address3Depth}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">세대 타입:</span>
                    <span className="font-medium">
                      {instance.household.householdType === 'GENERAL' ? '일반 세대' :
                       instance.household.householdType === 'TEMP' ? '임시 세대' :
                       instance.household.householdType === 'COMMERCIAL' ? '상업 세대' : 
                       instance.household.householdType}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'members':
        return (
          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">구성원</h2>
              <Link
                href={`/parking/household-management/resident/create?instanceId=${instance.id}`}
                className="flex gap-2 items-center px-3 py-1 text-sm rounded transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                구성원 추가
              </Link>
            </div>
            <div className="p-8 text-center text-muted-foreground">
              구성원 정보는 별도 API에서 조회됩니다.
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* 서비스 설정 */}
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">서비스 설정</h2>
              <div className="p-8 text-center text-muted-foreground">
                서비스 설정 정보는 별도 API에서 조회됩니다.
              </div>
            </div>

            {/* 방문 설정 */}
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">방문 설정</h2>
              <div className="p-8 text-center text-muted-foreground">
                방문 설정 정보는 별도 API에서 조회됩니다.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  // #endregion

  // #region 로딩/에러 상태
  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="입주세대 상세"
          leftActions={leftActions}
        />
        <div className="p-8 text-center">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !instance) {
    return (
      <div className="p-6">
        <PageHeader
          title="입주세대 상세"
          leftActions={leftActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">{error || '입주세대 정보를 찾을 수 없습니다.'}</p>
          <button 
            onClick={loadInstanceDetail}
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
        title={`입주세대 상세 - ${instance.instanceName || '세대명 없음'}`}
        subtitle={isEditMode ? "입주세대 정보를 수정합니다" : ""}
        leftActions={leftActions}
        rightActions={rightActions}
      />

      {/* 탭 영역 */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button 
              onClick={() => setActiveTab('info')}
              disabled={isEditMode && activeTab !== 'info'}
              className={`px-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'info' 
                  ? 'text-blue-600 border-blue-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              } ${isEditMode && activeTab !== 'info' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              세대 정보
            </button>
            <button 
              onClick={() => setActiveTab('members')}
              disabled={isEditMode}
              className={`px-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'members' 
                  ? 'text-blue-600 border-blue-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              } ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              구성원
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              disabled={isEditMode}
              className={`px-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'settings' 
                  ? 'text-blue-600 border-blue-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              } ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              설정
            </button>
          </nav>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {renderTabContent()}
    </div>
  );
} 
'use client';

import React, { useState, useEffect, useCallback, useMemo, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Lock, Unlock, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Field } from '@/components/ui/ui-input/field/core/Field';

import { getResidentDetail } from '@/services/resident/resident@id_GET';
import { updateResident } from '@/services/resident/resident@id_PATCH';
import { deleteResident } from '@/services/resident/resident@id_DELETE';
import type { ResidentDetailResponse } from '@/services/resident/resident@id_GET';
import type { UpdateResidentRequest } from '@/types/api';

interface ResidentDetailPageProps {
  params: Promise<{ id: string }>;
}

// #region 타입 정의
interface ResidentFormData {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: 'M' | 'F' | '';
  emergencyContact: string;
  memo: string;
}
// #endregion

export default function ResidentDetailPage({ params }: ResidentDetailPageProps) {
  // #region 상태 관리
  const resolvedParams = use(params);
  const router = useRouter();
  const [resident, setResident] = useState<ResidentDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'household' | 'history'>('info');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ResidentFormData>({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    emergencyContact: '',
    memo: '',
  });
  const [originalData, setOriginalData] = useState<ResidentFormData>({
    name: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: '',
    emergencyContact: '',
    memo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // #endregion

  // #region 데이터 로딩
  const loadResidentDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const id = parseInt(resolvedParams.id);
      if (isNaN(id)) {
        throw new Error('잘못된 입주민 ID입니다.');
      }

      const response = await getResidentDetail(id);
      if (!response.success) {
        throw new Error(response.errorMsg || '입주민 정보 조회 실패');
      }

      const residentData = response.data;
      if (!residentData) {
        throw new Error('입주민 정보를 찾을 수 없습니다.');
      }
      
      setResident(residentData);

      // 폼 데이터 초기화 (birthDate가 Date 타입일 수 있으므로 string으로 변환)
      const birthDateString = residentData.birthDate 
        ? (residentData.birthDate instanceof Date 
          ? residentData.birthDate.toISOString().split('T')[0] 
          : residentData.birthDate)
        : '';
        
      const initialData = {
        name: residentData.name || '',
        phone: residentData.phone || '',
        email: residentData.email || '',
        birthDate: birthDateString,
        gender: (['M', 'F'].includes(residentData.gender || '') ? residentData.gender : '') as 'M' | 'F' | '',
        emergencyContact: residentData.emergencyContact || '',
        memo: residentData.memo || '',
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
    loadResidentDetail();
  }, [loadResidentDetail]);
  // #endregion

  // #region 변경 감지
  const hasChanges = useMemo(() => {
    if (!isEditMode || activeTab !== 'info') return false;
    
    return (
      formData.name !== originalData.name ||
      formData.phone !== originalData.phone ||
      formData.email !== originalData.email ||
      formData.birthDate !== originalData.birthDate ||
      formData.gender !== originalData.gender ||
      formData.emergencyContact !== originalData.emergencyContact ||
      formData.memo !== originalData.memo
    );
  }, [formData, originalData, isEditMode, activeTab]);

  const isValid = useMemo(() => {
    if (!isEditMode || !hasChanges || activeTab !== 'info') return false;
    
    return formData.name.trim();
  }, [formData, isEditMode, hasChanges, activeTab]);
  // #endregion

  // #region 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    if (formData.phone && !/^[0-9-+\s()]+$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식을 입력해주세요.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
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
    if (!resident || !validateForm() || !hasChanges) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const requestData: UpdateResidentRequest = {
        name: formData.name,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        birthDate: formData.birthDate || undefined,
        gender: formData.gender || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        memo: formData.memo || undefined,
      };

      const response = await updateResident(resident.id, requestData);
      
      if (response.success) {
        alert('입주민 정보가 성공적으로 수정되었습니다.');
        // 데이터 새로고침
        await loadResidentDetail();
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
    if (!resident || !confirm('정말로 이 입주민을 삭제하시겠습니까?')) return;
    
    try {
      const response = await deleteResident(resident.id);
      if (response.success) {
        alert('입주민이 삭제되었습니다.');
        router.push('/parking/household-management/resident');
      } else {
        throw new Error(response.errorMsg || '삭제 실패');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
    }
  };

  const handleFieldChange = (field: keyof ResidentFormData) => (value: string) => {
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
    if (!resident) return;
    
    setFormData(originalData);
    setErrors({});
  };
  // #endregion

  // #region 유틸리티 함수
  const getGenderLabel = (gender?: string) => {
    if (gender === 'M') return '남성';
    if (gender === 'F') return '여성';
    return '미설정';
  };

  const getRelationshipLabel = (relationship: string) => {
    const relationMap: Record<string, string> = {
      HEAD: '세대주',
      SPOUSE: '배우자',
      CHILD: '자녀',
      PARENT: '부모',
      OTHER: '기타',
    };
    return relationMap[relationship] || relationship;
  };

  const formatRoomNumber = (household: unknown) => {
    if (!household || typeof household !== 'object') return '정보 없음';
    
    const h = household as { address1Depth?: string; address2Depth?: string; address3Depth?: string };
    if (!h.address1Depth || !h.address2Depth) return '정보 없음';
    
    return `${h.address1Depth} ${h.address2Depth}${h.address3Depth ? ' ' + h.address3Depth : ''}`;
  };
  // #endregion

  // #region 액션 버튼
  const leftActions = (
    <Link
      href="/parking/household-management/resident"
      className="flex gap-2 items-center px-3 py-2 transition-colors text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="w-4 h-4" />
      목록으로
    </Link>
  );

  const rightActions = resident ? (
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
    if (!resident) return null;

    switch (activeTab) {
      case 'info':
        return (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 기본 정보 */}
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">기본 정보</h2>
              
              {isEditMode ? (
                /* 편집 모드 - 폼 */
                <div className="space-y-4">
                  <Field
                    type="text"
                    label="이름 *"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={handleFieldChange('name')}
                  />
                  {errors.name && (
                    <div className="text-sm text-red-600">{errors.name}</div>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field
                      type="text"
                      label="전화번호"
                      placeholder="전화번호를 입력하세요"
                      value={formData.phone}
                      onChange={handleFieldChange('phone')}
                    />
                    {errors.phone && (
                      <div className="col-span-full text-sm text-red-600">{errors.phone}</div>
                    )}
                    
                    <Field
                      type="email"
                      label="이메일"
                      placeholder="이메일을 입력하세요"
                      value={formData.email}
                      onChange={handleFieldChange('email')}
                    />
                    {errors.email && (
                      <div className="col-span-full text-sm text-red-600">{errors.email}</div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        생년월일
                      </label>
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleFieldChange('birthDate')(e.target.value)}
                        className="px-3 py-2 w-full rounded-md border"
                      />
                    </div>
                    
                    <Field
                      type="select"
                      label="성별"
                      placeholder="성별을 선택하세요"
                      value={formData.gender}
                      onChange={handleFieldChange('gender')}
                      options={[
                        { value: 'M', label: '남성' },
                        { value: 'F', label: '여성' },
                      ]}
                    />
                  </div>

                  <Field
                    type="text"
                    label="비상연락처"
                    placeholder="비상시 연락받을 번호를 입력하세요"
                    value={formData.emergencyContact}
                    onChange={handleFieldChange('emergencyContact')}
                  />

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
                    <span className="text-gray-600">이름:</span>
                    <span className="font-medium">{resident.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">전화번호:</span>
                    <span className="font-medium">{resident.phone || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">이메일:</span>
                    <span className="font-medium">{resident.email || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">생년월일:</span>
                    <span className="font-medium">
                      {resident.birthDate ? new Date(resident.birthDate).toLocaleDateString() : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">성별:</span>
                    <span className="font-medium">{getGenderLabel(resident.gender)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">비상연락처:</span>
                    <span className="font-medium">{resident.emergencyContact || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">등록일:</span>
                    <span className="font-medium">{new Date(resident.createdAt).toLocaleDateString()}</span>
                  </div>
                  {resident.memo && (
                    <div className="pt-2">
                      <span className="text-gray-600">메모:</span>
                      <p className="mt-1 text-sm text-gray-800">{resident.memo}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 거주 정보 */}
            <div className="p-6 bg-white rounded-lg border shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">거주 정보</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">현재 거주지:</span>
                  <span className="font-medium">
                    {formatRoomNumber(resident.residentHouseholds?.[0]?.householdInstance?.household)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">세대 관계:</span>
                  <span className="font-medium">
                    {getRelationshipLabel(resident.residentHouseholds?.[0]?.relationship || 'OTHER')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">입주일:</span>
                  <span className="font-medium">
                    {resident.residentHouseholds?.[0]?.householdInstance?.startDate ? 
                      new Date(resident.residentHouseholds[0].householdInstance.startDate).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'household':
        return (
          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">세대 정보</h2>
            <div className="p-8 text-center text-muted-foreground">
              세대 정보는 별도 API에서 조회됩니다.
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="p-6 bg-white rounded-lg border shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">거주 이력</h2>
            <div className="p-8 text-center text-muted-foreground">
              거주 이력 정보는 별도 API에서 조회됩니다.
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
          title="입주민 상세"
          leftActions={leftActions}
        />
        <div className="p-8 text-center">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !resident) {
    return (
      <div className="p-6">
        <PageHeader
          title="입주민 상세"
          leftActions={leftActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">{error || '입주민 정보를 찾을 수 없습니다.'}</p>
          <button 
            onClick={loadResidentDetail}
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
        title={`입주민 상세 - ${resident.name}`}
        subtitle={isEditMode ? "입주민 정보를 수정합니다" : ""}
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
              기본 정보
            </button>
            <button 
              onClick={() => setActiveTab('household')}
              disabled={isEditMode}
              className={`px-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'household' 
                  ? 'text-blue-600 border-blue-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              } ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              세대 정보
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              disabled={isEditMode}
              className={`px-1 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'history' 
                  ? 'text-blue-600 border-blue-500' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              } ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              거주 이력
            </button>
          </nav>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {renderTabContent()}
    </div>
  );
} 
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import { getHouseholdInstanceDetail } from '@/services/household/household_instance@instanceId_GET';
import { updateHouseholdInstance } from '@/services/household/household_instance@instanceId_PUT';
import { deleteHouseholdInstance } from '@/services/household/household_instance@instanceId_DELETE';
import type { HouseholdInstance, UpdateHouseholdInstanceRequest } from '@/types/household';

// #region 타입 정의
interface HouseholdInstanceFormData {
  instanceName: string;
  startDate: string;
  endDate: string;
  memo: string;
}
// #endregion

interface HouseholdInstanceDetailViewProps {
  instanceId: string;
}

export default function HouseholdInstanceDetailView({ instanceId }: HouseholdInstanceDetailViewProps) {
  // #region 상태 관리
  const router = useRouter();
  const [instance, setInstance] = useState<HouseholdInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

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
      const id = parseInt(instanceId);
      if (isNaN(id)) {
        throw new Error('잘못된 인스턴스 ID입니다.');
      }

      const response = await getHouseholdInstanceDetail(id);
      if (!response.success || !response.data) {
        throw new Error(response.errorMsg || '인스턴스 정보 조회 실패');
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
  }, [instanceId]);

  useEffect(() => {
    loadInstanceDetail();
  }, [loadInstanceDetail]);
  // #endregion

  // #region 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.instanceName.trim()) {
      newErrors.instanceName = '세대명을 입력해주세요.';
    }
    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = '퇴거일은 입주일보다 이후여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // #endregion

  // #region 이벤트 핸들러
  const handleSave = async () => {
    if (!instance || !validateForm()) {
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
        alert('세대 정보가 성공적으로 수정되었습니다.');
        await loadInstanceDetail();
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
    if (!instance || !confirm('정말로 이 세대를 삭제하시겠습니까?')) return;
    
    try {
      const response = await deleteHouseholdInstance(instance.id);
      if (response.success) {
        alert('세대가 삭제되었습니다.');
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
    setFormData(originalData);
    setErrors({});
  };
  // #endregion

  // #region 유틸리티 함수
  const formatRoomNumber = (instance: HouseholdInstance) => {
    if (!instance.household) return '정보 없음';
    const household = instance.household;
    return `${household.address1Depth} ${household.address2Depth}${household.address3Depth ? ' ' + household.address3Depth : ''}`;
  };

  const getStatusInfo = (instance: HouseholdInstance) => {
    const isActive = !instance.endDate || new Date(instance.endDate) > new Date();
    return {
      status: isActive ? 'active' : 'inactive',
      label: isActive ? '거주중' : '퇴거',
      className: isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    };
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
      <button
        onClick={handleReset}
        disabled={isSubmitting}
        className="flex gap-2 items-center px-4 py-2 rounded-lg border transition-colors border-border hover:bg-muted disabled:opacity-50"
      >
        초기화
      </button>
      <button
        onClick={handleSave}
        disabled={isSubmitting}
        className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? '저장 중...' : '저장'}
      </button>
      <button
        onClick={handleDelete}
        disabled={isSubmitting}
        className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
        title="세대 삭제"
      >
        <Trash2 className="w-4 h-4" />
        삭제
      </button>
    </div>
  ) : null;
  // #endregion

  // #region 탭 콘텐츠 렌더링
  const renderTabContent = () => {
    if (activeTab === 'info') {
      return (
        <div className="space-y-6">
          {/* 세대 기본 정보 */}
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="mb-4 text-lg font-semibold">세대 정보</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                type="text"
                label="세대명"
                value={formData.instanceName}
                onChange={handleFieldChange('instanceName')}
                placeholder="세대명을 입력하세요"
              />
              {errors.instanceName && (
                <div className="text-sm text-red-600">{errors.instanceName}</div>
              )}
              
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
                  퇴거일
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleFieldChange('endDate')(e.target.value)}
                  className="px-3 py-2 w-full rounded-md border"
                />
                {errors.endDate && (
                  <div className="text-sm text-red-600">{errors.endDate}</div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  메모
                </label>
                <textarea
                  rows={3}
                  value={formData.memo}
                  onChange={(e) => handleFieldChange('memo')(e.target.value)}
                  placeholder="메모를 입력하세요"
                  className="px-3 py-2 w-full rounded-md border"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };
  // #endregion

  // #region 로딩/에러 상태
  if (loading) {
    return (
      <div className="p-6">
        <PageHeader
          title="세대 상세"
          subtitle="세대 정보를 조회하고 수정할 수 있습니다"
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
          title="세대 상세"
          subtitle="세대 정보를 조회하고 수정할 수 있습니다"
          leftActions={leftActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">{error || '세대 정보를 찾을 수 없습니다.'}</p>
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

  const statusInfo = getStatusInfo(instance);

  return (
    <div className="p-6">
      <PageHeader
        title={`세대 상세 - ${instance.instanceName || '세대명 없음'}`}
        subtitle="세대 정보를 조회하고 수정할 수 있습니다"
        leftActions={leftActions}
        rightActions={rightActions}
      />

      {/* 세대 요약 정보 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <span className="text-sm text-gray-600">호실:</span>
            <div className="font-medium">{formatRoomNumber(instance)}</div>
          </div>
          <div>
            <span className="text-sm text-gray-600">상태:</span>
            <div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600">입주일:</span>
            <div className="font-medium">
              {instance.startDate ? new Date(instance.startDate).toLocaleDateString() : '-'}
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-600">등록일:</span>
            <div className="font-medium">
              {new Date(instance.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              세대 정보
            </button>
          </nav>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {renderTabContent()}
    </div>
  );
}
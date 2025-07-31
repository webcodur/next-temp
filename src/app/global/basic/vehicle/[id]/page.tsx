'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Lock, Unlock, Save } from 'lucide-react';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import VehicleForm from '@/components/view/global/basic/vehicle/VehicleForm';
import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { getCarDetail, updateCar } from '@/services/car';
import type { Car, UpdateCarRequest } from '@/types/car';

export default function VehicleDetailPage() {
  // #region 상태 관리
  const [carData, setCarData] = useState<Car | null>(null);
  const [originalData, setOriginalData] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 확인 다이얼로그 상태
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<UpdateCarRequest | null>(null);

  const router = useRouter();
  const params = useParams();
  const carId = parseInt(params.id as string);
  // #endregion

  // #region 데이터 로딩
  const loadCarDetail = useCallback(async () => {
    if (!carId || isNaN(carId)) {
      setError('잘못된 차량 ID입니다.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getCarDetail(carId);
      
      if (response.success && response.data) {
        setCarData(response.data);
        setOriginalData(response.data);
      } else {
        setError(response.errorMsg || '차량 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('차량 상세 조회 실패:', err);
      setError('차량 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    loadCarDetail();
  }, [loadCarDetail]);
  // #endregion

  // #region 편집 모드 관리
  const handleEditToggle = useCallback(() => {
    if (isEditMode && hasChanges) {
      // 변경사항이 있으면 확인 다이얼로그 표시
      if (window.confirm('변경사항이 저장되지 않았습니다. 편집을 취소하시겠습니까?')) {
        setIsEditMode(false);
        setHasChanges(false);
        // 원본 데이터로 복원
        if (originalData) {
          setCarData(originalData);
        }
      }
    } else {
      setIsEditMode(!isEditMode);
      setHasChanges(false);
    }
  }, [isEditMode, hasChanges, originalData]);
  // #endregion

  // #region 저장 핸들러
  const handleSubmit = useCallback(async (formData: UpdateCarRequest) => {
    // 변경사항 감지
    if (!originalData) return;
    
    const changes: UpdateCarRequest = {};
    let hasAnyChanges = false;

    // 변경된 필드만 추출
    Object.keys(formData).forEach(key => {
      const originalValue = originalData[key as keyof Car];
      const newValue = formData[key as keyof UpdateCarRequest];
      
      if (originalValue !== newValue) {
        (changes as any)[key] = newValue;
        hasAnyChanges = true;
      }
    });

    if (!hasAnyChanges) {
      alert('변경된 내용이 없습니다.');
      return;
    }

    setPendingFormData(changes);
    setIsConfirmDialogOpen(true);
  }, [originalData]);

  const handleSaveConfirm = useCallback(async () => {
    if (!pendingFormData || !carId) return;

    setSaving(true);
    try {
      const response = await updateCar(carId, pendingFormData);
      
      if (response.success && response.data) {
        setCarData(response.data);
        setOriginalData(response.data);
        setIsEditMode(false);
        setHasChanges(false);
        setIsConfirmDialogOpen(false);
        setPendingFormData(null);
        alert('차량 정보가 성공적으로 수정되었습니다.');
      } else {
        alert(response.errorMsg || '차량 정보 수정에 실패했습니다.');
      }
    } catch (err) {
      console.error('차량 정보 수정 실패:', err);
      alert('차량 정보 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }, [pendingFormData, carId]);

  const handleSaveCancel = useCallback(() => {
    setIsConfirmDialogOpen(false);
    setPendingFormData(null);
  }, []);
  // #endregion

  // #region 변경사항 감지
  const detectChanges = useCallback((formData: any) => {
    if (!originalData) return;
    
    let hasAnyChanges = false;
    Object.keys(formData).forEach(key => {
      const originalValue = originalData[key as keyof Car];
      const newValue = formData[key];
      
      // 빈 문자열과 undefined/null 같은 것으로 취급
      const normalizeValue = (val: any) => {
        if (val === '' || val === null || val === undefined) return '';
        return val;
      };
      
      if (normalizeValue(originalValue) !== normalizeValue(newValue)) {
        hasAnyChanges = true;
      }
    });
    
    setHasChanges(hasAnyChanges);
  }, [originalData]);
  // #endregion

  // #region 렌더링 조건
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !carData) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="차량 상세"
          subtitle="차량 정보를 조회합니다"
          leftActions={
            <Link href="/global/basic/vehicle">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록으로
              </Button>
            </Link>
          }
        />
        
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <p className="text-red-800">{error || '차량 정보를 찾을 수 없습니다.'}</p>
        </div>
      </div>
    );
  }
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`차량 상세: ${carData.carNumber}`}
        subtitle="차량 정보를 조회하고 편집할 수 있습니다"
        leftActions={
          <Link href="/global/basic/vehicle">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </Link>
        }
      />

      <div className="flex justify-end gap-3">
        <Button
          variant={isEditMode ? "default" : "outline"}
          onClick={handleEditToggle}
          icon={isEditMode ? Unlock : Lock}
          disabled={saving}
        >
          {isEditMode ? '편집 중' : '편집하기'}
        </Button>
      </div>

      <VehicleForm
        mode={isEditMode ? 'edit' : 'view'}
        data={carData}
        onSubmit={handleSubmit}
        onCancel={handleEditToggle}
        loading={saving}
        onChange={detectChanges}
      />

      {/* 저장 버튼 (편집 모드일 때만 표시) */}
      {isEditMode && hasChanges && (
        <div className="fixed right-6 bottom-6 z-50">
          <Button
            variant="accent"
            size="lg"
            icon={Save}
            onClick={() => handleSubmit(carData as UpdateCarRequest)}
            loading={saving}
            className="shadow-lg"
          >
            변경사항 저장
          </Button>
        </div>
      )}

      {/* 저장 확인 모달 */}
      <Modal
        isOpen={isConfirmDialogOpen}
        onClose={handleSaveCancel}
        title="변경사항 저장"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 mb-3">
              차량 정보 변경사항을 저장하시겠습니까?
            </p>
            {pendingFormData && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-900 mb-2">변경된 항목:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {Object.keys(pendingFormData).map(key => (
                    <li key={key}>{key}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={handleSaveCancel}
              disabled={saving}
            >
              취소
            </Button>
            <Button 
              variant="default" 
              onClick={handleSaveConfirm}
              disabled={saving}
            >
              {saving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
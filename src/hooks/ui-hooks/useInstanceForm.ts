/* 
  파일명: /hooks/ui-hooks/useInstanceForm.ts
  기능: 인스턴스 폼 데이터와 유효성 검사를 관리하는 커스텀 훅
  책임: 폼 상태, 변경 감지, 유효성 검사, 리셋 기능을 제공한다.
*/ // ------------------------------

import { useState, useCallback, useMemo } from 'react';

// #region 타입 정의
import { InstanceType } from '@/types/instance';

export interface InstanceFormData {
  name: string;
  ownerName: string;
  address1Depth: string;
  address2Depth: string;
  address3Depth: string;
  instanceType: InstanceType | '';
  password: string;
  memo: string;
}
// #endregion

export function useInstanceForm() {
  // #region 상태
  const [formData, setFormData] = useState<InstanceFormData>({
    name: '',
    ownerName: '',
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
    instanceType: '',
    password: '',
    memo: '',
  });

  const [originalData, setOriginalData] = useState<InstanceFormData>({
    name: '',
    ownerName: '',
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
    instanceType: '',
    password: '',
    memo: '',
  });
  // #endregion

  // #region 계산된 값들
  // 변경 감지
  const hasChanges = useMemo(() => {
    return (
      formData.name !== originalData.name ||
      formData.ownerName !== originalData.ownerName ||
      formData.address1Depth !== originalData.address1Depth ||
      formData.address2Depth !== originalData.address2Depth ||
      formData.address3Depth !== originalData.address3Depth ||
      formData.instanceType !== originalData.instanceType ||
      formData.password !== originalData.password ||
      formData.memo !== originalData.memo
    );
  }, [formData, originalData]);

  // 유효성 검사
  const isValid = useMemo(() => {
    if (!hasChanges) return false;
    
    return Boolean(
      formData.name.trim() &&
      formData.address1Depth.trim() && 
      formData.address2Depth.trim() && 
      formData.instanceType && 
      formData.password.trim()
    );
  }, [formData, hasChanges]);
  // #endregion

  // #region 핸들러
  const handleFormChange = useCallback((data: InstanceFormData) => {
    setFormData(data);
  }, []);

  const handleReset = useCallback(() => {
    if (!hasChanges) return;
    setFormData(originalData);
  }, [hasChanges, originalData]);

  const initializeForm = useCallback((initialData: InstanceFormData) => {
    setFormData(initialData);
    setOriginalData(initialData);
  }, []);

  const updateOriginalData = useCallback((newData: InstanceFormData) => {
    setOriginalData(newData);
    setFormData(newData);
  }, []);

  // 변경된 필드만 추출하는 함수
  const getChangedFields = useCallback(() => {
    const changes: Partial<InstanceFormData> = {};
    
    if (formData.name !== originalData.name) changes.name = formData.name;
    if (formData.ownerName !== originalData.ownerName) changes.ownerName = formData.ownerName;
    if (formData.address1Depth !== originalData.address1Depth) changes.address1Depth = formData.address1Depth;
    if (formData.address2Depth !== originalData.address2Depth) changes.address2Depth = formData.address2Depth;
    if (formData.address3Depth !== originalData.address3Depth) changes.address3Depth = formData.address3Depth;
    if (formData.instanceType !== originalData.instanceType) changes.instanceType = formData.instanceType;
    if (formData.password !== originalData.password) changes.password = formData.password;
    if (formData.memo !== originalData.memo) changes.memo = formData.memo;

    return changes;
  }, [formData, originalData]);
  // #endregion

  return {
    // 상태
    formData,
    originalData,

    // 계산된 값
    hasChanges,
    isValid,

    // 핸들러
    handleFormChange,
    handleReset,
    initializeForm,
    updateOriginalData,
    getChangedFields
  };
}

/* 
  파일명: /hooks/ui-hooks/useInstanceModals.ts
  기능: 인스턴스 페이지의 모든 모달 상태를 관리하는 커스텀 훅
  책임: 성공/오류/삭제확인/차량소유자전환 모달의 상태를 통합 관리한다.
*/ // ------------------------------

import { useState, useCallback } from 'react';
import type { CarResidentWithDetails } from '@/types/car';

// #region 타입 정의
interface PrimaryCarTransferModal {
  isOpen: boolean;
  currentPrimaryResident: CarResidentWithDetails | null;
  newPrimaryResidentId: number | null;
  newPrimaryResidentName: string;
}
// #endregion

export function useInstanceModals() {
  // #region 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // 차량 소유자 전환 확인 Modal 상태
  const [primaryCarTransferModal, setPrimaryCarTransferModal] = useState<PrimaryCarTransferModal>({
    isOpen: false,
    currentPrimaryResident: null,
    newPrimaryResidentId: null,
    newPrimaryResidentName: ''
  });
  // #endregion

  // #region 핸들러
  const showSuccessModal = useCallback((message: string) => {
    setModalMessage(message);
    setSuccessModalOpen(true);
  }, []);

  const showErrorModal = useCallback((message: string) => {
    setModalMessage(message);
    setErrorModalOpen(true);
  }, []);

  const closeSuccessModal = useCallback(() => {
    setSuccessModalOpen(false);
  }, []);

  const closeErrorModal = useCallback(() => {
    setErrorModalOpen(false);
  }, []);

  const showDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(false);
  }, []);

  const showPrimaryCarTransferModal = useCallback((
    currentPrimaryResident: CarResidentWithDetails,
    newPrimaryResidentId: number,
    newPrimaryResidentName: string
  ) => {
    setPrimaryCarTransferModal({
      isOpen: true,
      currentPrimaryResident,
      newPrimaryResidentId,
      newPrimaryResidentName
    });
  }, []);

  const closePrimaryCarTransferModal = useCallback(() => {
    setPrimaryCarTransferModal({
      isOpen: false,
      currentPrimaryResident: null,
      newPrimaryResidentId: null,
      newPrimaryResidentName: ''
    });
  }, []);
  // #endregion

  return {
    // 상태
    successModalOpen,
    errorModalOpen,
    modalMessage,
    deleteConfirmOpen,
    primaryCarTransferModal,

    // 핸들러
    showSuccessModal,
    showErrorModal,
    closeSuccessModal,
    closeErrorModal,
    showDeleteConfirm,
    closeDeleteConfirm,
    showPrimaryCarTransferModal,
    closePrimaryCarTransferModal
  };
}

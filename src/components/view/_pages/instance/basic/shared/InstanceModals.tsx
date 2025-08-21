/* 
  파일명: /components/view/_pages/instance/basic/shared/InstanceModals.tsx
  기능: 인스턴스 상세 페이지의 모든 모달을 관리하는 컴포넌트
  책임: 성공/오류/삭제확인/차량소유자전환 모달의 렌더링을 담당한다.
*/ // ------------------------------

'use client';

import React from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import type { CarResidentWithDetails } from '@/types/car';

// #region 타입 및 인터페이스
interface PrimaryCarTransferModal {
  isOpen: boolean;
  currentPrimaryResident: CarResidentWithDetails | null;
  newPrimaryResidentId: number | null;
  newPrimaryResidentName: string;
}

interface InstanceModalsProps {
  // 오류 모달
  errorModalOpen: boolean;
  onCloseErrorModal: () => void;
  
  // 공통 메시지
  modalMessage: string;
  
  // 삭제 확인 모달
  deleteConfirmOpen: boolean;
  onCloseDeleteConfirm: () => void;
  onConfirmDelete: () => void;
  
  // 차량 소유자 전환 모달
  primaryCarTransferModal: PrimaryCarTransferModal;
  onConfirmPrimaryCarTransfer: () => void;
  onCancelPrimaryCarTransfer: () => void;
}
// #endregion

export default function InstanceModals({
  errorModalOpen,
  onCloseErrorModal,
  modalMessage,
  deleteConfirmOpen,
  onCloseDeleteConfirm,
  onConfirmDelete,
  primaryCarTransferModal,
  onConfirmPrimaryCarTransfer,
  onCancelPrimaryCarTransfer
}: InstanceModalsProps) {

  return (
    <>
      {/* 오류 모달 */}
      <Modal
        isOpen={errorModalOpen}
        onClose={onCloseErrorModal}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={onCloseErrorModal}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={onCloseDeleteConfirm}
        title="세대 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">이 작업은 되돌릴 수 없습니다. 세대 정보가 영구적으로 삭제됩니다.</p>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="ghost" onClick={onCloseDeleteConfirm}>취소</Button>
            <Button variant="destructive" onClick={onConfirmDelete}>삭제</Button>
          </div>
        </div>
      </Modal>

      {/* 차량 소유자 전환 확인 Modal */}
      <Modal
        isOpen={primaryCarTransferModal.isOpen}
        onClose={onCancelPrimaryCarTransfer}
        title="차량 소유자 전환 확인"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>현재 <strong className="text-foreground">{primaryCarTransferModal.currentPrimaryResident?.name}님</strong>이 차량 소유자입니다.</p>
              <p><strong className="text-foreground">{primaryCarTransferModal.newPrimaryResidentName}님</strong>으로 차량 소유자을 전환하시겠습니까?</p>
              <div className="p-2 mt-3 text-sm text-orange-800 bg-orange-50 rounded-md border border-orange-200">
                <p>⚠️ 기존 차량 소유자 설정이 해제되고, 새로운 주민에게 적용됩니다.</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-center pt-4">
            <Button 
              variant="outline" 
              onClick={onCancelPrimaryCarTransfer}
              className="border-gray-300"
            >
              취소
            </Button>
            <Button 
              onClick={onConfirmPrimaryCarTransfer}
              className="bg-orange-600 hover:bg-orange-700"
            >
              전환하기
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

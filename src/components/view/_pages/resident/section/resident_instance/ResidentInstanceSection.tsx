'use client';

import React, { useState, useCallback } from 'react';

import { Button } from '@/components/ui/ui-input/button/Button';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import TitleRow from '@/components/ui/ui-layout/title-row/TitleRow';
import CurrentResidenceInfo from './CurrentResidenceInfo';
import ResidentMoveSection from './ResidentMoveSection';
import ResidentInstanceTable from './ResidentInstanceTable';
import CreateResidentInstanceModal from './CreateResidentInstanceModal';
import { ResidentDetail } from '@/types/resident';

interface ResidentInstanceSectionProps {
  resident: ResidentDetail;
  onDataChange: () => void;
}

export default function ResidentInstanceSection({ 
  resident, 
  onDataChange 
}: ResidentInstanceSectionProps) {
  // #region 상태 관리
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [createRelationModalOpen, setCreateRelationModalOpen] = useState(false);
  // #endregion

  // #region 핸들러
  const handleCreateInstanceRelation = useCallback(() => {
    setCreateRelationModalOpen(true);
  }, []);

  const handleOperationComplete = useCallback((success: boolean, message: string) => {
    setModalMessage(message);
    if (success) {
      setSuccessModalOpen(true);
      onDataChange(); // 데이터 새로고침
    } else {
      setErrorModalOpen(true);
    }
  }, [onDataChange]);
  // #endregion

  // #region 현재 거주지 정보
  const currentResidence = resident.residentInstance?.find(ri => ri.instance);
  // #endregion

  return (
    <div className="space-y-6">
      <TitleRow title="거주 정보 관리" subtitle="거주자의 세대 관계를 관리합니다." />
      
      {/* 현재 거주지 정보 */}
      <CurrentResidenceInfo 
        currentResidence={currentResidence}
        onCreateRelation={handleCreateInstanceRelation}
      />

      {/* 세대 이동 섹션 */}
      <ResidentMoveSection 
        resident={resident}
        currentResidence={currentResidence}
        onMoveComplete={handleOperationComplete}
      />

      {/* 세대 관계 목록 */}
      <ResidentInstanceTable 
        residentInstances={resident.residentInstance || []}
        onCreateRelation={handleCreateInstanceRelation}
        onDeleteComplete={handleOperationComplete}
      />

      {/* 성공 모달 */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 모달 */}
      <Modal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{modalMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorModalOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 세대 관계 생성 모달 */}
      <CreateResidentInstanceModal
        isOpen={createRelationModalOpen}
        onClose={() => setCreateRelationModalOpen(false)}
        residentId={resident.id}
        residentName={resident.name}
        existingInstanceIds={resident.residentInstance?.map(ri => ri.instanceId) || []}
        onSuccess={handleOperationComplete.bind(null, true)}
        onError={handleOperationComplete.bind(null, false)}
      />
    </div>
  );
}

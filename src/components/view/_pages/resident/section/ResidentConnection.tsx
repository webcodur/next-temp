'use client';

import React, { useState, useCallback } from 'react';
import { Plus, Link } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import ResidentInstanceTable from './resident_instance/ResidentInstanceTable';
import CreateResidentInstanceModal from './resident_instance/CreateResidentInstanceModal';
import { ResidentDetail } from '@/types/resident';

interface ResidentConnectionProps {
  resident: ResidentDetail;
  onDataChange: () => void;
  onOperationComplete: (success: boolean, message: string) => void;
}

export default function ResidentConnection({ 
  resident, 
  onDataChange,
  onOperationComplete
}: ResidentConnectionProps) {
  // #region 상태 관리
  const [createRelationModalOpen, setCreateRelationModalOpen] = useState(false);
  // #endregion

  // #region 핸들러
  const handleCreateInstanceRelation = useCallback(() => {
    setCreateRelationModalOpen(true);
  }, []);

  const handleOperationCompleteInternal = useCallback((success: boolean, message: string) => {
    onOperationComplete(success, message);
    if (success) {
      onDataChange(); // 데이터 새로고침
    }
  }, [onDataChange, onOperationComplete]);
  // #endregion

  return (
    <div className="space-y-6">
      <SectionPanel 
        title="세대 연결"
        subtitle="거주자와 세대 간의 관계를 관리합니다."
        icon={<Link size={18} />}
        headerActions={(
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleCreateInstanceRelation}
            icon={Plus}
          >
            세대 관계 생성
          </Button>
        )}
      >
        <div className="space-y-4">
          
          {/* 세대 관계 목록 */}
          <ResidentInstanceTable 
            residentInstances={resident.residentInstance || []}
            onCreateRelation={handleCreateInstanceRelation}
            onDeleteComplete={handleOperationCompleteInternal}
          />
        </div>
      </SectionPanel>

      {/* 세대 관계 생성 모달 */}
      <CreateResidentInstanceModal
        isOpen={createRelationModalOpen}
        onClose={() => setCreateRelationModalOpen(false)}
        residentId={resident.id}
        residentName={resident.name}
        existingInstanceIds={resident.residentInstance?.map(ri => ri.instanceId) || []}
        onSuccess={handleOperationCompleteInternal.bind(null, true)}
        onError={handleOperationCompleteInternal.bind(null, false)}
      />
    </div>
  );
}

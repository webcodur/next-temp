'use client';

import React, { useCallback } from 'react';
import { MoveRight } from 'lucide-react';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import ResidentMoveSection from './resident_instance/ResidentMoveSection';
import ResidentHistorySection from './ResidentHistory';
import { ResidentDetail } from '@/types/resident';

interface ResidentMovementProps {
  resident: ResidentDetail;
  onDataChange: () => void;
  onOperationComplete: (success: boolean, message: string) => void;
}

export default function ResidentMovement({ 
  resident, 
  onDataChange,
  onOperationComplete
}: ResidentMovementProps) {
  // #region 핸들러
  const handleOperationCompleteInternal = useCallback((success: boolean, message: string) => {
    onOperationComplete(success, message);
    if (success) {
      onDataChange(); // 데이터 새로고침
    }
  }, [onDataChange, onOperationComplete]);
  // #endregion

  // #region 현재 거주지 정보
  const currentResidence = resident.residentInstance?.find(ri => ri.instance);
  // #endregion

  return (
    <div className="space-y-6">
      <SectionPanel 
        title="세대 이전"
        subtitle="거주자의 세대 이동 및 이동 이력을 관리합니다."
        icon={<MoveRight size={18} />}
      >
        <div className="space-y-6">
          
          {/* 세대 이동 섹션 */}
          <ResidentMoveSection 
            resident={resident}
            currentResidence={currentResidence}
            onMoveComplete={handleOperationCompleteInternal}
          />

          {/* 이동 이력 */}
          <ResidentHistorySection 
            resident={resident}
          />
        </div>
      </SectionPanel>
    </div>
  );
}
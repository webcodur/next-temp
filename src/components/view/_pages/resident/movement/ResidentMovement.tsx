/* 거주자 이동 섹션 컴포넌트 */
'use client';

import { History, ArrowRightLeft } from 'lucide-react';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import ResidentMoveSection from './ResidentMoveSection';
import ResidentHistorySection from './ResidentHistory';
import { ResidentDetail } from '@/types/resident';

interface ResidentMovementProps {
  resident: ResidentDetail;
  loading?: boolean;
  onDataChange?: () => void;
  onOperationComplete?: (success: boolean, message: string) => void;
}

export default function ResidentMovement({ 
  resident, 
  loading = false,
  onDataChange,
  onOperationComplete
}: ResidentMovementProps) {
  
  if (loading || !resident) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-60 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* 거주 이력 섹션 */}
      <SectionPanel 
        title="거주 이력" 
        subtitle="거주자의 과거 거주 내역을 확인합니다"
        icon={<History size={18} />}
      >
        <ResidentHistorySection 
          resident={resident}
        />
      </SectionPanel>
      
      {/* 새 세대로 이동 섹션 */}
      <SectionPanel 
        title="세대 이동" 
        subtitle="거주자를 새로운 세대로 이동시킵니다"
        icon={<ArrowRightLeft size={18} />}
      >
        <ResidentMoveSection 
          resident={resident}
          currentResidence={resident.residentInstance?.[0]}
          onMoveComplete={(success, message) => {
            onOperationComplete?.(success, message);
            onDataChange?.();
          }}
        />
      </SectionPanel>
    </div>
  );
}

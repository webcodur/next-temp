/* 주민 히스토리 페이지 */
'use client';

import React from 'react';
import { History } from 'lucide-react';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import ResidentHistorySection from './ResidentHistory';
import { ResidentDetail } from '@/types/resident';

interface ResidentHistoryPageProps {
  resident: ResidentDetail;
}

export default function ResidentHistoryPage({ resident }: ResidentHistoryPageProps) {
  
  if (!resident) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-muted-foreground">주민 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 거주 히스토리 섹션 */}
      <SectionPanel 
        title="거주 히스토리" 
        subtitle="주민의 과거 및 현재 거주 내역을 확인합니다"
        icon={<History size={18} />}
      >
        <ResidentHistorySection 
          resident={resident}
        />
      </SectionPanel>
    </div>
  );
}

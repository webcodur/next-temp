/*
  파일명: src/app/global/flowchart/overview/page.tsx
  기능: 시스템 사이트맵 페이지
  책임: 관리 시스템의 실제 메뉴와 기능을 시각적으로 표현하고 관련 페이지 정보를 제공한다.
*/

'use client';

import { useState } from 'react';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { OrganizationChart } from './unit/OrganizationChart';
import { DetailModal } from './unit/DetailModal';

// #region 타입
interface ChartNode {
  id: string;
  label: string;
  type: 'building' | 'parking' | 'room' | 'person' | 'vehicle' | 'facility';
  x: number;
  y: number;
  description: string;
}
// #endregion

// #region 렌더링
export default function OrganizationOverviewPage() {
  // #region 상태
  const t = useTranslations();
  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // #endregion

  // #region 핸들러
  const handleNodeClick = (node: ChartNode) => {
    setSelectedNodeId(node.id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  // #endregion

  return (
    <div className="container p-6 mx-auto space-y-6 max-w-7xl">
      {/* 페이지 헤더 */}
      <PageHeader
        title={t('페이지헤더_사이트맵_제목')}
        subtitle={t('페이지헤더_사이트맵_부제목')}
      />

      {/* 메인 콘텐츠 */}
      <div className="w-full min-h-[600px]">
        <OrganizationChart 
          onNodeClick={handleNodeClick}
          selectedNodeId={selectedNodeId}
        />
      </div>

      {/* 상세설명 Modal */}
      <DetailModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedNodeId={selectedNodeId}
      />
    </div>
  );
}
// #endregion
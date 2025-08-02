/*
  파일명: src/app/global/flowchart/overview/page.tsx
  기능: 조직도 및 통합 다이어그램 페이지
  책임: 시스템의 계층 구조를 시각적으로 표현하고 각 요소의 상세 정보를 제공한다.
*/

'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { OrganizationChart } from './unit/OrganizationChart';
import { DetailPanel } from './unit/DetailPanel';

// #region 타입
interface ChartNode {
  id: string;
  label: string;
  type: 'building' | 'room' | 'organization' | 'person' | 'vehicle';
  x: number;
  y: number;
  description: string;
}
// #endregion

// #region 렌더링
export default function OrganizationOverviewPage() {
  // #region 상태
  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  // #endregion

  // #region 핸들러
  const handleNodeClick = (node: ChartNode) => {
    setSelectedNodeId(node.id);
  };
  // #endregion

  return (
    <div className="container p-6 mx-auto space-y-6">
      {/* 페이지 헤더 */}
      <PageHeader
        title="조직도 및 통합 다이어그램"
        subtitle="시스템의 계층 구조와 각 요소 간의 관계를 시각적으로 확인할 수 있습니다."
      />

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 왼쪽: 플로우차트 패널 */}
        <div className="lg:order-1">
          <OrganizationChart 
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNodeId}
          />
        </div>
        {/* 오른쪽: 상세설명 패널 */}
        <div className="lg:order-2">
          <DetailPanel selectedNodeId={selectedNodeId} />
        </div>
      </div>
    </div>
  );
}
// #endregion
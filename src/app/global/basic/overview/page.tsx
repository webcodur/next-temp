/*
  파일명: src/app/global/basic/overview/page.tsx
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

      {/* 도움말 섹션 */}
      <div className="p-6 rounded-lg border bg-muted">
        <h3 className="mb-3 font-semibold text-foreground">💡 사용 안내</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex gap-2 items-start">
            <span className="font-medium min-w-fit">클릭:</span>
            <span>왼쪽 다이어그램의 각 요소를 클릭하면 해당 요소의 상세 정보가 오른쪽에 표시됩니다.</span>
          </div>
          <div className="flex gap-2 items-start">
            <span className="font-medium min-w-fit">계층 구조:</span>
            <span>건물 → 호실 → 조직 → 개인/차량 순서로 관리 계층이 구성됩니다.</span>
          </div>
          <div className="flex gap-2 items-start">
            <span className="font-medium min-w-fit">관계:</span>
            <span>실선은 상하 계층 관계를, 점선은 수평적 연관 관계를 나타냅니다.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
// #endregion
'use client';

import React from 'react';
import { Node, Edge } from 'reactflow';
import ReadOnlyFlowChart, { 
  NodeInfo, 
  createReadOnlyNode, 
  createReadOnlyEdge 
} from '@/components/ui/ui-diagram/readonly-flow/ReadOnlyFlowChart';

// 단순화된 5개 노드 정보
const nodeInfoMap: Record<string, NodeInfo> = {
  building: {
    id: 'building',
    title: '건물',
    type: '건축물',
    description: '전체 건물 관리 단위',
    details: {
      '건물명': '한라비발디 아파트',
      '주소': '서울시 강남구 테헤란로 123',
      '총층수': '지하 3층, 지상 25층',
      '총세대수': '324세대',
      '관리사무소': '02-1234-5678',
    }
  },
  household: {
    id: 'household',
    title: '호실',
    type: '주거단위',
    description: '개별 주거 공간',
    details: {
      '총호실수': '324호실',
      '평형구성': '59㎡(84세대), 84㎡(156세대), 101㎡(84세대)',
      '입주율': '97.8%',
      '공실현황': '7호실',
    }
  },
  organization: {
    id: 'organization',
    title: '조직',
    type: '관리조직',
    description: '건물 관리 담당 조직',
    details: {
      '조직명': '한라비발디 관리사무소',
      '직원수': '총 6명',
      '업무시간': '09:00 ~ 18:00',
      '관리업체': '㈜한라종합관리',
    }
  },
  person: {
    id: 'person',
    title: '개인',
    type: '관리직원',
    description: '건물 관리 담당 직원',
    details: {
      '대표직원': '김영업 팀장',
      '총직원수': '6명',
      '담당업무': '입주민 상담, 시설 관리, 보안',
      '근무시간': '09:00 ~ 18:00',
      '비상연락망': '24시간 운영',
    }
  },
  vehicle: {
    id: 'vehicle',
    title: '차량',
    type: '차량정보',
    description: '관리소 등록 차량',
    details: {
      '등록차량수': '3대',
      '주요차량': 'BMW X5, Mercedes C-Class, Audi A4',
      '주차구역': 'B1, B2층 전용구역',
      '관리방식': '번호판 인식 시스템',
      '이용시간': '24시간',
    }
  },
};

// 단순화된 5개 노드로 삼각형 구조 구현
const organizationNodes: Node[] = [
  // 세로 중앙 정렬: 건물 → 호실
  createReadOnlyNode('building', { x: 250, y: 50 }, '건물', undefined, {
    background: '#3b82f6',
    border: '2px solid #1e40af',
  }),
  createReadOnlyNode('household', { x: 250, y: 150 }, '호실', undefined, {
    background: '#10b981',
    border: '2px solid #047857',
  }),
  
  // 삼각형 형상: 조직(꼭대기), 개인(왼쪽 아래), 차량(오른쪽 아래)
  createReadOnlyNode('organization', { x: 250, y: 280 }, '조직', undefined, {
    background: '#8b5cf6',
    border: '2px solid #6d28d9',
  }),
  // 커스텀 노드 타입 사용
  {
    id: 'person',
    position: { x: 150, y: 380 },
    data: { label: '개인' },
    type: 'personNode',
  },
  {
    id: 'vehicle',
    position: { x: 350, y: 380 },
    data: { label: '차량' },
    type: 'vehicleNode',
  },
];

const organizationEdges: Edge[] = [
  // 기본 구조: 건물 → 호실 → 조직
  createReadOnlyEdge('building', 'household'),
  createReadOnlyEdge('household', 'organization'),
  
  // 조직 - 개인 실선연결
  createReadOnlyEdge('organization', 'person'),
  
  // 조직 - 차량 실선연결
  createReadOnlyEdge('organization', 'vehicle'),
  
  // 개인 - 차량 점선연결 (개인 우측 → 차량 좌측, 커스텀 핸들 사용)
  {
    id: 'person-vehicle',
    source: 'person',
    target: 'vehicle',
    sourceHandle: 'right',
    targetHandle: 'left',
    type: 'straight',
    style: { 
      stroke: '#6b7280', 
      strokeWidth: 2, 
      strokeDasharray: '8,4' 
    },
  },
];

export default function ReadOnlyFlowPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">조직도 (읽기 전용)</h1>
        <p className="mt-1 text-gray-600">
          각 노드를 클릭하면 상세 정보를 확인할 수 있습니다.
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1">
        <ReadOnlyFlowChart
          nodes={organizationNodes}
          edges={organizationEdges}
          nodeInfoMap={nodeInfoMap}
          defaultSelectedNodeId="building"
          showDetails={true}
        />
      </div>
    </div>
  );
}
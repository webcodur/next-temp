'use client';

import React, { useState } from 'react';
import { Node, Edge, BackgroundVariant } from 'reactflow';
import FlowChart, { createNode, createEdge } from '@/components/ui/ui-diagram/flow-chart/FlowChart';

const workflowNodes: Node[] = [
  {
    id: '1',
    position: { x: 250, y: 25 },
    data: { label: '프로젝트 시작' },
    type: 'input',
    style: {
      background: '#4f46e5',
      color: 'white',
      border: '1px solid #4338ca',
      borderRadius: '8px',
      padding: '12px',
    },
  },
  {
    id: '2',
    position: { x: 100, y: 150 },
    data: { label: '요구사항 분석' },
    style: {
      background: '#06b6d4',
      color: 'white',
      border: '1px solid #0891b2',
      borderRadius: '8px',
      padding: '12px',
    },
  },
  {
    id: '3',
    position: { x: 400, y: 150 },
    data: { label: '설계 및 기획' },
    style: {
      background: '#06b6d4',
      color: 'white',
      border: '1px solid #0891b2',
      borderRadius: '8px',
      padding: '12px',
    },
  },
  {
    id: '4',
    position: { x: 250, y: 275 },
    data: { label: '개발 구현' },
    style: {
      background: '#10b981',
      color: 'white',
      border: '1px solid #059669',
      borderRadius: '8px',
      padding: '12px',
    },
  },
  {
    id: '5',
    position: { x: 100, y: 400 },
    data: { label: '테스트' },
    style: {
      background: '#f59e0b',
      color: 'white',
      border: '1px solid #d97706',
      borderRadius: '8px',
      padding: '12px',
    },
  },
  {
    id: '6',
    position: { x: 400, y: 400 },
    data: { label: '배포' },
    style: {
      background: '#8b5cf6',
      color: 'white',
      border: '1px solid #7c3aed',
      borderRadius: '8px',
      padding: '12px',
    },
  },
  {
    id: '7',
    position: { x: 250, y: 525 },
    data: { label: '완료' },
    type: 'output',
    style: {
      background: '#ef4444',
      color: 'white',
      border: '1px solid #dc2626',
      borderRadius: '8px',
      padding: '12px',
    },
  },
];

const workflowEdges: Edge[] = [
  createEdge('1', '2', true),
  createEdge('1', '3', true),
  createEdge('2', '4'),
  createEdge('3', '4'),
  createEdge('4', '5'),
  createEdge('4', '6'),
  createEdge('5', '7'),
  createEdge('6', '7'),
];

export default function FlowChartPage() {
  const [currentNodes, setCurrentNodes] = useState<Node[]>(workflowNodes);
  const [currentEdges, setCurrentEdges] = useState<Edge[]>(workflowEdges);
  const [backgroundType, setBackgroundType] = useState<BackgroundVariant>(BackgroundVariant.Dots);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">플로우 차트 다이어그램</h1>
        <p className="mt-1 text-gray-600">
          React Flow를 활용한 인터랙티브 플로우 차트 컴포넌트입니다.
        </p>
      </div>

      {/* 컨트롤 패널 */}
      <div className="p-3 bg-white border-b border-gray-200">
        <div className="flex flex-wrap gap-2 items-center">
          <button 
            className="px-3 py-1 text-white bg-blue-500 rounded transition-colors hover:bg-blue-600"
            onClick={() => {
              const newNode = createNode(
                `node-${Date.now()}`,
                { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
                `새 작업 ${currentNodes.length + 1}`,
                undefined,
                { background: '#8b5cf6' }
              );
              setCurrentNodes((nds) => [...nds, newNode]);
            }}
          >
            노드 추가
          </button>
          <button 
            className="px-3 py-1 text-white bg-red-500 rounded transition-colors hover:bg-red-600"
            onClick={() => {
              setCurrentNodes(workflowNodes);
              setCurrentEdges(workflowEdges);
            }}
          >
            초기화
          </button>
          
          {/* 배경 타입 선택 */}
          <select 
            className="px-2 py-1 text-sm rounded border border-gray-300"
            value={backgroundType}
            onChange={(e) => setBackgroundType(e.target.value as BackgroundVariant)}
          >
            <option value={BackgroundVariant.Dots}>점 배경</option>
            <option value={BackgroundVariant.Lines}>선 배경</option>
            <option value={BackgroundVariant.Cross}>십자 배경</option>
          </select>

          <span className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded">
            노드: {currentNodes.length}개 | 연결: {currentEdges.length}개
          </span>
        </div>
      </div>

      {/* 플로우 차트 영역 */}
      <div className="flex-1">
        <FlowChart
          initialNodes={currentNodes}
          initialEdges={currentEdges}
          backgroundType={backgroundType}
          onNodesChange={setCurrentNodes}
          onEdgesChange={setCurrentEdges}
          showMiniMap={true}
          showControls={true}
          showBackground={true}
        />
      </div>

      {/* 기능 설명 */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">기본 조작</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• 드래그: 노드 이동</li>
              <li>• 휠: 줌 인/아웃</li>
              <li>• 우클릭: 패닝</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">연결 생성</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• 노드 모서리에서 드래그</li>
              <li>• 다른 노드로 연결</li>
              <li>• 자동 애니메이션 적용</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">추가 기능</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• 미니맵으로 전체 뷰</li>
              <li>• 컨트롤 패널</li>
              <li>• 다양한 배경 스타일</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-gray-900">워크플로우 예시</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• 프로젝트 개발 과정</li>
              <li>• 단계별 진행 상태</li>
              <li>• 병렬 작업 처리</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
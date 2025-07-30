'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeMouseHandler,
  ReactFlowProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PersonNode, VehicleNode, OrganizationNode } from './CustomNodes';

export interface NodeInfo {
  id: string;
  title: string;
  type: string;
  description: string;
  details: Record<string, string | number>;
}

interface ReadOnlyFlowChartProps extends Partial<ReactFlowProps> {
  nodes: Node[];
  edges: Edge[];
  nodeInfoMap: Record<string, NodeInfo>;
  onNodeSelect?: (nodeInfo: NodeInfo | null) => void;
  defaultSelectedNodeId?: string;
  className?: string;
  showDetails?: boolean;
}

export default function ReadOnlyFlowChart({
  nodes: initialNodes,
  edges: initialEdges,
  nodeInfoMap,
  onNodeSelect,
  defaultSelectedNodeId,
  className = 'w-full h-full',
  showDetails = true,
  ...props
}: ReadOnlyFlowChartProps) {
  // #region 노드 자동 배치 로직
  const arrangeNodesInTriangle = useCallback((nodes: Node[]): Node[] => {
    if (nodes.length === 0) return nodes;

    // 좌측 패널의 실제 너비 계산
    const leftPanelWidth = showDetails ? 400 : 800; // 좌측 패널 너비
    const panelHeight = 400; // 패널 높이
    
    // 이등변삼각형 배치를 위한 좌표 계산 (좌측 패널 기준 중앙)
    const centerX = leftPanelWidth / 2;
    const centerY = panelHeight / 2;
    const triangleHeight = 150; // 삼각형 높이 증가
    const triangleBase = 200; // 삼각형 밑변 길이 증가

    // 노드 타입별로 분류
    const organizationNodes = nodes.filter(node => 
      node.type === 'organizationNode' || 
      (!node.type && (node.data?.label?.includes('조직') || node.data?.label?.includes('호실') || node.data?.label?.includes('건물')))
    );
    const personNodes = nodes.filter(node => node.type === 'personNode');
    const vehicleNodes = nodes.filter(node => node.type === 'vehicleNode');

    const arrangedNodes: Node[] = [];

    // 조직 노드들을 삼각형 정점(상단 중앙)에 배치
    organizationNodes.forEach((node, index) => {
      arrangedNodes.push({
        ...node,
        position: { 
          x: centerX - 50 + (index * 15), // 여러 조직 노드가 있을 경우 약간씩 오프셋
          y: centerY - triangleHeight/2 
        }
      });
    });

    // 개인 노드들을 삼각형 좌하단에 배치
    personNodes.forEach((node, index) => {
      arrangedNodes.push({
        ...node,
        position: { 
          x: centerX - triangleBase/2 + (index * 15), // 좌측 밑변
          y: centerY + triangleHeight/2 
        }
      });
    });

    // 차량 노드들을 삼각형 우하단에 배치
    vehicleNodes.forEach((node, index) => {
      arrangedNodes.push({
        ...node,
        position: { 
          x: centerX + triangleBase/2 - 50 + (index * 15), // 우측 밑변
          y: centerY + triangleHeight/2 
        }
      });
    });

    // 분류되지 않은 나머지 노드들은 중앙 우측에 배치
    const remainingNodes = nodes.filter(node => 
      !organizationNodes.includes(node) && 
      !personNodes.includes(node) && 
      !vehicleNodes.includes(node)
    );

    remainingNodes.forEach((node, index) => {
      arrangedNodes.push({
        ...node,
        position: { 
          x: centerX + 100 + (index * 80), 
          y: centerY + (index * 50)
        }
      });
    });

    return arrangedNodes;
  }, [showDetails]);
  // #endregion

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(
    defaultSelectedNodeId ? nodeInfoMap[defaultSelectedNodeId] : null
  );

  // 초기 노드 배치 적용
  useEffect(() => {
    const arrangedNodes = arrangeNodesInTriangle(initialNodes);
    setNodes(arrangedNodes);
  }, [initialNodes, arrangeNodesInTriangle, setNodes]);

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    const nodeInfo = nodeInfoMap[node.id];
    if (nodeInfo) {
      setSelectedNode(nodeInfo);
      onNodeSelect?.(nodeInfo);
    }
  }, [nodeInfoMap, onNodeSelect]);

  const nodeTypes = useMemo(() => ({
    personNode: PersonNode,
    vehicleNode: VehicleNode,
    organizationNode: OrganizationNode,
  }), []);

  if (showDetails) {
    return (
      <div className="flex h-full bg-gray-50">
        {/* 좌측 패널 - 플로우 차트 */}
        <div className="w-1/2 bg-white border-r border-gray-200">
          <div className={className}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
              panOnDrag={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              defaultEdgeOptions={{
                type: 'straight',
                style: { 
                  stroke: '#6b7280', 
                  strokeWidth: 2,
                  strokeDasharray: 'none'
                }
              }}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              {...props}
            />
          </div>
        </div>

        {/* 우측 패널 - 상세 정보 */}
        <div className="w-1/2 bg-white">
          <div className="p-6">
            {selectedNode ? (
              <div className="space-y-6">
                {/* 헤더 */}
                <div className="pb-4 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedNode.title}
                  </h3>
                  <div className="flex gap-2 items-center mt-2">
                    <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                      {selectedNode.type}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">
                    {selectedNode.description}
                  </p>
                </div>

                {/* 상세 정보 */}
                <div className="space-y-4">
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
                    상세 정보
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <dl className="space-y-3">
                      {Object.entries(selectedNode.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-600 min-w-[100px]">
                            {key}
                          </dt>
                          <dd className="flex-1 text-sm text-right text-gray-900">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>

                {/* 추가 액션 */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm text-white bg-blue-500 rounded transition-colors hover:bg-blue-600">
                      수정
                    </button>
                    <button className="px-4 py-2 text-sm text-white bg-gray-500 rounded transition-colors hover:bg-gray-600">
                      이력보기
                    </button>
                    {selectedNode.type === '차량정보' && (
                      <button className="px-4 py-2 text-sm text-white bg-green-500 rounded transition-colors hover:bg-green-600">
                        위치확인
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-20 text-center text-gray-500">
                <p>노드를 선택해주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 상세 정보 패널 없이 차트만 표시
  return (
    <div className={className}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        defaultEdgeOptions={{
          type: 'straight',
          style: { 
            stroke: '#6b7280', 
            strokeWidth: 2,
            strokeDasharray: 'none'
          }
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        {...props}
      />
    </div>
  );
}

// 유틸리티 함수들
export const createReadOnlyNode = (
  id: string,
  position: { x: number; y: number },
  label: string,
  nodeType?: string,
  style?: React.CSSProperties
): Node => ({
  id,
  position,
  data: { label },
  type: nodeType,
  style: {
    background: '#3b82f6',
    color: 'white',
    border: '2px solid #1e40af',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    ...style,
  },
});

export const createReadOnlyEdge = (
  source: string,
  target: string,
  label?: string,
  style?: React.CSSProperties
): Edge => ({
  id: `e${source}-${target}`,
  source,
  target,
  label,
  type: 'straight',
  style: {
    stroke: '#6b7280',
    strokeWidth: 2,
    strokeDasharray: 'none',
    ...style,
  },
});
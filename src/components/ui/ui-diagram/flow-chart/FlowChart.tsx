'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
  ReactFlowProps,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface FlowChartProps extends Partial<ReactFlowProps> {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  showMiniMap?: boolean;
  showControls?: boolean;
  showBackground?: boolean;
  backgroundType?: BackgroundVariant;
  className?: string;
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
}

const defaultNodes: Node[] = [
  {
    id: '1',
    position: { x: 250, y: 25 },
    data: { label: '시작' },
    type: 'input',
    style: {
      background: '#4f46e5',
      color: 'white',
      border: '1px solid #4338ca',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  {
    id: '2',
    position: { x: 100, y: 125 },
    data: { label: '처리 A' },
    style: {
      background: '#06b6d4',
      color: 'white',
      border: '1px solid #0891b2',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  {
    id: '3',
    position: { x: 400, y: 125 },
    data: { label: '처리 B' },
    style: {
      background: '#06b6d4',
      color: 'white',
      border: '1px solid #0891b2',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  {
    id: '4',
    position: { x: 250, y: 250 },
    data: { label: '완료' },
    type: 'output',
    style: {
      background: '#ef4444',
      color: 'white',
      border: '1px solid #dc2626',
      borderRadius: '8px',
      padding: '10px',
    },
  },
];

const defaultEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
];

export default function FlowChart({
  initialNodes = defaultNodes,
  initialEdges = defaultEdges,
  showMiniMap = true,
  showControls = true,
  showBackground = true,
  backgroundType = BackgroundVariant.Dots,
  className = 'w-full h-full',
  onNodesChange: onNodesChangeProp,
  onEdgesChange: onEdgesChangeProp,
  ...props
}: FlowChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({}), []);

  // 외부 콜백 호출
  React.useEffect(() => {
    onNodesChangeProp?.(nodes);
  }, [nodes, onNodesChangeProp]);

  React.useEffect(() => {
    onEdgesChangeProp?.(edges);
  }, [edges, onEdgesChangeProp]);

  return (
    <div className={className}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineType="smoothstep"
        fitView
        {...props}
      >
        {showControls && <Controls />}
        {showMiniMap && (
          <MiniMap 
            nodeColor="#4f46e5"
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
        )}
        {showBackground && (
          <Background 
            variant={backgroundType} 
            gap={12} 
            size={1}
            color="#94a3b8"
          />
        )}
      </ReactFlow>
    </div>
  );
}

// 노드 생성 유틸리티 함수들
export const createNode = (
  id: string,
  position: { x: number; y: number },
  label: string,
  type?: string,
  style?: React.CSSProperties
): Node => ({
  id,
  position,
  data: { label },
  type,
  style: {
    background: '#8b5cf6',
    color: 'white',
    border: '1px solid #7c3aed',
    borderRadius: '8px',
    padding: '10px',
    ...style,
  },
});

export const createEdge = (
  source: string,
  target: string,
  animated = false,
  label?: string
): Edge => ({
  id: `e${source}-${target}`,
  source,
  target,
  animated,
  label,
});
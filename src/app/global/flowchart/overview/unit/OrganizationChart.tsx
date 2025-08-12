/*
  파일명: OrganizationChart.tsx
  기능: 조직도 및 통합 다이어그램을 표시하는 플로우차트 컴포넌트
  책임: 건물→호실→개인/차량의 계층 구조를 시각적으로 표현한다.
*/

import { Workflow } from 'lucide-react';

// #region 타입
interface ChartNode {
  id: string;
  label: string;
  type: 'building' | 'parking' | 'room' | 'person' | 'vehicle' | 'facility';
  x: number;
  y: number;
  description: string;
}

interface OrganizationChartProps {
  onNodeClick: (node: ChartNode) => void;
  selectedNodeId?: string;
}
// #endregion

// #region 상수
// 비활성화된 노드 목록 (미개발 기능)
const DISABLED_NODES = ['building', 'facility'];

const NODES: ChartNode[] = [
  // 건물 (최상위)
  {
    id: 'building',
    label: '건물',
    type: 'building',
    x: 220,
    y: 50,
    description: '아파트 건물 전체를 관리하는 최상위 단위'
  },
  
  // 2단계: 주차장, 호실, 공용시설 (같은 위계)
  {
    id: 'parking',
    label: '주차장',
    type: 'parking',
    x: 120,
    y: 150,
    description: '건물 내 주차 공간 관리 단위'
  },
  
  {
    id: 'room',
    label: '호실',
    type: 'room',
    x: 220,
    y: 150,
    description: '각 세대별 주거 공간 단위'
  },
  
  {
    id: 'facility',
    label: '공용시설',
    type: 'facility',
    x: 320,
    y: 150,
    description: '커뮤니티 시설 및 공용 공간 관리 단위'
  },
  
  // 3단계: 개인과 차량 (호실 하위)
  {
    id: 'person',
    label: '입주민',
    type: 'person',
    x: 170,
    y: 250,
    description: '실제 거주하는 입주민'
  },
  
  {
    id: 'vehicle',
    label: '차량',
    type: 'vehicle',
    x: 270,
    y: 250,
    description: '입주민이 소유한 차량'
  }
];

// 연결선 정의
const CONNECTIONS = [
  // 건물에서 2단계 요소들로 (같은 위계)
  { from: 'building', to: 'parking', type: 'solid' },
  { from: 'building', to: 'room', type: 'solid' },
  { from: 'building', to: 'facility', type: 'solid' },
  
  // 호실에서만 개인과 차량으로 연결
  { from: 'room', to: 'person', type: 'solid' },
  { from: 'room', to: 'vehicle', type: 'solid' },
  
  // 점선 연결 (수평 관계)
  { from: 'person', to: 'vehicle', type: 'dashed' }
];
// #endregion

// #region 헬퍼 함수
const isNodeDisabled = (nodeId: string) => {
  return DISABLED_NODES.includes(nodeId);
};

const getNodeColor = (type: ChartNode['type'], nodeId: string) => {
  const baseColors = {
    building: "hsl(var(--serial-4))",
    parking: "hsl(var(--serial-1))",
    facility: "hsl(var(--serial-2))",
    room: "hsl(var(--serial-5))",
    person: "hsl(var(--serial-6))",
    vehicle: "hsl(var(--serial-3))",
  };
  
  // 비활성화된 노드는 회색으로 표시
  if (isNodeDisabled(nodeId)) {
    return "hsl(var(--muted))";
  }
  
  return baseColors[type];
};

const getNodeStroke = (type: ChartNode['type'], isSelected: boolean, nodeId: string) => {
  if (isNodeDisabled(nodeId)) {
    return 'hsl(var(--muted-foreground) / 0.3)';
  }
  return isSelected ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))';
};
// #endregion

// #region 렌더링
export function OrganizationChart({ onNodeClick, selectedNodeId }: OrganizationChartProps) {
  return (
    <div className="p-4 h-full rounded-lg border shadow-sm bg-card border-border/50">
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="pb-3 border-b border-primary/20">
          <div className="flex gap-3 items-center mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Workflow className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">조직도 및 통합 다이어그램</h3>
              <p className="text-sm text-muted-foreground">시스템 구조와 관계</p>
            </div>
          </div>
        </div>
      
        <div className="flex justify-center">
        <svg width="450" height="380" className="rounded-lg border shadow-sm border-border bg-background">
          {/* 배경 그리드 */}
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* 연결선 그리기 */}
          {CONNECTIONS.map((connection, index) => {
            const fromNode = NODES.find(n => n.id === connection.from);
            const toNode = NODES.find(n => n.id === connection.to);
            
            if (!fromNode || !toNode) return null;
            
            // 연결선이 노드에서 여유 있게 떨어지도록 조정
            const gap = 15;
            
            return (
              <line
                key={index}
                x1={fromNode.x}
                y1={fromNode.y + (connection.type === 'dashed' ? 0 : 25 + gap)} 
                x2={toNode.x}
                y2={toNode.y - (connection.type === 'dashed' ? 0 : 25 + gap)} 
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1.5"
                strokeDasharray={connection.type === 'dashed' ? '4,4' : '0'}
                markerEnd="url(#arrowhead)"
                opacity="0.8"
              />
            );
          })}
          
          {/* 화살표 마커 정의 */}
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" 
                    refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="hsl(var(--muted-foreground))" opacity="0.8" />
            </marker>
          </defs>
          
          {/* 노드 그리기 */}
          {NODES.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isDisabled = isNodeDisabled(node.id);
            const color = getNodeColor(node.type, node.id);
            const strokeColor = getNodeStroke(node.type, isSelected, node.id);
            
            return (
              <g key={node.id}>
                {/* 선택된 노드 배경 효과 (비활성화된 노드는 선택 불가) */}
                {isSelected && !isDisabled && (
                  <rect
                    x={node.x - 44}
                    y={node.y - 29}
                    width="88"
                    height="58"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    rx="10"
                    opacity="0.6"
                    strokeDasharray="3,3"
                  />
                )}
                
                {/* 노드 본체 - 모든 노드가 사각형 */}
                <rect
                  x={node.x - 40}
                  y={node.y - 25}
                  width="80"
                  height="50"
                  fill={color}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  rx="6"
                  className={`drop-shadow-sm transition-all duration-200 ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:brightness-110'
                  }`}
                  onClick={() => !isDisabled && onNodeClick(node)}
                />
                
                {/* 라벨 */}
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  className={`text-sm font-medium pointer-events-none select-none ${
                    isDisabled ? 'opacity-60 fill-muted-foreground' : 'fill-foreground'
                  }`}
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
                >
                  {node.label}
                </text>
                
                {/* 비활성화 표시 (준비중 텍스트) */}
                {isDisabled && (
                  <text
                    x={node.x}
                    y={node.y + 20}
                    textAnchor="middle"
                    className="text-sm opacity-80 pointer-events-none select-none fill-muted-foreground"
                    style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' }}
                  >
                    준비중
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* 범례 */}
      <div className="flex flex-wrap gap-6 justify-center mt-6 text-sm text-muted-foreground">
        <div className="flex gap-2 items-center">
          <div className="w-6 h-0.5 opacity-80" style={{ backgroundColor: 'hsl(var(--muted-foreground))' }}></div>
          <span>실선: 계층 관계</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-0.5 border-t-2 border-dashed opacity-80" style={{ borderColor: 'hsl(var(--muted-foreground))' }}></div>
          <span>점선: 연관 관계</span>
        </div>
        <div className="flex gap-2 items-center">
          <div 
            className="w-3 h-3 rounded-sm border-2 border-dashed opacity-80" 
            style={{ 
              backgroundColor: 'hsl(var(--primary))', 
              borderColor: 'hsl(var(--primary))' 
            }}
          ></div>
          <span>선택된 항목</span>
        </div>
        <div className="flex gap-2 items-center">
          <div 
            className="w-3 h-3 rounded-sm opacity-50" 
            style={{ 
              backgroundColor: 'hsl(var(--muted))',
              border: '1px solid hsl(var(--muted-foreground) / 0.3)'
            }}
          ></div>
          <span>준비중 (클릭 불가)</span>
        </div>
      </div>
      </div>
    </div>
  );
}
// #endregion
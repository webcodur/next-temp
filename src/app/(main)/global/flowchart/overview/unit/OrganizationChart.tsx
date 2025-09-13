/*
  파일명: OrganizationChart.tsx
  기능: 조직도 및 통합 다이어그램을 표시하는 플로우차트 컴포넌트
  책임: 건물→세대→개인/차량의 계층 구조를 시각적으로 표현한다.
*/

import { useTranslations, useLocale } from '@/hooks/ui-hooks/useI18n';
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

// SVG 설정 (viewBox 기준) - 50% 확대
const SVG_CONFIG = {
  viewBox: {
    width: 675,
    height: 570
  },
  padding: {
    top: 75,
    bottom: 75,
    left: 75,
    right: 75
  }
};

// 노드 기본 정보 (좌표 제외) - 다국어 키들
const NODE_DEFINITIONS = [
  {
    id: 'building',
    labelKey: '노드_건물',
    type: 'building' as const,
    level: 1,
    descriptionKey: '노드설명_건물'
  },
  {
    id: 'parking',
    labelKey: '노드_주차장',
    type: 'parking' as const,
    level: 2,
    descriptionKey: '노드설명_주차장'
  },
  {
    id: 'room',
    labelKey: '노드_세대',
    type: 'room' as const,
    level: 2,
    descriptionKey: '노드설명_세대'
  },
  {
    id: 'facility',
    labelKey: '노드_공용시설',
    type: 'facility' as const,
    level: 2,
    descriptionKey: '노드설명_공용시설'
  },
  {
    id: 'person',
    labelKey: '노드_주민',
    type: 'person' as const,
    level: 3,
    descriptionKey: '노드설명_주민'
  },
  {
    id: 'vehicle',
    labelKey: '노드_차량',
    type: 'vehicle' as const,
    level: 3,
    descriptionKey: '노드설명_차량'
  }
];

// 연결선 정의
const CONNECTIONS = [
  // 건물에서 2단계 요소들로 (같은 위계)
  { from: 'building', to: 'parking', type: 'solid' },
  { from: 'building', to: 'room', type: 'solid' },
  { from: 'building', to: 'facility', type: 'solid' },
  
  // 세대에서만 개인과 차량으로 연결
  { from: 'room', to: 'person', type: 'solid' },
  { from: 'room', to: 'vehicle', type: 'solid' },
  
  // 점선 연결 (수평 관계)
  { from: 'person', to: 'vehicle', type: 'dashed' }
];

// 노드 위치 동적 계산 함수
const calculateNodePositions = (t: (key: string) => string, isRTL: boolean): ChartNode[] => {
  const { viewBox, padding } = SVG_CONFIG;
  const { width, height } = viewBox;
  const workingHeight = height - padding.top - padding.bottom;
  
  // 레벨별 Y 좌표 계산
  const levelY = {
    1: padding.top,
    2: padding.top + workingHeight * 0.4,
    3: padding.top + workingHeight * 0.8
  };
  
  return NODE_DEFINITIONS.map(nodeDef => {
    let x: number;
    const centerX = width / 2;
    
    // 레벨별 X 좌표 계산
    if (nodeDef.level === 1) {
      // 레벨 1: 중앙에 배치
      x = centerX;
    } else if (nodeDef.level === 2) {
      // 레벨 2: 세대은 중앙, 주차장과 공용시설은 좌우에 배치
      if (nodeDef.id === 'room') {
        x = centerX; // 세대은 정확히 중앙
      } else if (nodeDef.id === 'parking') {
        const offset = isRTL ? 150 : -150; // RTL일 때는 오른쪽으로
        x = centerX + offset;
      } else if (nodeDef.id === 'facility') {
        const offset = isRTL ? -150 : 150; // RTL일 때는 왼쪽으로
        x = centerX + offset;
      } else {
        x = centerX; // 기본값
      }
    } else {
      // 레벨 3: 세대을 기준으로 좌우 배치 (세대이 중앙이므로 centerX 기준)
      const level3Nodes = NODE_DEFINITIONS.filter(n => n.level === 3);
      const nodeIndex = level3Nodes.findIndex(n => n.id === nodeDef.id);
      let offset = (nodeIndex === 0) ? -75 : 75;
      if (isRTL) offset = -offset; // RTL일 때는 위치 반전
      x = centerX + offset;
    }
    
    return {
      id: nodeDef.id,
      label: t(nodeDef.labelKey),
      type: nodeDef.type,
      x,
      y: levelY[nodeDef.level as keyof typeof levelY],
      description: t(nodeDef.descriptionKey)
    };
  });
};
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
  const t = useTranslations();
  const { isRTL } = useLocale();
  
  // 노드 위치 동적 계산
  const NODES = calculateNodePositions(t, isRTL);
  
  return (
    <div className="p-4 h-full rounded-lg border shadow-sm bg-card border-border/50">
      <div className="flex flex-col space-y-4 h-full">
        {/* 헤더 */}
        <div className="pb-3 border-b border-primary/20">
          <div className={`flex gap-3 items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 rounded-lg bg-primary/10">
              <Workflow className="w-4 h-4 text-primary" />
            </div>
            <div className={isRTL ? 'text-end' : 'text-start'}>
              <h3 className="text-xl font-bold text-foreground">{t('조직도_제목')}</h3>
              <p className="text-sm text-muted-foreground">{t('조직도_설명')}</p>
            </div>
          </div>
        </div>
      
        <div className="flex flex-1 justify-center items-center min-h-0">
        <svg 
          viewBox={`0 0 ${SVG_CONFIG.viewBox.width} ${SVG_CONFIG.viewBox.height}`}
          className="w-full max-w-2xl h-auto max-h-full rounded-lg border shadow-sm border-border bg-background"
        >
          {/* 배경 그리드 */}
          <defs>
            <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="hsl(var(--border))" strokeWidth="0.7" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* 연결선 그리기 */}
          {CONNECTIONS.map((connection, index) => {
            const fromNode = NODES.find(n => n.id === connection.from);
            const toNode = NODES.find(n => n.id === connection.to);
            
            if (!fromNode || !toNode) return null;
            
            // 연결선이 노드에서 여유 있게 떨어지도록 조정 (1.5배)
            const gap = 22;
            
            return (
              <line
                key={index}
                x1={fromNode.x}
                y1={fromNode.y + (connection.type === 'dashed' ? 0 : 37 + gap)} 
                x2={toNode.x}
                y2={toNode.y - (connection.type === 'dashed' ? 0 : 37 + gap)} 
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2.2"
                strokeDasharray={connection.type === 'dashed' ? '6,6' : '0'}
                markerEnd="url(#arrowhead)"
                opacity="0.8"
              />
            );
          })}
          
          {/* 화살표 마커 정의 */}
          <defs>
            <marker id="arrowhead" markerWidth="12" markerHeight="9" 
                    refX="10" refY="4.5" orient="auto">
              <polygon points="0 0, 12 4.5, 0 9" fill="hsl(var(--muted-foreground))" opacity="0.8" />
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
                    x={node.x - 66}
                    y={node.y - 43}
                    width="132"
                    height="86"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    rx="15"
                    opacity="0.6"
                    strokeDasharray="4,4"
                  />
                )}
                
                {/* 노드 본체 - 모든 노드가 사각형 (1.5배 확대) */}
                <rect
                  x={node.x - 60}
                  y={node.y - 37}
                  width="120"
                  height="75"
                  fill={color}
                  stroke={strokeColor}
                  strokeWidth="2.2"
                  rx="9"
                  className={`drop-shadow-sm transition-all duration-200 ${
                    isDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:brightness-110'
                  }`}
                  onClick={() => !isDisabled && onNodeClick(node)}
                />
                
                {/* 라벨 (1.5배 확대) */}
                <text
                  x={node.x}
                  y={node.y + 7}
                  textAnchor="middle"
                  className={`text-lg font-semibold pointer-events-none select-none ${
                    isDisabled ? 'opacity-60 fill-muted-foreground' : 'fill-foreground'
                  }`}
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* 범례 (확대) */}
      <div className="flex flex-wrap gap-8 justify-center text-base text-muted-foreground">
        <div className={`flex gap-3 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-1 opacity-80" style={{ backgroundColor: 'hsl(var(--muted-foreground))' }}></div>
          <span>{t('범례_실선')}</span>
        </div>
        <div className={`flex gap-3 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-1 border-dashed opacity-80 border-t-3" style={{ borderColor: 'hsl(var(--muted-foreground))' }}></div>
          <span>{t('범례_점선')}</span>
        </div>
        <div className={`flex gap-3 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div 
            className="w-5 h-5 rounded-sm border-dashed opacity-80 border-3" 
            style={{ 
              backgroundColor: 'hsl(var(--primary))', 
              borderColor: 'hsl(var(--primary))' 
            }}
          ></div>
          <span>{t('범례_선택됨')}</span>
        </div>
        <div className={`flex gap-3 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div 
            className="w-5 h-5 rounded-sm opacity-50" 
            style={{ 
              backgroundColor: 'hsl(var(--muted))',
              border: '1.5px solid hsl(var(--muted-foreground) / 0.3)'
            }}
          ></div>
          <span>{t('범례_준비중')}</span>
        </div>
      </div>
      </div>
    </div>
  );
}
// #endregion
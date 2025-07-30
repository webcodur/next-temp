'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

// 조직 노드 (중앙 상단, 하단에 연결점)
export function OrganizationNode({ data }: NodeProps) {
  return (
    <div className="relative bg-blue-500 text-white border-2 border-blue-600 rounded-lg px-6 py-4 font-medium cursor-pointer hover:bg-blue-600 transition-colors">
      {/* 좌하단으로 가는 연결점 (개인 노드용) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="to-person"
        style={{
          background: '#fff',
          border: '2px solid #3b82f6',
          width: '8px',
          height: '8px',
          left: '25%',
          bottom: '-4px',
        }}
      />
      
      {/* 우하단으로 가는 연결점 (차량 노드용) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="to-vehicle"
        style={{
          background: '#fff',
          border: '2px solid #3b82f6',
          width: '8px',
          height: '8px',
          right: '25%',
          bottom: '-4px',
        }}
      />
      
      <span>{data.label}</span>
    </div>
  );
}

// 개인 노드 (좌하단)
export function PersonNode({ data }: NodeProps) {
  return (
    <div className="relative bg-orange-400 text-white border-2 border-orange-600 rounded-lg px-5 py-3 font-medium cursor-pointer hover:bg-orange-500 transition-colors">
      {/* 우상단 연결점 (조직에서 들어오는 연결) */}
      <Handle
        type="target"
        position={Position.Top}
        id="from-organization"
        style={{
          background: '#fff',
          border: '2px solid #f59e0b',
          width: '8px',
          height: '8px',
          right: '25%',
          top: '-4px',
        }}
      />
      
      <span>{data.label}</span>
    </div>
  );
}

// 차량 노드 (우하단)
export function VehicleNode({ data }: NodeProps) {
  return (
    <div className="relative bg-red-500 text-white border-2 border-red-600 rounded-lg px-5 py-3 font-medium cursor-pointer hover:bg-red-600 transition-colors">
      {/* 좌상단 연결점 (조직에서 들어오는 연결) */}
      <Handle
        type="target"
        position={Position.Top}
        id="from-organization"
        style={{
          background: '#fff',
          border: '2px solid #ef4444',
          width: '8px',
          height: '8px',
          left: '25%',
          top: '-4px',
        }}
      />
      
      <span>{data.label}</span>
    </div>
  );
}
'use client';

import React from 'react';
import NestedTabs from '@/components/ui/ui-layout/nested-tabs/NestedTabs';
import type { TopTab } from '@/components/ui/ui-layout/nested-tabs/NestedTabs';
import { Settings, BarChart2, User, Server, Activity, Eye } from 'lucide-react';

const SampleContent = ({ title }: { title: string }) => (
  <div>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p>이것은 {title} 탭의 샘플 콘텐츠입니다.</p>
  </div>
);

const nestedTabsData: TopTab[] = [
  {
    id: 'config',
    label: '환경설정',
    icon: <Settings className="w-4 h-4" />,
    subTabs: [
      { id: 'user', label: '사용자', icon: <User className="w-4 h-4" />, content: <SampleContent title="사용자 설정" /> },
      { id: 'system', label: '시스템', icon: <Server className="w-4 h-4" />, content: <SampleContent title="시스템 설정" /> },
    ],
  },
  {
    id: 'monitoring',
    label: '모니터링',
    icon: <BarChart2 className="w-4 h-4" />,
    subTabs: [
      { id: 'realtime', label: '실시간', icon: <Activity className="w-4 h-4" />, content: <SampleContent title="실시간 대시보드" /> },
      { id: 'logs', label: '로그', icon: <Eye className="w-4 h-4" />, content: <SampleContent title="로그 뷰어" /> },
    ],
  },
];

const NestedTabsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Nested Tabs</h1>
      <div className="max-w-4xl mx-auto">
        <NestedTabs tabs={nestedTabsData} />
      </div>
    </div>
  );
};

export default NestedTabsPage; 
'use client';

import React from 'react';
import NestedTabs from '@/components/ui/ui-layout/nested-tabs/NestedTabs';
import type { TopTab } from '@/components/ui/ui-layout/nested-tabs/NestedTabs';
import { Settings, BarChart2, User, Server, Activity, Eye } from 'lucide-react';
import { useTranslations } from '@/hooks/useI18n';

const NestedTabsPage = () => {
  const t = useTranslations();

  const SampleContent = ({ title }: { title: string }) => (
    <div className="font-multilang">
      <h3 className="text-lg font-semibold font-multilang">{title}</h3>
      <p className="font-multilang">{t('중첩탭테스트_샘플콘텐츠').replace('{title}', title)}</p>
    </div>
  );

  const nestedTabsData: TopTab[] = [
    {
      id: 'config',
      label: t('중첩탭테스트_환경설정'),
      icon: <Settings className="w-4 h-4" />,
      subTabs: [
        { 
          id: 'user', 
          label: t('중첩탭테스트_사용자'), 
          icon: <User className="w-4 h-4" />, 
          content: <SampleContent title={t('중첩탭테스트_사용자설정')} /> 
        },
        { 
          id: 'system', 
          label: t('중첩탭테스트_시스템'), 
          icon: <Server className="w-4 h-4" />, 
          content: <SampleContent title={t('중첩탭테스트_시스템설정')} /> 
        },
      ],
    },
    {
      id: 'monitoring',
      label: t('중첩탭테스트_모니터링'),
      icon: <BarChart2 className="w-4 h-4" />,
      subTabs: [
        { 
          id: 'realtime', 
          label: t('중첩탭테스트_실시간'), 
          icon: <Activity className="w-4 h-4" />, 
          content: <SampleContent title={t('중첩탭테스트_실시간대시보드')} /> 
        },
        { 
          id: 'logs', 
          label: t('중첩탭테스트_로그'), 
          icon: <Eye className="w-4 h-4" />, 
          content: <SampleContent title={t('중첩탭테스트_로그뷰어')} /> 
        },
      ],
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 font-multilang">{t('중첩탭테스트_제목')}</h1>
      <div className="max-w-4xl mx-auto">
        <NestedTabs tabs={nestedTabsData} />
      </div>
    </div>
  );
};

export default NestedTabsPage; 
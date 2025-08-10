'use client';

import React from 'react';
import Timeline, { TimelineItem } from './Timeline';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';

export default function TimelineExample() {
  const t = useTranslations();

  const items: TimelineItem[] = [
    {
      id: '1',
      title: t('타임라인_이벤트1'),
      content: t('타임라인_이벤트1설명'),
      timestamp: '2024-01-01',
      status: 'completed',
    },
    {
      id: '2',
      title: t('타임라인_이벤트2'),
      content: t('타임라인_이벤트2설명'),
      timestamp: '2024-02-01',
      status: 'current',
    },
    {
      id: '3',
      title: t('타임라인_이벤트3'),
      content: t('타임라인_이벤트3설명'),
      timestamp: '2024-03-01',
      status: 'upcoming',
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Timeline</h1>
      <Timeline items={items} />
    </div>
  );
} 
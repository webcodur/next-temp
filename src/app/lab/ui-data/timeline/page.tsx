'use client';

import React from 'react';
import Timeline, { TimelineEvent } from '@/components/ui/ui-data/timeline/Timeline';
import { useTranslations } from '@/hooks/useI18n';

export default function TimelinePage() {
  const t = useTranslations();

  const events: TimelineEvent[] = [
    {
      id: '1',
      timestamp: '2024-01-01',
      title: t('타임라인_이벤트1'),
      description: t('타임라인_이벤트1설명'),
    },
    {
      id: '2',
      timestamp: '2024-02-01',
      title: t('타임라인_이벤트2'),
      description: t('타임라인_이벤트2설명'),
    },
    {
      id: '3',
      timestamp: '2024-03-01',
      title: t('타임라인_이벤트3'),
      description: t('타임라인_이벤트3설명'),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Timeline</h1>
      <Timeline events={events} />
    </div>
  );
} 
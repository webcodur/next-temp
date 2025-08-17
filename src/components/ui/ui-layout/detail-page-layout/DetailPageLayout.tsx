/* 
  파일명: DetailPageLayout.tsx
  기능: 상세 페이지들의 공통 레이아웃 컴포넌트
  책임: 헤더, 탭 네비게이션, 콘텐츠 영역의 일관된 레이아웃 제공
*/

'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import { useBackNavigation } from '@/hooks/useBackNavigation';

interface Tab {
  id: string;
  label: string;
  href: string;
}

interface DetailPageLayoutProps {
  title: string;
  subtitle?: string;
  tabs: Tab[];
  activeTabId: string;
  fallbackPath: string;
  hasChanges?: boolean;
  children: React.ReactNode;
}

export default function DetailPageLayout({
  title,
  subtitle,
  tabs,
  activeTabId,
  fallbackPath,
  hasChanges = false,
  children,
}: DetailPageLayoutProps) {
  const router = useRouter();
  
  const { handleBack } = useBackNavigation({
    fallbackPath,
    hasChanges
  });

  // 탭 클릭 시 해당 href로 페이지 이동
  const handleTabChange = (tabId: string) => {
    const targetTab = tabs.find(tab => tab.id === tabId);
    if (targetTab?.href) {
      router.push(targetTab.href);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <PageHeader 
        title={title}
        subtitle={subtitle}
        leftActions={
          <Button
            variant="secondary"
            size="default"
            onClick={handleBack}
            title="뒤로가기"
          >
            <ArrowLeft size={16} />
            뒤로가기
          </Button>
        }
      />

      {/* 탭과 콘텐츠 */}
      <div className="flex flex-col">
        <Tabs
          tabs={tabs}
          activeId={activeTabId}
          onTabChange={handleTabChange}
        />

        {/* 콘텐츠 영역 */}
        <div className="p-6 rounded-b-lg border-b-2 border-s-2 border-e-2 border-border bg-background">
          {children}
        </div>
      </div>
    </div>
  );
}

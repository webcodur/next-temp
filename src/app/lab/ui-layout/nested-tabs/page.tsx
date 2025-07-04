'use client';

import React from 'react';
import NestedTabs, { TopTab } from '@/components/ui/ui-layout/nested-tabs/NestedTabs';
import { Settings, BarChart2, User, Server, Activity, Eye } from 'lucide-react';

// 샘플 컨텐츠 컴포넌트
const SampleContent = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="p-4 rounded-lg bg-muted/50">
    <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
    <div className="text-muted-foreground">{children || '샘플 컨텐츠 영역입니다.'}</div>
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
		<div className="p-8 min-h-screen font-sans bg-background">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8">
					<h1 className="mb-4 text-3xl font-bold text-foreground">NestedTabs 컴포넌트</h1>
					<p className="text-muted-foreground">2단계 중첩 탭 기능을 제공하는 컴포넌트 테스트</p>
				</div>

				<div className="space-y-12">
					{/* 기본 중첩 탭 */}
					<section>
						<h2 className="mb-4 text-xl font-semibold text-foreground">기본 중첩 탭</h2>
						<div className="p-6 rounded-lg bg-card neu-flat">
							<NestedTabs tabs={nestedTabsData} />
						</div>
					</section>

					{/* Filled variant & Center-aligned */}
					<section>
						<h2 className="mb-4 text-xl font-semibold text-foreground">Filled Variant / Center Align / LG Size</h2>
						<div className="p-6 rounded-lg bg-card neu-flat">
							<NestedTabs 
								tabs={nestedTabsData} 
								variant="filled" 
								align="center"
								size="lg"
							/>
						</div>
					</section>
					
					{/* End-aligned */}
					<section>
						<h2 className="mb-4 text-xl font-semibold text-foreground">End Align / SM Size</h2>
						<div className="p-6 rounded-lg bg-card neu-flat">
							<NestedTabs 
								tabs={nestedTabsData} 
								align="end"
								size="sm"
							/>
						</div>
					</section>
					
					<section>
						<h2 className="mb-4 text-xl font-semibold text-foreground">주요 기능</h2>
						<div className="p-6 rounded-lg bg-card neu-flat">
							<ul className="space-y-2 list-disc list-inside text-muted-foreground">
								<li>2단계 중첩 구조 지원</li>
								<li>1, 2단계 탭 상태 독립적 관리</li>
								<li>아이콘 및 텍스트 레이블 지원</li>
								<li>`variant`, `align`, `size` props를 통한 유연한 스타일링</li>
								<li>뉴모피즘 디자인 시스템 적용</li>
								<li>`useMemo`를 통한 렌더링 최적화</li>
							</ul>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default NestedTabsPage; 
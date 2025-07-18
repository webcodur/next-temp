import React from 'react';
import { Metadata } from 'next';

import SectionPanelExample from '@/components/ui/ui-layout/section-panel/section-panel.example';

export const metadata: Metadata = {
	title: 'SectionPanel | UI Lab',
	description: '섹션 패널 컴포넌트 테스트 페이지',
};

export default function SectionPanelPage() {
	return <SectionPanelExample />;
} 
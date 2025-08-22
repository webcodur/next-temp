'use client';

import React from 'react';
import { FlatContainer } from '@/components/ui/ui-layout/neumorphicContainer/Container-Flat';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';

export default function CommunityBoardPage() {
	const tabs = [
		{
			id: 'app-board',
			label: '앱 게시판',
			content: (
				<div>
					<h2 className="mb-4 text-2xl font-bold">앱 게시판</h2>
					<p>입주민들을 위한 일반 게시판입니다.</p>
				</div>
			),
		},
		{
			id: 'one-to-one',
			label: '일대일 게시판',
			content: (
				<div>
					<h2 className="mb-4 text-2xl font-bold">일대일 게시판</h2>
					<p>관리사무소와의 일대일 문의 게시판입니다.</p>
				</div>
			),
		},
		{
			id: 'suggestions',
			label: '신문고',
			content: (
				<div>
					<h2 className="mb-4 text-2xl font-bold">신문고 관리</h2>
					<p>입주민 건의사항 및 제안 관리</p>
				</div>
			),
		},
	];

	return (
		<FlatContainer>
			<div className="mb-6">
				<h1 className="text-3xl font-bold">게시판 관리</h1>
				<p className="mt-2 text-gray-600">커뮤니티 게시판 통합 관리</p>
			</div>

			<Tabs tabs={tabs} activeId="app-board" onTabChange={() => {}} />
		</FlatContainer>
	);
} 
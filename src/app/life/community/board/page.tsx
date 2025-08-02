'use client';

import React from 'react';
import { Container } from '@/components/ui/ui-layout/Container';
import { Tabs } from '@/components/ui/ui-layout/Tabs';

export default function CommunityBoardPage() {
	const tabs = [
		{
			id: 'app-board',
			label: '앱 게시판',
			content: (
				<div>
					<h2 className="text-2xl font-bold mb-4">앱 게시판</h2>
					<p>입주민들을 위한 일반 게시판입니다.</p>
				</div>
			),
		},
		{
			id: 'one-to-one',
			label: '일대일 게시판',
			content: (
				<div>
					<h2 className="text-2xl font-bold mb-4">일대일 게시판</h2>
					<p>관리사무소와의 일대일 문의 게시판입니다.</p>
				</div>
			),
		},
		{
			id: 'suggestions',
			label: '신문고',
			content: (
				<div>
					<h2 className="text-2xl font-bold mb-4">신문고 관리</h2>
					<p>입주민 건의사항 및 제안 관리</p>
				</div>
			),
		},
	];

	return (
		<Container>
			<div className="mb-6">
				<h1 className="text-3xl font-bold">게시판 관리</h1>
				<p className="text-gray-600 mt-2">커뮤니티 게시판 통합 관리</p>
			</div>

			<Tabs tabs={tabs} defaultTab="app-board" />
		</Container>
	);
} 
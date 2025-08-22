'use client';

import React from 'react';
import { FlatContainer } from '@/components/ui/ui-layout/neumorphicContainer/Container-Flat';

export default function ElectionPage() {
	return (
		<FlatContainer>
			<h1 className="mb-6 text-3xl font-bold">선거 투표</h1>
			<p>선거 투표 관리 페이지</p>
		</FlatContainer>
	);
}
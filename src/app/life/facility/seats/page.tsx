'use client';

import React from 'react';
import { Container } from '@/components/ui/ui-layout/Container';
import { Table } from '@/components/ui/ui-data/Table';

export default function SeatsPage() {
	const columns = [
		{ key: 'seatNumber', label: '좌석 번호', width: '15%' },
		{ key: 'facility', label: '시설명', width: '20%' },
		{ key: 'status', label: '상태', width: '15%' },
		{ key: 'user', label: '이용자', width: '20%' },
		{ key: 'time', label: '이용 시간', width: '30%' },
	];

	const data = [
		{
			seatNumber: 'A-01',
			facility: '독서실',
			status: '사용중',
			user: '홍길동',
			time: '09:00 - 12:00',
		},
		{
			seatNumber: 'B-05',
			facility: '회의실',
			status: '예약',
			user: '김철수',
			time: '14:00 - 16:00',
		},
	];

	return (
		<Container>
			<div className="mb-6">
				<h1 className="text-3xl font-bold">지정석 목록</h1>
				<p className="text-gray-600 mt-2">시설별 지정석 예약 및 이용 현황</p>
			</div>

			<Table
				columns={columns}
				data={data}
				className="mt-4"
			/>
		</Container>
	);
}
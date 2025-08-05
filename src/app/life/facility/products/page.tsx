'use client';

import React from 'react';
import { FlatContainer } from '@/components/ui/ui-layout/neumorphicContainer/FlatContainer';
// import { BaseTable } from '@/components/ui/ui-data/baseTable/BaseTable';

export default function ProductsPage() {
	// const columns = [
	// 	{ key: 'productName', label: '상품명', width: '25%' },
	// 	{ key: 'facility', label: '시설', width: '20%' },
	// 	{ key: 'price', label: '이용 요금', width: '15%' },
	// 	{ key: 'duration', label: '이용 시간', width: '20%' },
	// 	{ key: 'status', label: '상태', width: '20%' },
	// ];

	// const data = [
	// 	{
	// 		productName: '회의실 2시간 이용권',
	// 		facility: '대회의실',
	// 		price: '20,000원',
	// 		duration: '2시간',
	// 		status: '판매중',
	// 	},
	// 	{
	// 		productName: '헬스장 월 이용권',
	// 		facility: '피트니스센터',
	// 		price: '50,000원',
	// 		duration: '1개월',
	// 		status: '판매중',
	// 	},
	// 	{
	// 		productName: '독서실 일일 이용권',
	// 		facility: '독서실',
	// 		price: '5,000원',
	// 		duration: '1일',
	// 		status: '판매중',
	// 	},
	// ];

	return (
		<FlatContainer>
			<div className="mb-6">
				<h1 className="text-3xl font-bold">상품 목록</h1>
				<p className="mt-2 text-gray-600">시설별 이용 상품 관리</p>
			</div>

			{/* <BaseTable
				columns={columns}
				data={data}
				className="mt-4"
			/> */}
		</FlatContainer>
	);
}
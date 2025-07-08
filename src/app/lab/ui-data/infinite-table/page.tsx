'use client';

import React, { useState, useEffect } from 'react';
import { InfiniteSmartTable } from '@/components/ui/ui-data/infiniteSmartTable/InfiniteSmartTable';
import { SmartTableColumn } from '@/components/ui/ui-data/smartTable/SmartTable';
import { useTranslations } from '@/hooks/useI18n';

// #region 타입 및 초기 데이터 생성 함수
interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

const PAGE_SIZE = 20;

const createFakeUsers = (startId: number, count: number): User[] =>
	Array.from({ length: count }, (_, idx) => {
		const id = startId + idx;
		return {
			id,
			name: `사용자 ${id}`,
			email: `user${id}@example.com`,
			role: id % 3 === 0 ? '관리자' : id % 2 === 0 ? '편집자' : '사용자',
		};
	});
// #endregion

export default function InfiniteTablePage() {
	const t = useTranslations();

	// #region 상태 관리
	const [users, setUsers] = useState<User[]>([]);
	const [page, setPage] = useState(0);
	const [isFetching, setFetching] = useState(false);
	const TOTAL_PAGES = 5; // 총 100개 데이터 (20 * 5)
	// #endregion

	// 초기 로드
	useEffect(() => {
		loadMore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// #region loadMore 로직
	const loadMore = async () => {
		if (isFetching) return;
		setFetching(true);
		// 네트워크 지연 시뮬레이션
		await new Promise((r) => setTimeout(r, 600));
		const newUsers = createFakeUsers(page * PAGE_SIZE + 1, PAGE_SIZE);
		setUsers((prev) => [...prev, ...newUsers]);
		setPage((p) => p + 1);
		setFetching(false);
	};
	// #endregion

	// #region 컬럼 정의
	const columns: SmartTableColumn<User>[] = [
		{ key: 'id', header: t('테이블_ID'), align: 'center', width: '80px' },
		{ key: 'name', header: t('테이블_이름'), width: '140px' },
		{ key: 'email', header: t('테이블_이메일'), width: '220px' },
		{ key: 'role', header: t('테이블_역할'), align: 'center', width: '120px' },
	];
	// #endregion

	return (
		<div className="p-6 mx-auto max-w-6xl font-multilang">
			<h1 className="mb-6 text-2xl font-bold">{t('무한_스마트_테이블_데모')}</h1>
			<InfiniteSmartTable
				data={users}
				columns={columns}
				loadMore={loadMore}
				hasMore={page < TOTAL_PAGES}
				isFetching={isFetching}
				pageSize={PAGE_SIZE}
			/>
		</div>
	);
} 
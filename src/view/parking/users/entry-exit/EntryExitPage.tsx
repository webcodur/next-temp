'use client';
import React from 'react';
import { SmartTable, SmartTableColumn } from '@/components/ui/ui-data/smartTable/SmartTable';
import { usePageDescription } from '@/hooks/usePageDescription';
import { useLocale } from '@/hooks/useI18n';

// -----------------------------------------------------------------------------
// 타입 정의
// -----------------------------------------------------------------------------
interface EntryExitRecord {
  id: number;
  user: string;
  vehicle: string;
  entryTime: string;
  exitTime: string;
  status: 'in' | 'out';
}

export default function EntryExitPage() {
  // 페이지 설명 설정 (브라우저 탭 및 SEO)
  usePageDescription('사용자 차량의 입출차 기록을 조회합니다.');
  const { isRTL } = useLocale();

  // ---------------------------------------------------------------------------
  // MOCK 데이터 (API 연동 전 임시)
  // ---------------------------------------------------------------------------
  const data: EntryExitRecord[] = [
    {
      id: 1,
      user: '홍길동',
      vehicle: '12가 3456',
      entryTime: '2024-07-08 09:15',
      exitTime: '2024-07-08 18:02',
      status: 'out',
    },
    {
      id: 2,
      user: '김영희',
      vehicle: '34나 7890',
      entryTime: '2024-07-08 08:47',
      exitTime: '-',
      status: 'in',
    },
    {
      id: 3,
      user: 'John Doe',
      vehicle: '56다 1234',
      entryTime: '2024-07-08 10:20',
      exitTime: '-',
      status: 'in',
    },
    {
      id: 4,
      user: '이영수',
      vehicle: '78라 5678',
      entryTime: '2024-07-08 07:55',
      exitTime: '2024-07-08 12:30',
      status: 'out',
    },
    {
      id: 5,
      user: 'Sarah Lee',
      vehicle: '90마 9012',
      entryTime: '2024-07-08 11:05',
      exitTime: '-',
      status: 'in',
    },
  ];

  // ---------------------------------------------------------------------------
  // 테이블 컬럼 정의
  // ---------------------------------------------------------------------------
  const columns: SmartTableColumn<EntryExitRecord>[] = [
    { key: 'id', header: 'ID', width: '60px', align: 'center', sortable: true },
    { key: 'user', header: '사용자', sortable: true },
    { key: 'vehicle', header: '차량번호', sortable: true },
    { key: 'entryTime', header: '입차 시간', sortable: true },
    { key: 'exitTime', header: '출차 시간', sortable: true },
    {
      key: 'status',
      header: '상태',
      sortable: true,
      render: value => (value === 'in' ? '입차' : '출차'),
    },
  ];

  // ---------------------------------------------------------------------------
  // 렌더링
  // ---------------------------------------------------------------------------
  return (
    <main
      className="flex flex-col gap-6 p-4 mx-auto w-full max-w-6xl"
      dir={isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <h1 className="text-2xl font-semibold text-foreground font-multilang">
        사용자 입출차 기록
      </h1>

      <SmartTable data={data} columns={columns} pageSize={10} />
    </main>
  );
} 
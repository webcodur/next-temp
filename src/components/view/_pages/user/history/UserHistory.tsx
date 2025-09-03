/* 사용자 이력 섹션 컴포넌트 */
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Home } from 'lucide-react';

// UI 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';

// 서비스
import { getUserHistory } from '@/services/users';

// 타입
import { UserDetail } from '@/types/user';

interface UserHistorySectionProps {
  user: UserDetail;
}

interface UserInstanceHistory {
  id: number;
  userId: number;
  instanceId: number;
  memo?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  isActive: boolean;
  instance: {
    id: number;
    parkinglotId: number;
    name: string;
    address1Depth: string;
    address2Depth: string;
    address3Depth?: string | null;
    instanceType: string;
    password: string;
    memo?: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    parkinglot: {
      id: number;
      code: string;
      name: string;
      description?: string | null;
      createdAt: string;
      updatedAt: string;
      deletedAt?: string | null;
    };
  } | null;
}

export default function UserHistorySection({ user }: UserHistorySectionProps) {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<UserInstanceHistory[]>([]);
  
  // #region 인스턴스 유형 매핑
  const instanceTypeMap = {
    GENERAL: '일반',
    TEMP: '임시', 
    COMMERCIAL: '상업',
  } as const;
  
  const getInstanceTypeLabel = (type?: string | null) => {
    if (!type) return '-';
    return instanceTypeMap[type as keyof typeof instanceTypeMap] || type;
  };
  // #endregion
  
  // #region 거주 이력 데이터 로딩
  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const result = await getUserHistory(user.id);
        if (result.success && result.data && result.data.instanceHistory) {
          const processedData = result.data.instanceHistory.map(history => ({
            ...history,
            isActive: !history.deletedAt
          })).sort((a, b) => {
            // 활성 거주지를 먼저, 그 다음 생성일 내림차순
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setHistoryData(processedData);
        }
      } catch (error) {
        console.error('거주 이력 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user.id]);
  // #endregion

  // #region 이벤트 핸들러
  const handleInstanceClick = useCallback((instanceId: number) => {
    router.push(`/parking/occupancy/instance/${instanceId}`);
  }, [router]);
  // #endregion

  // #region 테이블 컬럼 정의
  const columns: BaseTableColumn<UserInstanceHistory>[] = [
    {
      header: '상태',
      key: 'isActive',
      align: 'center',
      minWidth: '120px',
      cell: (item: UserInstanceHistory) => (
        <div className="flex justify-center">
          {item.isActive ? (
            <span className="inline-flex gap-1 items-center px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              현재 거주
            </span>
          ) : (
            <span className="inline-flex gap-1 items-center px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              이전 거주
            </span>
          )}
        </div>
      ),
    },
    {
      header: '세대 ID',
      key: 'instanceId',
      minWidth: '180px',
      cell: (item: UserInstanceHistory) => (
        <div className="flex gap-2 items-center">
          <Home className="h-3.5 w-3.5 text-blue-500" />
          <span 
            className="font-medium text-blue-600 cursor-pointer hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              handleInstanceClick(item.instanceId);
            }}
          >
            세대 #{item.instanceId}
          </span>
        </div>
      ),
    },
    {
      header: '주소',
      key: 'address',
      minWidth: '360px',
      cell: (item: UserInstanceHistory) => (
        <div className="flex gap-2 items-center">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          <div className="text-sm">
            {item.instance ? [
              item.instance.address1Depth,
              item.instance.address2Depth,
              item.instance.address3Depth
            ].filter(Boolean).join(' ') : '-'}
          </div>
        </div>
      ),
    },
    {
      header: '세대 유형',
      key: 'instanceType',
      align: 'center',
      minWidth: '140px',
      cell: (item: UserInstanceHistory) => (
        <div className="text-center">
          <div className="text-sm">{getInstanceTypeLabel(item.instance?.instanceType)}</div>
        </div>
      ),
    },
    {
      header: '거주 기간',
      key: 'period',
      align: 'center',
      minWidth: '220px',
      cell: (item: UserInstanceHistory) => (
        <div className="flex flex-col gap-1 items-center">
          <div className="flex gap-1 items-center text-sm">
            <Calendar className="w-3 h-3 text-gray-400" />
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            {item.deletedAt ? (
              `~ ${new Date(item.deletedAt).toLocaleDateString()}`
            ) : (
              '현재까지'
            )}
          </div>
        </div>
      ),
    },
    {
      header: '메모',
      key: 'memo',
      minWidth: '180px',
      cell: (item: UserInstanceHistory) => (
        <div className="text-sm text-gray-600">
          {item.memo || '-'}
        </div>
      ),
    },
  ];
  // #endregion

  // #region 렌더링
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="w-1/4 h-8 bg-gray-200 rounded"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!loading && historyData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-12 text-center">
        <Home className="mb-4 w-12 h-12 text-gray-300" />
        <h3 className="mb-2 text-lg font-semibold text-gray-600">거주 이력이 없습니다</h3>
        <p className="mb-6 text-muted-foreground">
          아직 등록된 거주 이력이 없습니다.
        </p>
        <Button onClick={() => router.push(`/parking/occupancy/user`)}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 테이블 */}
      <PaginatedTable
        data={historyData as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        pageSize={10}
        pageSizeOptions={[5, 10, 20]}
        itemName="거주 이력"
        isFetching={loading}
      />
    </div>
  );
  // #endregion
}
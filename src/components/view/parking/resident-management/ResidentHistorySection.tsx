'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { History, Calendar } from 'lucide-react';

import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import { getResidentHistory } from '@/services/residents/residents@id_history_GET';
import { ResidentDetail } from '@/types/resident';

interface ResidentHistoryItem {
  id: number;
  residentId: number;
  instanceId: number;
  memo?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  instance: {
    id: number;
    parkinglotId: number;
    address1Depth: string;
    address2Depth: string;
    address3Depth?: string | null;
    instanceType: string;
    memo?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface ResidentHistorySectionProps {
  resident: ResidentDetail;
}

export default function ResidentHistorySection({ 
  resident 
}: ResidentHistorySectionProps) {
  // #region 상태 관리
  const [historyList, setHistoryList] = useState<ResidentHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // #endregion

  // #region 데이터 로드
  const loadHistoryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getResidentHistory(resident.id);
      
      if (result.success) {
        // 데이터가 배열인지 확인
        const historyData = Array.isArray(result.data) ? result.data : [];
        setHistoryList(historyData);
      } else {
        console.error('이동 이력 조회 실패:', result.errorMsg);
        setError(`이동 이력을 불러올 수 없습니다: ${result.errorMsg}`);
        setHistoryList([]);
      }
    } catch (error) {
      console.error('이동 이력 조회 중 오류:', error);
      setError('이동 이력을 불러오는 중 오류가 발생했습니다.');
      setHistoryList([]);
    } finally {
      setLoading(false);
    }
  }, [resident.id]);

  useEffect(() => {
    loadHistoryData();
  }, [loadHistoryData]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<ResidentHistoryItem>[] = [
    {
      key: 'instanceId',
      header: '호실 ID',
      width: '10%',
      align: 'center',
    },
    {
      key: 'address',
      header: '주소',
      width: '25%',
      align: 'start',
      cell: (item: ResidentHistoryItem) => {
        if (item.instance) {
          const { address1Depth, address2Depth, address3Depth } = item.instance;
          return `${address1Depth} ${address2Depth} ${address3Depth || ''}`.trim();
        }
        return '정보 없음';
      },
    },
    {
      key: 'instanceType',
      header: '호실 타입',
      width: '12%',
      align: 'center',
      cell: (item: ResidentHistoryItem) => {
        if (item.instance) {
          const typeMap = {
            GENERAL: '일반',
            TEMP: '임시',
            COMMERCIAL: '상업',
          };
          return typeMap[item.instance.instanceType as keyof typeof typeMap] || item.instance.instanceType;
        }
        return '-';
      },
    },
    {
      key: 'memo',
      header: '메모',
      width: '20%',
      align: 'start',
      cell: (item: ResidentHistoryItem) => item.memo || '-',
    },
    {
      key: 'createdAt',
      header: '입주일',
      width: '12%',
      align: 'center',
      cell: (item: ResidentHistoryItem) => {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      },
    },
    {
      key: 'deletedAt',
      header: '퇴거일',
      width: '12%',
      align: 'center',
      cell: (item: ResidentHistoryItem) => {
        if (item.deletedAt) {
          const date = new Date(item.deletedAt);
          return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        }
        return '현재 거주';
      },
    },
    {
      key: 'status',
      header: '상태',
      width: '9%',
      align: 'center',
      cell: (item: ResidentHistoryItem) => {
        if (item.deletedAt) {
          return <span className="text-muted-foreground">퇴거</span>;
        }
        return <span className="font-medium text-green-600">거주중</span>;
      },
    },
  ];
  // #endregion

  // #region 통계 계산
  const stats = {
    total: Array.isArray(historyList) ? historyList.length : 0,
    current: Array.isArray(historyList) ? historyList.filter(item => !item.deletedAt).length : 0,
    past: Array.isArray(historyList) ? historyList.filter(item => item.deletedAt).length : 0,
  };
  // #endregion

  return (
    <div className="space-y-6">
      {/* 이동 이력 통계 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 text-center rounded-lg border bg-card border-border">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">총 거주 이력</div>
        </div>
        <div className="p-4 text-center rounded-lg border bg-card border-border">
          <div className="text-2xl font-bold text-green-600">{stats.current}</div>
          <div className="text-sm text-muted-foreground">현재 거주</div>
        </div>
        <div className="p-4 text-center rounded-lg border bg-card border-border">
          <div className="text-2xl font-bold text-muted-foreground">{stats.past}</div>
          <div className="text-sm text-muted-foreground">과거 거주</div>
        </div>
      </div>

      {/* 이동 이력 목록 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <div className="flex gap-2 items-center mb-4">
          <History size={20} />
          <h2 className="text-lg font-semibold text-foreground">
            호실 이동 이력
          </h2>
          <div className="flex gap-1 items-center ml-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span>시간순 정렬</span>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            이동 이력을 불러오는 중...
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="mb-2 text-red-600">오류 발생</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : Array.isArray(historyList) && historyList.length > 0 ? (
          <BaseTable
            data={historyList as unknown as Record<string, unknown>[]}
            columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
            pageSize={20}
          />
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            이동 이력이 없습니다.
          </div>
        )}
      </div>

      {/* 이력 설명 */}
      <div className="p-4 rounded-lg border bg-muted/50 border-border">
        <h4 className="mb-2 text-sm font-medium text-foreground">이동 이력 안내</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• 호실 이동 시 이전 거주지는 자동으로 퇴거 처리됩니다.</li>
          <li>• 삭제된 관계도 이력에서 확인할 수 있습니다.</li>
          <li>• &ldquo;현재 거주&rdquo; 상태는 퇴거일이 없는 관계를 의미합니다.</li>
        </ul>
      </div>
    </div>
  );
}

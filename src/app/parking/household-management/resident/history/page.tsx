'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import { searchResident } from '@/services/resident/resident$_GET';
import { getResidentHistory } from '@/services/resident/resident@id_history_GET';

// #region 타입 정의
interface SearchFormData {
  name: string;
  startDate: string;
  endDate: string;
}

interface HistoryItem {
  id: string;
  type: 'new' | 'move' | 'leave';
  residentName: string;
  description: string;
  date: string;
  reason?: string;
  details: string;
}
// #endregion

export default function ResidentHistoryPage() {
  // #region 상태 관리
  const [searchForm, setSearchForm] = useState<SearchFormData>({
    name: '',
    startDate: '',
    endDate: '',
  });
  
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  // #endregion

  // #region 이벤트 핸들러
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      // 거주자 검색
      const residentResponse = await searchResident({
        page: 1,
        limit: 100,
        name: searchForm.name || undefined,
      });

      if (!residentResponse.success) {
        throw new Error(residentResponse.errorMsg || '거주자 검색 실패');
      }

      const foundResidents = residentResponse.data?.data || [];

      // 각 거주자의 이력을 가져와서 통합
      const allHistoryItems: HistoryItem[] = [];
      
      for (const resident of foundResidents) {
        try {
          const historyResponse = await getResidentHistory(resident.id);
          
          if (historyResponse.success && historyResponse.data) {
            // API 응답에서 이력 데이터 변환
            // 실제 API 구조에 따라 이 부분은 조정이 필요할 수 있음
            const residentHistories = historyResponse.data.data || [];
            
            residentHistories.forEach((historyItem: unknown, index: number) => {
              const item = historyItem as Record<string, unknown>;
              allHistoryItems.push({
                id: `${resident.id}-${index}`,
                type: 'move', // 기본값, 실제 데이터에 따라 조정
                residentName: resident.name,
                description: `${resident.name} - 이동 이력`,
                date: (item.createdAt as string) || new Date().toISOString(),
                details: '상세 정보는 API 응답 구조에 따라 조정이 필요함',
              });
            });
          }
        } catch (historyError) {
          console.warn(`거주자 ${resident.name}의 이력 조회 실패:`, historyError);
        }
      }

      // 날짜 필터링
      let filteredHistories = allHistoryItems;
      if (searchForm.startDate) {
        filteredHistories = filteredHistories.filter(item => 
          new Date(item.date) >= new Date(searchForm.startDate)
        );
      }
      if (searchForm.endDate) {
        filteredHistories = filteredHistories.filter(item => 
          new Date(item.date) <= new Date(searchForm.endDate)
        );
      }

      // 날짜순 정렬 (최신순)
      filteredHistories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setHistoryItems(filteredHistories);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setHistoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof SearchFormData) => (value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setSearchForm({
      name: '',
      startDate: '',
      endDate: '',
    });
    setHistoryItems([]);
    setSearchPerformed(false);
    setError(null);
  };
  // #endregion

  // #region 유틸리티 함수
  const getTypeInfo = (type: HistoryItem['type']) => {
    switch (type) {
      case 'new':
        return { 
          label: '신규 입주', 
          icon: '🟢',
          className: 'bg-blue-500' 
        };
      case 'move':
        return { 
          label: '세대 이동', 
          icon: '🔄',
          className: 'bg-green-500' 
        };
      case 'leave':
        return { 
          label: '퇴거', 
          icon: '🔴',
          className: 'bg-yellow-500' 
        };
      default:
        return { 
          label: '기타', 
          icon: '⚪',
          className: 'bg-gray-500' 
        };
    }
  };

  const getStatistics = () => {
    const newCount = historyItems.filter(item => item.type === 'new').length;
    const moveCount = historyItems.filter(item => item.type === 'move').length;
    const leaveCount = historyItems.filter(item => item.type === 'leave').length;
    const totalCount = historyItems.length;

    return { newCount, moveCount, leaveCount, totalCount };
  };
  // #endregion

  // #region 페이지 액션
  const leftActions = (
    <Link
      href="/parking/household-management/resident"
      className="flex gap-2 items-center px-3 py-2 transition-colors text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="w-4 h-4" />
      목록으로
    </Link>
  );

  const rightActions = (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleReset}
        disabled={loading}
        className="flex gap-2 items-center px-4 py-2 rounded-lg border transition-colors border-border hover:bg-muted disabled:opacity-50"
      >
        <Filter className="w-4 h-4" />
        초기화
      </button>
      <button
        onClick={handleSearch}
        disabled={loading}
        className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        <Search className="w-4 h-4" />
        {loading ? '검색 중...' : '검색'}
      </button>
    </div>
  );
  // #endregion

  const statistics = getStatistics();

  return (
    <div className="p-6">
      <PageHeader
        title="거주자 이동이력"
        subtitle="거주자들의 이동 및 입주 이력을 조회합니다"
        leftActions={leftActions}
        rightActions={rightActions}
      />
      
      <div className="p-6 bg-white rounded-lg border shadow-sm">
        {/* 검색 영역 */}
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold">검색 조건</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Field
              type="text"
              label="거주자명"
              placeholder="거주자명으로 검색..."
              value={searchForm.name}
              onChange={handleFieldChange('name')}
            />
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                시작일
              </label>
              <input
                type="date"
                value={searchForm.startDate}
                onChange={(e) => handleFieldChange('startDate')(e.target.value)}
                className="px-3 py-2 w-full rounded-md border"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                종료일
              </label>
              <input
                type="date"
                value={searchForm.endDate}
                onChange={(e) => handleFieldChange('endDate')(e.target.value)}
                className="px-3 py-2 w-full rounded-md border"
              />
            </div>
          </div>
        </div>

        {/* 에러 표시 */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {searchPerformed && !loading && historyItems.length === 0 && !error && (
          <div className="p-8 text-center text-muted-foreground">
            검색 조건에 맞는 이동 이력이 없습니다.
          </div>
        )}

        {/* 타임라인 영역 */}
        {historyItems.length > 0 && (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* 이동 이력 항목들 */}
              {historyItems.map((item) => {
                const typeInfo = getTypeInfo(item.type);
                
                return (
                  <div key={item.id} className="flex relative items-start mb-6 space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 ${typeInfo.className} rounded-full flex items-center justify-center`}>
                      <span className="text-xs text-white">{typeInfo.icon}</span>
                    </div>
                    <div className="flex-1 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.residentName} - {typeInfo.label}</h3>
                          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                          <p className="mt-1 text-sm text-gray-600">{item.details}</p>
                          {item.reason && (
                            <div className="flex gap-4 items-center mt-2 text-xs text-gray-500">
                              <span>사유: {item.reason}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 통계 요약 */}
        {searchPerformed && historyItems.length > 0 && (
          <div className="pt-6 mt-8 border-t border-gray-200">
            <h3 className="mb-4 text-lg font-semibold">이동 통계</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-800">{statistics.newCount}</div>
                <div className="text-sm text-blue-600">신규 입주</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-800">{statistics.moveCount}</div>
                <div className="text-sm text-green-600">세대 이동</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-800">{statistics.leaveCount}</div>
                <div className="text-sm text-yellow-600">퇴거</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-800">{statistics.totalCount}</div>
                <div className="text-sm text-purple-600">총 이동 건수</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
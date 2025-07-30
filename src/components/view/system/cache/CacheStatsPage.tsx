/* 메뉴 설명: 캐시 통계 및 상태 조회 */
'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { BarChart3, RefreshCw, Database, Zap } from 'lucide-react';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';

// API 호출
import { getCacheStats } from '@/services/cache/cache_stats_GET';

// 타입 정의
import { CacheStats } from '@/types/api';

export default function CacheStatsPage() {
  
  // #region 상태 관리
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  // #endregion

  // #region 데이터 로드
  const loadCacheStats = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCacheStats();
      
      if (result.success) {
        setCacheStats(result.data);
        setLastUpdated(new Date());
      } else {
        console.error('캐시 통계 로드 실패:', result.errorMsg);
        setCacheStats(null);
      }
    } catch (error) {
      console.error('캐시 통계 로드 중 오류:', error);
      setCacheStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCacheStats();
    
    // 30초마다 자동 새로고침
    const interval = setInterval(loadCacheStats, 30000);
    return () => clearInterval(interval);
  }, [loadCacheStats]);
  // #endregion

  // #region 유틸리티 함수
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };
  // #endregion

  // #region 통계 카드 컴포넌트
  const StatCard = ({ title, value, icon: Icon, color = 'blue' }: {
    title: string;
    value: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color?: 'blue' | 'green' | 'purple' | 'orange';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
    };

    return (
      <div className={`p-6 rounded-lg border-2 ${colorClasses[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <Icon size={32} className="opacity-50" />
        </div>
      </div>
    );
  };
  // #endregion

  // #region 네임스페이스 테이블 컴포넌트
  const NamespaceTable = ({ namespaces }: { namespaces: CacheStats['namespaces'] }) => {
    const sortedNamespaces = Object.entries(namespaces).sort(([,a], [,b]) => b.memory - a.memory);

    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">네임스페이스별 사용량</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  네임스페이스
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  키 개수
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  메모리 사용량
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  비율
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {sortedNamespaces.map(([namespace, stats], index) => {
                const totalMemory = cacheStats?.totalMemory || 1;
                const memoryPercent = (stats.memory / totalMemory) * 100;
                
                return (
                  <tr key={namespace} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-foreground">{namespace}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm text-foreground">{stats.keys.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm text-foreground">{formatBytes(stats.memory)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(memoryPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-foreground min-w-12">
                          {memoryPercent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="캐시 통계" 
        subtitle="Redis 캐시 사용 현황 및 통계 정보"
        rightActions={
          <div className="flex gap-2 items-center">
            {lastUpdated && (
              <span className="text-sm text-muted-foreground">
                마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={loadCacheStats}
              disabled={loading}
              title="새로고침"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
        }
      />

      {loading && !cacheStats && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      )}

      {cacheStats && (
        <>
          {/* 전체 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="총 키 개수"
              value={cacheStats.totalKeys.toLocaleString()}
              icon={Database}
              color="blue"
            />
            <StatCard
              title="총 메모리 사용량"
              value={formatBytes(cacheStats.totalMemory)}
              icon={BarChart3}
              color="green"
            />
            <StatCard
              title="캐시 히트율"
              value={formatPercent(cacheStats.hitRate)}
              icon={Zap}
              color="purple"
            />
            <StatCard
              title="캐시 미스율"
              value={formatPercent(cacheStats.missRate)}
              icon={BarChart3}
              color="orange"
            />
          </div>

          {/* 히트율 정보 카드 */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">캐시 성능 지표</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">히트율</span>
                  <span className="text-sm text-foreground">{formatPercent(cacheStats.hitRate)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${cacheStats.hitRate * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">미스율</span>
                  <span className="text-sm text-foreground">{formatPercent(cacheStats.missRate)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${cacheStats.missRate * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>히트율</strong>이 높을수록 캐시가 효율적으로 작동하고 있음을 의미합니다. 
                일반적으로 80% 이상의 히트율이 권장됩니다.
              </p>
            </div>
          </div>

          {/* 네임스페이스별 통계 테이블 */}
          {Object.keys(cacheStats.namespaces).length > 0 && (
            <NamespaceTable namespaces={cacheStats.namespaces} />
          )}

          {Object.keys(cacheStats.namespaces).length === 0 && (
            <div className="bg-card rounded-lg border border-border p-12">
              <div className="text-center text-muted-foreground">
                <Database size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">네임스페이스가 없습니다</p>
                <p className="text-sm mt-2">아직 등록된 캐시 네임스페이스가 없습니다.</p>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !cacheStats && (
        <div className="bg-card rounded-lg border border-border p-12">
          <div className="text-center text-muted-foreground">
            <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">캐시 통계를 불러올 수 없습니다</p>
            <p className="text-sm mt-2">네트워크 연결을 확인하고 다시 시도해주세요.</p>
            <Button
              variant="outline"
              onClick={loadCacheStats}
              className="mt-4"
            >
              <RefreshCw size={16} />
              다시 시도
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  // #endregion
} 
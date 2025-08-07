/* 공통 설정 관리 컴포넌트 */
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { Plus } from 'lucide-react';

// UI 컴포넌트
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { Button } from '@/components/ui/ui-input/button/Button';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API 호출
import { searchConfigs } from '@/services/config/config$_GET';

// 타입 정의
import { SystemConfig } from '@/types/api';
import { currentPageLabelAtom } from '@/store/ui';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 타입 정의
interface SearchFilters {
  key: string;
  type: string;
  description: string;
}

interface ConfigManagementProps {
  /** 설정 카테고리 */
  category: string;
  /** 페이지 제목 */
  title: string;
  /** 페이지 설명 */
  subtitle: string;
  /** 편집 페이지 경로 베이스 (예: '/parking/violation/violation-config') */
  editBaseRoute: string;
  /** 생성 페이지 경로 (옵셔널) */
  createRoute?: string;
}
// #endregion

export default function ConfigManagement({
  category,
  title,
  subtitle,
  editBaseRoute,
  createRoute,
}: ConfigManagementProps) {
  const router = useRouter();
  const [, setCurrentPageLabel] = useAtom(currentPageLabelAtom);

  // #region 페이지 라벨 설정
  useEffect(() => {
    setCurrentPageLabel({
      label: title,
      href: window.location.pathname,
    });
  }, [title, setCurrentPageLabel]);
  // #endregion

  // #region 상태 관리
  const [allConfigs, setAllConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    key: '',
    type: '',
    description: '',
  });
  // #endregion

  // #region 데이터 로드
  const loadConfigData = useCallback(async () => {
    setLoading(true);
    try {
      // API에서 해당 category로 필터링하여 가져오기
      const result = await searchConfigs({ category });
      
      if (result.success && result.data) {
        setAllConfigs(result.data);
      } else {
        console.error(`${category} 설정 로드 실패:`, result.errorMsg);
        setAllConfigs([]);
      }
    } catch (error) {
      console.error(`${category} 설정 로드 중 오류:`, error);
      setAllConfigs([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadConfigData();
  }, [loadConfigData]);
  // #endregion

  // #region 현재 표시할 설정들
  const currentConfigs = useMemo(() => {
    let configs = [...allConfigs];
    
    // 검색 필터링
    if (searchFilters.key.trim()) {
      configs = configs.filter(config =>
        config.key.toLowerCase().includes(searchFilters.key.toLowerCase())
      );
    }
    
    if (searchFilters.type.trim()) {
      configs = configs.filter(config =>
        config.type === searchFilters.type
      );
    }
    
    if (searchFilters.description.trim()) {
      configs = configs.filter(config =>
        config.description?.toLowerCase().includes(searchFilters.description.toLowerCase())
      );
    }
    
    return configs;
  }, [allConfigs, searchFilters]);
  // #endregion

  // #region 이벤트 핸들러
  const handleRowClick = useCallback((config: SystemConfig) => {
    router.push(`${editBaseRoute}/edit?key=${encodeURIComponent(config.key)}`);
  }, [router, editBaseRoute]);

  const handleCreateNew = useCallback(() => {
    if (createRoute) {
      router.push(createRoute);
    }
  }, [router, createRoute]);

  // 검색 관련 핸들러
  const handleReset = useCallback(() => {
    const resetFilters = {
      key: '',
      type: '',
      description: '',
    };
    setSearchFilters(resetFilters);
  }, []);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 테이블 컬럼 정의
  const columns: BaseTableColumn<SystemConfig>[] = [
    {
      key: 'index',
      header: '순번',
      align: 'center',
      width: '5%',
      cell: (item: SystemConfig, index: number) => (
        <span className="text-xs text-foreground">
          {index + 1}
        </span>
      ),
    },
    {
      key: 'description',
      header: '설명',
      align: 'start',
      width: '25%',
      cell: (item: SystemConfig) => (
        <span className="text-sm text-foreground">
          {item.description || '-'}
        </span>
      ),
    },
    {
      key: 'type',
      header: '타입',
      align: 'center',
      width: '8%',
      cell: (item: SystemConfig) => (
        <span className="px-2 py-1 text-xs rounded bg-muted text-foreground">
          {item.type}
        </span>
      ),
    },
    {
      key: 'value',
      header: '값',
      align: 'start',
      width: '18%',
      cell: (item: SystemConfig) => {
        const displayValue = typeof item.value === 'object' 
          ? JSON.stringify(item.value) 
          : String(item.value);
        
        return (
          <span className="font-mono text-sm truncate max-w-[120px]" title={displayValue}>
            {displayValue}
          </span>
        );
      },
    },
    {
      key: 'isActive',
      header: '상태',
      align: 'center',
      width: '8%',
      cell: (item: SystemConfig) => (
        <span 
          className={`px-2 py-1 text-xs rounded-full font-medium ${
            item.isActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {item.isActive ? '활성' : '비활성'}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: '수정일시',
      align: 'center',
      width: '10%',
      cell: (item: SystemConfig) => {
        if (!item.updatedAt) return <span className="text-muted-foreground">-</span>;
        
        const date = new Date(item.updatedAt);
        const formattedDate = date.toLocaleDateString('ko-KR', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
        });
        const formattedTime = date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        
        return (
          <div className="text-xs text-muted-foreground">
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      },
    },
    // {
    //   key: 'key',
    //   header: '설정 키',
    //   align: 'start',
    //   width: '26%',
    //   cell: (item: SystemConfig) => (
    //     <span className="font-mono text-sm">{item.key}</span>
    //   ),
    // },
  ];
  // #endregion

  // #region 타입 옵션 생성
  const typeOptions: Option[] = useMemo(() => {
    const types = [...new Set(allConfigs.map(config => config.type))];
    return types.map(type => ({
      value: type,
      label: type,
    }));
  }, [allConfigs]);
  // #endregion

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
    {
      key: 'key',
      label: '설정 키 검색',
      element: (
        <FieldText
          id="search-key"
          label="설정 키"
          placeholder="설정 키를 입력하세요"
          value={searchFilters.key}
          onChange={(value) => updateFilter('key', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
    {
      key: 'type',
      label: '타입 필터',
      element: (
        <FieldSelect
          id="search-type"
          label="타입"
          placeholder="타입을 선택하세요"
          options={typeOptions}
          value={searchFilters.type}
          onChange={(value) => updateFilter('type', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'description',
      label: '설명 검색',
      element: (
        <FieldText
          id="search-description"
          label="설명"
          placeholder="설명을 입력하세요"
          value={searchFilters.description}
          onChange={(value) => updateFilter('description', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
  ], [searchFilters, typeOptions, updateFilter]);

  // Advanced Search 컴포넌트 생성
  const advancedSearchContent = useMemo(() => (
    <AdvancedSearch
      fields={searchFields}
      onReset={handleReset}
      defaultOpen={false}
      searchMode="client"
    />
  ), [searchFields, handleReset]);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">{title} 설정을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title={title}
        subtitle={subtitle}
        rightActions={
          createRoute ? (
            <Button
              variant="primary"
              size="default"
              onClick={handleCreateNew}
              title="새 설정 추가"
            >
              <Plus size={16} />
            </Button>
          ) : undefined
        }
      />

      {/* 고급 검색 */}
      <div className="rounded-lg border bg-background border-border">
        {advancedSearchContent}
      </div>

      {/* 설정 목록 테이블 */}
      <PaginatedTable
        data={currentConfigs as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        onRowClick={(item) => handleRowClick(item as unknown as SystemConfig)}
        pageSize={15}
        pageSizeOptions={[10, 15, 25, 50]}
        itemName="설정"
      />
    </div>
  );
}
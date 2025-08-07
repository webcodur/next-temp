/* 메뉴 설명: 시스템 설정 관리 */
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';

// UI 컴포넌트
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs, { Tab, SubTab } from '@/components/ui/ui-layout/tabs/Tabs';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

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
interface GroupedConfigs {
  [group: string]: {
    [category: string]: SystemConfig[];
  };
}

interface SearchFilters {
  key: string;
  type: string;
  description: string;
}
// #endregion

export default function SystemConfigManagementPage() {
  const router = useRouter();
  const [, setCurrentPageLabel] = useAtom(currentPageLabelAtom);

  // #region 페이지 라벨 설정
  useEffect(() => {
    setCurrentPageLabel({
      label: '시스템 설정 관리',
      href: window.location.pathname,
    });
  }, [setCurrentPageLabel]);
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
  
  // 탭 상태
  const [activeGroupId, setActiveGroupId] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('');
  // #endregion



  // #region 데이터 로드
  const loadConfigData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await searchConfigs();
      
      if (result.success && result.data) {
        setAllConfigs(result.data);
        
        // "전체" 탭과 첫 번째 카테고리를 기본 선택
        const grouped = result.data.reduce((acc, config) => {
          const group = config.group || '기타';
          const category = config.category || '미분류';
          
          if (!acc[group]) {
            acc[group] = {};
          }
          if (!acc[group][category]) {
            acc[group][category] = [];
          }
          
          acc[group][category].push(config);
          return acc;
        }, {} as GroupedConfigs);
        
        // 전체 탭을 기본 선택
        setActiveGroupId('all');
        
        // 첫 번째 카테고리 선택 (모든 그룹에서 첫 번째 카테고리)
        const allCategories = new Set<string>();
        Object.values(grouped).forEach(categories => {
          Object.keys(categories).forEach(categoryName => {
            allCategories.add(categoryName);
          });
        });
        
        const firstCategory = Array.from(allCategories)[0];
        if (firstCategory) {
          setActiveCategoryId(firstCategory);
        }
      } else {
        console.error('시스템 설정 로드 실패:', result.errorMsg);
        setAllConfigs([]);
      }
    } catch (error) {
      console.error('시스템 설정 로드 중 오류:', error);
      setAllConfigs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfigData();
  }, [loadConfigData]);
  // #endregion

  // #region 데이터 그룹화
  const groupConfigsByGroupAndCategory = useCallback((configs: SystemConfig[]): GroupedConfigs => {
    return configs.reduce((acc, config) => {
      const group = config.group || '기타';
      const category = config.category || '미분류';
      
      if (!acc[group]) {
        acc[group] = {};
      }
      if (!acc[group][category]) {
        acc[group][category] = [];
      }
      
      acc[group][category].push(config);
      return acc;
    }, {} as GroupedConfigs);
  }, []);

  const groupedConfigs = useMemo(() => {
    return groupConfigsByGroupAndCategory(allConfigs);
  }, [allConfigs, groupConfigsByGroupAndCategory]);
  // #endregion

  // #region 탭 데이터 생성
  const tabs: Tab[] = useMemo(() => {
    const groupTabs = Object.entries(groupedConfigs).map(([groupName, categories]) => {
      const subTabs: SubTab[] = Object.entries(categories).map(([categoryName, configs]) => ({
        id: categoryName,
        label: categoryName,
        count: configs.length,
      }));

      // 해당 그룹의 전체 설정 개수 계산
      const totalCount = subTabs.reduce((sum, subTab) => sum + (subTab.count || 0), 0);

      return {
        id: groupName,
        label: groupName,
        count: totalCount,
        subTabs,
      };
    });

    // "전체" 탭 생성 (모든 그룹의 모든 카테고리 포함)
    const allSubTabs: SubTab[] = [];
    let totalAllCount = 0;
    
    Object.entries(groupedConfigs).forEach(([, categories]) => {
      Object.entries(categories).forEach(([categoryName, configs]) => {
        allSubTabs.push({
          id: categoryName,
          label: categoryName,
          count: configs.length,
        });
        totalAllCount += configs.length;
      });
    });

    const allTab: Tab = {
      id: 'all',
      label: '전체',
      count: totalAllCount,
      subTabs: allSubTabs,
    };

    return [allTab, ...groupTabs];
  }, [groupedConfigs]);
  // #endregion

  // #region 현재 표시할 설정들
  const currentConfigs = useMemo(() => {
    if (!activeGroupId || !activeCategoryId) return [];
    
    let configs: SystemConfig[] = [];
    
    if (activeGroupId === 'all') {
      // "전체" 탭인 경우: 모든 그룹에서 해당 카테고리 찾기
      Object.entries(groupedConfigs).forEach(([, categories]) => {
        if (categories[activeCategoryId]) {
          configs.push(...categories[activeCategoryId]);
        }
      });
    } else {
      // 특정 그룹인 경우: 해당 그룹의 카테고리에서 가져오기
      configs = groupedConfigs[activeGroupId]?.[activeCategoryId] || [];
    }
    
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
  }, [groupedConfigs, activeGroupId, activeCategoryId, searchFilters]);
  // #endregion

  // #region 이벤트 핸들러
  const handleTabChange = useCallback((groupId: string) => {
    setActiveGroupId(groupId);
    // 새 그룹의 첫 번째 카테고리 선택
    const firstCategory = Object.keys(groupedConfigs[groupId] || {})[0];
    if (firstCategory) {
      setActiveCategoryId(firstCategory);
    }
  }, [groupedConfigs]);

  const handleSubTabChange = useCallback((categoryId: string) => {
    setActiveCategoryId(categoryId);
  }, []);

  const handleRowClick = useCallback((config: SystemConfig) => {
    const encodedKey = encodeURIComponent(config.key);
    const url = `/system/config/settings/edit?key=${encodedKey}`;
    console.log('설정 편집 네비게이션:', { 
      originalKey: config.key, 
      encodedKey, 
      url 
    });
    router.push(url);
  }, [router]);

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
      key: 'id',
      header: 'ID',
      align: 'center',
      width: '6%',
      cell: (item: SystemConfig) => (
        <span className="font-mono text-xs text-muted-foreground">
          #{item.id}
        </span>
      ),
    },
    {
      key: 'description',
      header: '설명',
      align: 'start',
      width: '25%',
      cell: (item: SystemConfig) => (
        <span className="text-sm text-muted-foreground">
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
        <span className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
          {item.type}
        </span>
      ),
    },
    {
      key: 'value',
      header: '현재 값',
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
      width: '12%',
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
    {
      key: 'key',
      header: '설정 키',
      align: 'start',
      width: '23%',
      cell: (item: SystemConfig) => (
        <span className="font-mono text-sm">{item.key}</span>
      ),
    },
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
      defaultOpen={true}
      searchMode="client"
      alwaysOpen={true}
    />
  ), [searchFields, handleReset]);
  // #endregion

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">설정 데이터를 불러오는 중...</div>
      </div>
    );
  }

  if (tabs.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="시스템 설정 관리" 
          subtitle="시스템 설정이 없습니다"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="시스템 설정 관리" 
        subtitle="시스템 전역 설정을 그룹별, 카테고리별로 관리합니다"
      />

      {/* 탭 + 서브탭 */}
      <Tabs
        tabs={tabs}
        activeId={activeGroupId}
        onTabChange={handleTabChange}
        activeSubTabId={activeCategoryId}
        onSubTabChange={handleSubTabChange}
        showSubTabs={true}
        subTabWidth="220px"
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
/**
 * @path src/components/view/global/hub/notice/HubNoticePage.tsx
 * @description 주차 SAAS 서버 공지사항 목록 페이지
 * @responsibility 공지사항 목록 조회, 검색, 상세 페이지 이동
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, Pin, AlertCircle, Calendar, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// UI 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { Badge } from '@/components/ui/ui-effects/badge/Badge';



// 타입 정의
import { Notice } from '@/types/notice';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchFilters {
  title: string;
  content: string;
  category: string;
  isImportant: string;
  author: string;
  startDate: Date | null;
  endDate: Date | null;
}
// #endregion

// #region 카테고리 옵션
const categoryOptions: Option[] = [
  { value: 'general', label: '일반' },
  { value: 'update', label: '업데이트' },
  { value: 'maintenance', label: '점검' },
  { value: 'event', label: '이벤트' },
  { value: 'emergency', label: '긴급' },
];

const importanceOptions: Option[] = [
  { value: 'true', label: '중요' },
  { value: 'false', label: '일반' },
];
// #endregion

// #region 목업 데이터
const mockNotices: Notice[] = [
  {
    id: 1,
    title: '[긴급] 시스템 점검 안내',
    content: '2025년 8월 15일 새벽 2시부터 4시까지 시스템 점검이 예정되어 있습니다.',
    category: 'emergency',
    isImportant: true,
    isPinned: true,
    viewCount: 1250,
    author: '시스템 관리자',
    tags: ['점검', '긴급'],
    startDate: '2025-08-10',
    endDate: '2025-08-15',
    createdAt: '2025-08-01T10:00:00',
    updatedAt: '2025-08-01T10:00:00',
  },
  {
    id: 2,
    title: '주차 관리 시스템 v2.5 업데이트 안내',
    content: '새로운 기능이 추가되었습니다. 차량 위반 관리 및 블랙리스트 기능이 개선되었습니다.',
    category: 'update',
    isImportant: true,
    isPinned: false,
    viewCount: 850,
    author: '개발팀',
    tags: ['업데이트', '신기능'],
    createdAt: '2025-07-28T14:30:00',
    updatedAt: '2025-07-28T14:30:00',
  },
  {
    id: 3,
    title: '여름 휴가철 주차장 운영 안내',
    content: '8월 휴가철을 맞이하여 주차장 운영 시간이 변경됩니다.',
    category: 'general',
    isImportant: false,
    isPinned: false,
    viewCount: 320,
    author: '운영팀',
    tags: ['운영', '휴가'],
    createdAt: '2025-07-25T09:00:00',
    updatedAt: '2025-07-25T09:00:00',
  },
  {
    id: 4,
    title: '주차 요금 할인 이벤트',
    content: '신규 회원 가입시 첫 달 주차 요금 30% 할인 이벤트를 진행합니다.',
    category: 'event',
    isImportant: false,
    isPinned: false,
    viewCount: 520,
    author: '마케팅팀',
    tags: ['이벤트', '할인'],
    startDate: '2025-08-01',
    endDate: '2025-08-31',
    createdAt: '2025-07-20T11:00:00',
    updatedAt: '2025-07-20T11:00:00',
  },
];
// #endregion

export default function HubNoticePage() {
  const router = useRouter();

  // #region 상태 관리
  const [noticeList, setNoticeList] = useState<Notice[]>(mockNotices);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    title: '',
    content: '',
    category: '',
    isImportant: '',
    author: '',
    startDate: null,
    endDate: null,
  });
  // #endregion

  // #region 데이터 로드
  const loadNoticeData = useCallback(async (filters?: Partial<SearchFilters>) => {
    try {
      // TODO: 실제 API 연동 시 아래 코드로 대체
      // const searchParams: NoticeSearchParams = {
      //   page: 1,
      //   limit: 100,
      //   ...(filters?.title && { title: filters.title }),
      //   ...(filters?.content && { content: filters.content }),
      //   ...(filters?.category && { category: filters.category as NoticeCategory }),
      //   ...(filters?.isImportant && { isImportant: filters.isImportant === 'true' }),
      //   ...(filters?.author && { author: filters.author }),
      //   ...(filters?.startDate && { startDate: format(filters.startDate, 'yyyy-MM-dd') }),
      //   ...(filters?.endDate && { endDate: format(filters.endDate, 'yyyy-MM-dd') }),
      //   sortBy: 'createdAt',
      //   sortOrder: 'desc',
      // };
      // const result = await searchNotices(searchParams);
      
      // 목업 데이터 필터링
      let filteredData = [...mockNotices];
      
      if (filters?.title) {
        filteredData = filteredData.filter(notice => 
          notice.title.toLowerCase().includes(filters.title!.toLowerCase())
        );
      }
      if (filters?.content) {
        filteredData = filteredData.filter(notice => 
          notice.content.toLowerCase().includes(filters.content!.toLowerCase())
        );
      }
      if (filters?.category) {
        filteredData = filteredData.filter(notice => 
          notice.category === filters.category
        );
      }
      if (filters?.isImportant) {
        filteredData = filteredData.filter(notice => 
          notice.isImportant === (filters.isImportant === 'true')
        );
      }
      if (filters?.author) {
        filteredData = filteredData.filter(notice => 
          notice.author.includes(filters.author!)
        );
      }
      
      setNoticeList(filteredData);
    } catch (error) {
      console.error('공지사항 목록 로드 중 오류:', error);
      setNoticeList([]);
    }
  }, []);

  useEffect(() => {
    loadNoticeData();
  }, [loadNoticeData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeFilters: any = {};
    
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (key === 'startDate' || key === 'endDate') {
        if (value) activeFilters[key] = value;
      } else if (typeof value === 'string' && value.trim()) {
        activeFilters[key] = value.trim();
      }
    });

    loadNoticeData(activeFilters);
  }, [searchFilters, loadNoticeData]);

  const handleReset = useCallback(() => {
    setSearchFilters({
      title: '',
      content: '',
      category: '',
      isImportant: '',
      author: '',
      startDate: null,
      endDate: null,
    });
    loadNoticeData();
  }, [loadNoticeData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string | Date | null) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 이벤트 핸들러
  const handleCreateClick = useCallback(() => {
    router.push('/global/hub/notice/create');
  }, [router]);

  const handleRowClick = useCallback((item: any) => {
    router.push(`/global/hub/notice/${item.id}`);
  }, [router]);
  // #endregion

  // #region 테이블 컬럼 정의
  const columns: any = useMemo(() => [
    {
      key: 'isPinned',
      header: '',
      width: '40px',
      render: (_: any, notice: any) => notice.isPinned ? <Pin className="w-4 h-4 text-accent" /> : null,
    },
    {
      key: 'category',
      header: '구분',
      width: '100px',
      render: (_: any, notice: any) => {
        const categoryLabel = categoryOptions.find(opt => opt.value === notice.category)?.label || notice.category;
        const variant = notice.category === 'emergency' ? 'destructive' : 
                      notice.category === 'update' ? 'primary' : 
                      notice.category === 'event' ? 'secondary' : 'default';
        return <Badge variant={variant}>{categoryLabel}</Badge>;
      },
    },
    {
      key: 'title',
      header: '제목',
      render: (_: any, notice: any) => (
        <div className="flex gap-2 items-center">
          {notice.isImportant && <AlertCircle className="w-4 h-4 text-red-500" />}
          <span className={notice.isImportant ? 'font-semibold' : ''}>{notice.title}</span>
          {notice.tags && notice.tags.length > 0 && (
            <div className="flex gap-1">
              {notice.tags.slice(0, 2).map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="mr-1 w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'author',
      header: '작성자',
      width: '120px',
    },
    {
      key: 'viewCount',
      header: '조회수',
      width: '80px',
      render: (_: any, notice: any) => notice.viewCount.toLocaleString(),
    },
    {
      key: 'period',
      header: '게시기간',
      width: '180px',
      render: (_: any, notice: any) => {
        if (notice.startDate && notice.endDate) {
          return (
            <div className="flex gap-1 items-center text-sm">
              <Calendar className="w-3 h-3" />
              {format(new Date(notice.startDate), 'MM.dd', { locale: ko })} ~ 
              {format(new Date(notice.endDate), 'MM.dd', { locale: ko })}
            </div>
          );
        }
        return '-';
      },
    },
    {
      key: 'createdAt',
      header: '등록일',
      width: '100px',
      render: (_: any, notice: any) => format(new Date(notice.createdAt), 'yyyy.MM.dd', { locale: ko }),
    },
  ], []);
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 헤더 */}
      <PageHeader 
        title="주차 SAAS 서버 공지사항"
        subtitle="시스템 업데이트, 점검 안내, 이벤트 등 주요 공지사항을 확인하세요."
        rightActions={
          <Button 
            onClick={handleCreateClick}
            title="새 공지사항 작성"
            className="flex gap-2 items-center"
          >
            <Plus className="w-4 h-4" />
            공지사항 작성
          </Button>
        }
      />

      {/* 검색 필터 */}
      <AdvancedSearch 
        onSearch={handleSearch} 
        onReset={handleReset}
        fields={[
          {
            key: 'title',
            type: 'text',
            label: '제목',
            value: searchFilters.title,
            onChange: (value: string) => updateFilter('title', value),
            placeholder: '제목 검색',
          },
          {
            key: 'content',
            type: 'text',
            label: '내용',
            value: searchFilters.content,
            onChange: (value: string) => updateFilter('content', value),
            placeholder: '내용 검색',
          },
          {
            key: 'category',
            type: 'select',
            label: '구분',
            value: searchFilters.category,
            onChange: (value: string) => updateFilter('category', value),
            options: categoryOptions,
            placeholder: '전체',
          },
          {
            key: 'importance',
            type: 'select',
            label: '중요도',
            value: searchFilters.isImportant,
            onChange: (value: string) => updateFilter('isImportant', value),
            options: importanceOptions,
            placeholder: '전체',
          },
          {
            key: 'author',
            type: 'text',
            label: '작성자',
            value: searchFilters.author,
            onChange: (value: string) => updateFilter('author', value),
            placeholder: '작성자 검색',
          },
          {
            key: 'startDate',
            type: 'datepicker',
            label: '게시 시작일',
            value: searchFilters.startDate,
            onChange: (date: Date | null) => updateFilter('startDate', date),
            placeholder: '시작일 선택',
          },
          {
            key: 'endDate',
            type: 'datepicker',
            label: '게시 종료일',
            value: searchFilters.endDate,
            onChange: (date: Date | null) => updateFilter('endDate', date),
            placeholder: '종료일 선택',
          },
        ] as any}
      />

      {/* 공지사항 목록 테이블 */}
      <PaginatedTable
        data={noticeList as any}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
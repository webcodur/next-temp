'use client';

import { useState } from 'react';
import { AdvancedSearch } from '@/components/ui/advanced-search/AdvancedSearch';
import {
  FieldText,
  FieldMultiSelect,
  FieldFilterSelect,
  FieldSortSelect,
  Option
} from '@/components/ui/field/Field';

export default function AdvancedSearchPage() {
  // 기본 검색 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  
  // 선택 필드 상태
  const [selectedTags, setSelectedTags] = useState<string[]>(['design']);
  const [filterStatus, setFilterStatus] = useState('active');
  const [sortOrder, setSortOrder] = useState('latest');
  
  // 토글 상태
  const [categoryType, setCategoryType] = useState('general');
  const [isVerified, setIsVerified] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  // 옵션 데이터
  const tagOptions: Option[] = [
    { value: 'design', label: '디자인' },
    { value: 'development', label: '개발' },
    { value: 'marketing', label: '마케팅' },
    { value: 'planning', label: '기획' },
    { value: 'hr', label: '인사' },
    { value: 'finance', label: '재무' },
    { value: 'operations', label: '운영' },
    { value: 'sales', label: '영업' }
  ];

  const statusOptions: Option[] = [
    { value: 'active', label: '활성' },
    { value: 'inactive', label: '비활성' },
    { value: 'pending', label: '대기중' },
    { value: 'suspended', label: '정지됨' },
    { value: 'completed', label: '완료됨' }
  ];

  const sortOptions: Option[] = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'name_asc', label: '이름 오름차순' },
    { value: 'name_desc', label: '이름 내림차순' },
    { value: 'price_asc', label: '가격 오름차순' },
    { value: 'price_desc', label: '가격 내림차순' }
  ];

  const categoryOptions: Option[] = [
    { value: 'general', label: '일반' },
    { value: 'premium', label: '프리미엄' },
    { value: 'enterprise', label: '기업' },
    { value: 'trial', label: '체험' }
  ];

  const handleSearch = () => {
    const searchData = {
      keyword: searchKeyword,
      email: searchEmail,
      phone: searchPhone,
      tags: selectedTags,
      status: filterStatus,
      sort: sortOrder,
      category: categoryType,
      verified: isVerified,
      notifications: enableNotifications,
      public: isPublic
    };
    
    console.log('검색 데이터:', searchData);
    alert(`검색 실행!\n키워드: ${searchKeyword}\n선택된 태그: ${selectedTags.join(', ')}\n상태: ${filterStatus}`);
  };

  const handleReset = () => {
    setSearchKeyword('');
    setSearchEmail('');
    setSearchPhone('');
    setSelectedTags([]);
    setFilterStatus('');
    setSortOrder('latest');
    setCategoryType('general');
    setIsVerified(false);
    setEnableNotifications(false);
    setIsPublic(false);
    
    alert('모든 필터가 초기화되었습니다.');
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">AdvancedSearch + Field 컴포넌트</h1>
          <p className="text-gray-600">모든 Field 컴포넌트를 고급 검색 패널에서 테스트</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <AdvancedSearch
            title="종합 고급 검색"
            onSearch={handleSearch}
            onReset={handleReset}
            searchLabel="검색 실행"
            resetLabel="필터 초기화"
            statusText={`선택된 태그: ${selectedTags.length}개 | 상태: ${filterStatus || '전체'}`}
          >
            {/* 첫 번째 줄: 텍스트 필드들 */}
            <FieldText
              label="키워드 검색"
              placeholder="검색어를 입력하세요"
              value={searchKeyword}
              onChange={setSearchKeyword}
              showSearchIcon={true}
            />
            
            <FieldText
              label="이메일 검색"
              placeholder="이메일을 입력하세요"
              value={searchEmail}
              onChange={setSearchEmail}
              inputType="email"
            />
            
            <FieldText
              label="전화번호 검색"
              placeholder="전화번호를 입력하세요"
              value={searchPhone}
              onChange={setSearchPhone}
              inputType="tel"
            />

            {/* 두 번째 줄: 선택 필드들 */}
            <FieldMultiSelect
              label="태그 선택"
              placeholder="태그를 선택하세요"
              options={tagOptions}
              value={selectedTags}
              onChange={setSelectedTags}
            />
            
            <FieldFilterSelect
              label="상태 필터"
              placeholder="상태를 선택하세요"
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
            />
            
            <FieldSortSelect
              label="정렬 방식"
              options={sortOptions}
              value={sortOrder}
              onChange={setSortOrder}
            />
          </AdvancedSearch>
        </div>

        {/* 현재 검색 상태 표시 */}
        <div className="p-6 mt-8 bg-white rounded-lg shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">현재 검색 조건</h3>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
            <div><span className="font-medium">키워드:</span> {searchKeyword || '없음'}</div>
            <div><span className="font-medium">이메일:</span> {searchEmail || '없음'}</div>
            <div><span className="font-medium">전화번호:</span> {searchPhone || '없음'}</div>
            <div><span className="font-medium">선택된 태그:</span> {selectedTags.length ? selectedTags.join(', ') : '없음'}</div>
            <div><span className="font-medium">상태:</span> {filterStatus || '전체'}</div>
            <div><span className="font-medium">정렬:</span> {sortOptions.find(opt => opt.value === sortOrder)?.label}</div>
            <div><span className="font-medium">카테고리:</span> {categoryOptions.find(opt => opt.value === categoryType)?.label}</div>
            <div><span className="font-medium">인증 사용자:</span> {isVerified ? '예' : '아니오'}</div>
            <div><span className="font-medium">알림:</span> {enableNotifications ? '활성' : '비활성'}</div>
            <div><span className="font-medium">공개:</span> {isPublic ? '공개' : '비공개'}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import {
  FieldText,
  FieldMultiSelect,
  FieldFilterSelect,
  FieldSortSelect,
  Option,
  SelectMode,
  SortDirection
} from '@/components/ui/field/Field';

export default function FieldPage() {
  const [textValue, setTextValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('name');

  // 모드 전환 상태 추가
  const [multiSelectMode, setMultiSelectMode] = useState<SelectMode>('dropdown');
  const [filterSelectMode, setFilterSelectMode] = useState<SelectMode>('dropdown');
  // 정렬 방향 상태 추가
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const statusOptions: Option[] = [
    { value: 'active', label: '활성' },
    { value: 'inactive', label: '비활성' },
    { value: 'pending', label: '대기중' },
    { value: 'suspended', label: '정지됨' },
    { value: 'completed', label: '완료됨' }
  ];

  const tagOptions: Option[] = [
    { value: 'design', label: '디자인' },
    { value: 'development', label: '개발' },
    { value: 'marketing', label: '마케팅' },
    { value: 'planning', label: '기획' },
    { value: 'hr', label: '인사' },
    { value: 'finance', label: '재무' },
    { value: 'operations', label: '운영' }
  ];

  const sortOptions: Option[] = [
    { value: 'latest', label: '등록일' },
    { value: 'name', label: '이름' },
    { value: 'price', label: '가격' },
    { value: 'status', label: '상태' }
  ];

  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-8 text-2xl font-bold">Field 컴포넌트 - 모드 전환 기능</h1>
      
      <div className="p-6 mx-auto max-w-2xl rounded-xl neu-flat">
        <div className="space-y-6">
          <FieldText
            label="텍스트 필드"
            placeholder="텍스트를 입력하세요"
            value={textValue}
            onChange={setTextValue}
          />
          
          <FieldText
            label="검색 필드"
            placeholder="검색어를 입력하세요"
            value={searchValue}
            onChange={setSearchValue}
            showSearchIcon={true}
            onEnterPress={() => alert(`검색어: ${searchValue}`)}
          />
          
          <div className="space-y-2">
            <FieldMultiSelect
              label="다중 선택 필드"
              placeholder="태그 선택"
              options={tagOptions}
              value={multiSelectValue}
              onChange={setMultiSelectValue}
              mode={multiSelectMode}
              onModeChange={setMultiSelectMode}
            />
          </div>
          
          <div className="space-y-2">
            <FieldFilterSelect
              label="필터 선택 필드"
              placeholder="상태 선택"
              options={statusOptions}
              value={filterValue}
              onChange={setFilterValue}
              mode={filterSelectMode}
              onModeChange={setFilterSelectMode}
            />
          </div>
          
          <div className="space-y-2">
            <FieldSortSelect
              label="정렬 선택 필드"
              options={sortOptions}
              value={sortValue}
              onChange={setSortValue}
              sortDirection={sortDirection}
              onSortDirectionChange={setSortDirection}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
} 
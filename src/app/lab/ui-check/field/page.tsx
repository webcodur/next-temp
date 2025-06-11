'use client';

import { useState } from 'react';
import {
  FieldText,
  FieldMultiSelect,
  FieldFilterSelect,
  FieldSortSelect,
  FieldRadioGroup,
  FieldCheckbox,
  FieldToggleSwitch,
  FieldToggleButton,
  Option
} from '@/components/ui/field/Field';

export default function FieldPage() {
  const [textValue, setTextValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('latest');
  const [radioValue, setRadioValue] = useState('design');
  const [checkboxStates, setCheckboxStates] = useState({
    notifications: true,
    emailAlerts: false,
    smsAlerts: true,
    pushNotifications: false,
    marketing: false,
  });
  const [switchValue, setSwitchValue] = useState(false);
  const [toggleButtonValue, setToggleButtonValue] = useState(false);

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
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'name_asc', label: '이름 오름차순' },
    { value: 'name_desc', label: '이름 내림차순' },
    { value: 'price_asc', label: '가격 오름차순' },
    { value: 'price_desc', label: '가격 내림차순' }
  ];

  const checkboxOptions = [
    { key: 'notifications', label: '알림 받기' },
    { key: 'emailAlerts', label: '이메일 알림' },
    { key: 'smsAlerts', label: 'SMS 알림' },
    { key: 'pushNotifications', label: '푸시 알림' },
    { key: 'marketing', label: '마케팅 정보 수신' },
  ];

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setCheckboxStates(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  return (
    <div className="container p-6 mx-auto">
      <h1 className="mb-8 text-2xl font-bold">Field 컴포넌트</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 neu-flat rounded-xl">
          <h2 className="mb-4 text-xl font-semibold">기본 필드</h2>
          
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
            
            <FieldMultiSelect
              label="다중 선택 필드"
              placeholder="태그 선택"
              options={tagOptions}
              value={multiSelectValue}
              onChange={setMultiSelectValue}
            />
          </div>
        </div>
        
        <div className="p-6 neu-flat rounded-xl">
          <h2 className="mb-4 text-xl font-semibold">추가 필드</h2>
          
          <div className="space-y-6">
            <FieldFilterSelect
              label="필터 선택 필드"
              placeholder="상태 선택"
              options={statusOptions}
              value={filterValue}
              onChange={setFilterValue}
            />
            
            <FieldSortSelect
              label="정렬 선택 필드"
              options={sortOptions}
              value={sortValue}
              onChange={setSortValue}
            />
            
            <FieldRadioGroup
              label="라디오 버튼 그룹"
              options={tagOptions.slice(0, 4)}
              value={radioValue}
              onChange={setRadioValue}
              layout="horizontal"
            />
          </div>
        </div>

        <div className="p-6 neu-flat rounded-xl">
          <h2 className="mb-4 text-xl font-semibold">토글 필드</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-800">체크박스 필드들</h3>
              <div className="space-y-4">
                {checkboxOptions.map((option) => (
                  <FieldCheckbox
                    key={option.key}
                    label={option.label}
                    checked={checkboxStates[option.key as keyof typeof checkboxStates]}
                    onChange={(checked) => handleCheckboxChange(option.key, checked)}
                  />
                ))}
              </div>
            </div>
            
            <FieldToggleSwitch
              label="토글 스위치 필드"
              checked={switchValue}
              onChange={setSwitchValue}
            />
            
            <FieldToggleButton
              label="토글 버튼 필드"
              pressed={toggleButtonValue}
              onChange={setToggleButtonValue}
              variant="default"
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
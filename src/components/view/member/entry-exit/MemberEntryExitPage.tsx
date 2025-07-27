'use client';

import React, { useState } from 'react';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
/* 메뉴 설명: 이용자 입출차 현황을 실시간으로 관리 */
import { Field } from '@/components/ui/ui-input/field/core/Field';
import TimeRangePicker from '@/components/ui/ui-input/field/time/unit/TimeRangePicker';

// ----------------------------- 타입 정의 -----------------------------
interface EntryExit {
  [key: string]: unknown; // 추가 - Record<string, unknown> 만족
  id: number;
  vehicleType: string;
  plateNumber: string;
  entryTime: string;
  exitTime: string;
  inOutType: string;
  note: string;
  status: string;
}

// --------------------------- 모의 데이터 ---------------------------
const MOCK_DATA: EntryExit[] = [
  {
    id: 152,
    vehicleType: '방문차량 1동 1호',
    plateNumber: '00가0000',
    entryTime: '2025-07-08 16:40:41',
    exitTime: '2025-07-08 16:40:53',
    inOutType: '정문출차',
    note: '-',
    status: '출차완료',
  },
  {
    id: 151,
    vehicleType: '방문차량 1동 1호',
    plateNumber: '00가0000',
    entryTime: '2025-07-08 16:38:31',
    exitTime: '2025-07-08 16:39:12',
    inOutType: '정문출차',
    note: '-',
    status: '출차완료',
  },
  {
    id: 150,
    vehicleType: '방문차량 1동 1호',
    plateNumber: '00가0000',
    entryTime: '2025-07-08 16:34:04',
    exitTime: '2025-07-08 16:36:14',
    inOutType: '정문출차',
    note: '-',
    status: '출차완료',
  },
  // ... 추가 데이터 생략
];

// --------------------------- 테이블 컬럼 ---------------------------
	const columns: BaseTableColumn<EntryExit>[] = [
  { key: 'id', header: '순번', width: '80px', align: 'center', sortable: true },
  { key: 'vehicleType', header: '차량구분', sortable: true },
  { key: 'plateNumber', header: '차량번호', sortable: true },
  { key: 'entryTime', header: '입차시간', sortable: true },
  { key: 'exitTime', header: '출차시간', sortable: true },
  { key: 'inOutType', header: '입출차', sortable: false },
  { key: 'note', header: '비고', sortable: false },
  { key: 'status', header: '상태', sortable: true },
];

// --------------------------- 검색 옵션 ---------------------------
const TIME_TARGET_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'entry', label: '입차' },
  { value: 'exit', label: '출차' },
];

const VEHICLE_TYPE_OPTIONS = [
  { value: '입주차', label: '입주차' },
  { value: '정기차', label: '정기차' },
  { value: '방문차', label: '방문차' },
  { value: '임대차', label: '임대차' },
  { value: '업무차', label: '업무차' },
  { value: '상가차', label: '상가차' },
  { value: '발권기(방문)', label: '발권기(방문)' },
  { value: '발권기(업무)', label: '발권기(업무)' },
  { value: '발권기(상가)', label: '발권기(상가)' },
  { value: '미등록', label: '미등록' },
  { value: '입주차(차감)', label: '입주차(차감)' },
  { value: '미인식', label: '미인식' },
  { value: '오인식', label: '오인식' },
  { value: '방문자(연동)', label: '방문자(연동)' },
];

const SEARCH_CATEGORY_OPTIONS = [
  { value: 'plateNumber', label: '차량번호' },
  { value: 'household', label: '세대' },
];

export default function MemberEntryExitPage() {

  // ------------------------- 상태 관리 -------------------------
  const [filteredData, setFilteredData] = useState<EntryExit[]>(MOCK_DATA);

  // 폼 상태
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeFilterTarget, setTimeFilterTarget] = useState('all');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [parkingMinDays, setParkingMinDays] = useState('');
  const [parkingMaxDays, setParkingMaxDays] = useState('');
  const [searchCategory, setSearchCategory] = useState('plateNumber');
  const [searchQuery, setSearchQuery] = useState('');
  const [unExitedOnly, setUnExitedOnly] = useState(false);

  // ------------------------- 검색 필드 설정 -------------------------
  const searchFields = [
    {
      key: 'period',
      label: '기간설정',
      element: (
        <div className="flex gap-2 items-center">
          <span className="py-2 w-20 text-sm text-center shrink-0 neu-flat">기간설정</span>
          <Field
            type="datepicker"
            datePickerType="range"
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            className="flex-1"
          />
        </div>
      ),
      visible: true,
    },
    {
      key: 'time',
      label: '시간설정',
      element: (
        <div className="flex gap-2 items-center">
          <span className="py-2 w-20 text-sm text-center shrink-0 neu-flat">시간설정</span>
          <Field
            type="select"
            placeholder="전체"
            value={timeFilterTarget}
            onChange={setTimeFilterTarget}
            options={TIME_TARGET_OPTIONS}
            className="min-w-[120px]"
          />
          <TimeRangePicker
            label=""
            startId="time-start"
            endId="time-end"
            startValue={startTime}
            endValue={endTime}
            onStartChange={setStartTime}
            onEndChange={setEndTime}
            className="flex-1"
          />
        </div>
      ),
      visible: true,
    },
    {
      key: 'vehicleType',
      label: '구분',
      element: (
        <div className="flex gap-2 items-center">
          <span className="py-2 w-20 text-sm text-center shrink-0 neu-flat">구분</span>
          <Field
            type="select"
            placeholder="차량유형 선택"
            value={vehicleType}
            onChange={setVehicleType}
            options={VEHICLE_TYPE_OPTIONS}
            className="flex-1"
          />
        </div>
      ),
      visible: true,
    },
    {
      key: 'parkingDays',
      label: '주차시간',
      element: (
        <div className="flex gap-2 items-center">
          <span className="py-2 w-20 text-sm text-center shrink-0 neu-flat">주차시간</span>
          <Field
            type="text"
            placeholder="0"
            value={parkingMinDays}
            onChange={setParkingMinDays}
            className="w-24"
          />
          <span className="text-sm">일 이상</span>
          <Field
            type="text"
            placeholder="0"
            value={parkingMaxDays}
            onChange={setParkingMaxDays}
            className="w-24"
          />
          <span className="text-sm">일 미만</span>
        </div>
      ),
      visible: true,
    },
    {
      key: 'exitStatus',
      label: '출차여부',
      element: (
        <div className="flex gap-4 items-center">
          <span className="py-2 w-20 text-sm text-center shrink-0 neu-flat">출차여부</span>
          <label className="flex gap-1 items-center text-sm">
            <input
              type="radio"
              name="exitStatus"
              className="neu-flat"
              checked={!unExitedOnly}
              onChange={() => setUnExitedOnly(false)}
            />
            전체
          </label>
          <label className="flex gap-1 items-center text-sm">
            <input
              type="radio"
              name="exitStatus"
              className="neu-flat"
              checked={unExitedOnly}
              onChange={() => setUnExitedOnly(true)}
            />
            미출차
          </label>
        </div>
      ),
      visible: true,
    },
    {
      key: 'search',
      label: '검색설정',
      element: (
        <div className="flex gap-2 items-center">
          <span className="py-2 w-20 text-sm text-center shrink-0 neu-flat">검색설정</span>
          <Field
            type="select"
            placeholder="차량번호"
            value={searchCategory}
            onChange={setSearchCategory}
            options={SEARCH_CATEGORY_OPTIONS}
            className="min-w-[120px]"
          />
          <Field
            type="text"
            placeholder={searchCategory === 'plateNumber' ? '차량번호로 검색이 가능해요!' : '세대로 검색이 가능해요!'}
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1"
          />
        </div>
      ),
      visible: true,
    },
  ];

  // ------------------------- 이벤트 ---------------------------
  const handleSearch = () => {
    let data = [...MOCK_DATA];

    // 날짜 필터
    if (startDate)
      data = data.filter(item => new Date(item.entryTime) >= startDate);
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      data = data.filter(item => new Date(item.entryTime) <= endOfDay);
    }

    // 차량유형 필터
    if (vehicleType)
      data = data.filter(item => item.vehicleType === vehicleType);

    // 번호판/세대 검색 (세대는 예시 데이터 없음)
    if (searchQuery.trim()) {
      if (searchCategory === 'plateNumber') {
        data = data.filter(item => item.plateNumber.includes(searchQuery.trim()));
      }
    }

    // 미출차 필터
    if (unExitedOnly) data = data.filter(item => item.exitTime === '-');

    setFilteredData(data);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setTimeFilterTarget('all');
    setStartTime('');
    setEndTime('');
    setVehicleType('');
    setParkingMinDays('');
    setParkingMaxDays('');
    setSearchCategory('plateNumber');
    setSearchQuery('');
    setUnExitedOnly(false);
    setFilteredData(MOCK_DATA);
  };

  // --------------------------- 렌더 ---------------------------
  return (
    <div className="flex flex-col gap-6">
      {/* 고급 검색 패널 */}
      <AdvancedSearch 
        title="검색조건 설정" 
        fields={searchFields}
        onSearch={handleSearch} 
        onReset={handleReset} 
      />

      {/* 데이터 테이블 */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">입출차 조회</h2>
        				<PaginatedTable data={filteredData} columns={columns} />
      </section>
    </div>
  );
} 
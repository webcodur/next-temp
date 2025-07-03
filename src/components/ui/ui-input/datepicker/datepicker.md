# Datepicker 컴포넌트

다양한 날짜 및 시간 선택 기능을 제공하는 컴포넌트 모음입니다.

## 구성 컴포넌트

### SingleDatePicker
단일 날짜 선택을 위한 컴포넌트

### DateRangePicker  
날짜 범위 선택을 위한 컴포넌트

### TimeOnlyPicker
시간만 선택하는 컴포넌트

## 주요 특징

- **한국어 지원**: `date-fns/locale/ko` 적용으로 한국어 인터페이스
- **커스텀 헤더**: 연도/월 드롭다운으로 빠른 탐색
- **뉴모피즘 디자인**: `neu-inset` 스타일로 일관된 디자인
- **유연한 포맷**: 날짜, 시간, 날짜+시간 조합 지원
- **접근성**: 키보드 네비게이션 및 포커스 관리

## 사용법

### 기본 단일 날짜 선택

```tsx
import { SingleDatePicker } from '@/components/ui/ui-input/datepicker/Datepicker';

const [selectedDate, setSelectedDate] = useState<Date | null>(null);

<SingleDatePicker
  selected={selectedDate}
  onChange={setSelectedDate}
  placeholderText="날짜를 선택하세요"
/>
```

### 날짜 + 시간 선택

```tsx
<SingleDatePicker
  selected={selectedDate}
  onChange={setSelectedDate}
  showTimeSelect={true}
  timeFormat="HH:mm"
  timeIntervals={15}
  dateFormat="yyyy-MM-dd"
  placeholderText="날짜 시간 선택"
/>
```

### 월/년도만 선택

```tsx
<SingleDatePicker
  selected={selectedMonth}
  onChange={setSelectedMonth}
  showMonthYearPicker={true}
  dateFormat="yyyy-MM"
  placeholderText="월 선택"
/>
```

### 날짜 범위 선택

```tsx
import { DateRangePicker } from '@/components/ui/ui-input/datepicker/Datepicker';

const [startDate, setStartDate] = useState<Date | null>(null);
const [endDate, setEndDate] = useState<Date | null>(null);

<DateRangePicker
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
/>
```

### 시간만 선택

```tsx
import { TimeOnlyPicker } from '@/components/ui/ui-input/datepicker/Datepicker';

const [selectedTime, setSelectedTime] = useState<Date | null>(null);

<TimeOnlyPicker
  selected={selectedTime}
  onChange={setSelectedTime}
  timeFormat="HH:mm"
  timeIntervals={30}
  placeholderText="시간 선택"
/>
```

## Props

### SingleDatePicker

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `selected` | `Date \| null` | - | 선택된 날짜 |
| `onChange` | `(date: Date \| null) => void` | - | 날짜 변경 콜백 |
| `dateFormat` | `string` | `'yyyy-MM-dd'` | 날짜 포맷 |
| `placeholderText` | `string` | `'날짜 선택'` | 플레이스홀더 텍스트 |
| `minDate` | `Date \| null` | - | 선택 가능한 최소 날짜 |
| `maxDate` | `Date \| null` | - | 선택 가능한 최대 날짜 |
| `showTimeSelect` | `boolean` | `false` | 시간 선택 활성화 |
| `timeFormat` | `string` | `'HH:mm'` | 시간 포맷 |
| `timeIntervals` | `number` | `30` | 시간 간격 (분) |
| `showMonthYearPicker` | `boolean` | `false` | 월/년도만 선택 |

### DateRangePicker

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `startDate` | `Date \| null` | - | 시작 날짜 |
| `endDate` | `Date \| null` | - | 종료 날짜 |
| `onStartDateChange` | `(date: Date \| null) => void` | - | 시작 날짜 변경 콜백 |
| `onEndDateChange` | `(date: Date \| null) => void` | - | 종료 날짜 변경 콜백 |

### TimeOnlyPicker

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `selected` | `Date \| null` | - | 선택된 시간 |
| `onChange` | `(time: Date \| null) => void` | - | 시간 변경 콜백 |
| `timeFormat` | `string` | `'HH:mm'` | 시간 포맷 |
| `timeIntervals` | `number` | `30` | 시간 간격 (분) |
| `minTime` | `Date` | - | 선택 가능한 최소 시간 |
| `maxTime` | `Date` | - | 선택 가능한 최대 시간 |

## 커스텀 기능

### 커스텀 헤더
모든 컴포넌트는 연도/월 드롭다운이 포함된 커스텀 헤더를 사용합니다:
- 연도: 현재 기준 ±15년 범위
- 월: 1월~12월 선택 가능
- 빠른 날짜 탐색 지원

### 스타일링
- `neu-inset` 클래스로 뉴모피즘 디자인 적용
- 포커스 시 아웃라인 제거 (`focus:outline-hidden`)
- 일관된 패딩과 테두리 스타일

## 사용 예시

### 이벤트 일정 선택
```tsx
function EventScheduler() {
  const [eventDate, setEventDate] = useState<Date | null>(null);
  
  return (
    <SingleDatePicker
      selected={eventDate}
      onChange={setEventDate}
      minDate={new Date()} // 오늘 이후만 선택 가능
      showTimeSelect={true}
      timeIntervals={15}
      placeholderText="이벤트 일시 선택"
    />
  );
}
```

### 보고서 기간 설정
```tsx
function ReportPeriod() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  return (
    <DateRangePicker
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
    />
  );
}
``` 
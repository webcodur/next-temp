# SeatMap 컴포넌트

시설별 좌석 예약 시스템의 핵심 컴포넌트로, 격자 기반 레이아웃을 통해 좌석 상태를 시각적으로 표시하고 선택할 수 있습니다.

## 기능

- **격자 기반 레이아웃**: 40x40px 기본 셀 크기의 격자 시스템
- **좌석 상태 표시**: 사용가능, 사용중, 예약됨, 사용불가 상태별 색상 구분
- **실시간 통계**: 상단에 좌석 현황 통계 표시
- **인터랙티브 선택**: 클릭으로 좌석 선택 가능
- **다국어 지원**: 모든 텍스트는 다국어 지원

## 사용법

### 기본 사용

```tsx
import { SeatMap } from '@/components/ui/ui-layout/seat-map/SeatMap';

const facility = {
	id: 'facility-1',
	name: '독서실 A',
	category: '독서실',
	gridSize: { width: 10, height: 8 },
	objects: [
		{
			id: 'seat-1',
			type: 'seat',
			name: 'A-01',
			size: { width: 1, height: 1 },
			status: 'available',
			reservable: true,
			position: { x: 0, y: 0 },
		},
	],
	cellSize: 40,
	createdAt: new Date(),
	updatedAt: new Date(),
};

<SeatMap
	layout={facility}
	onSeatSelect={(seatId) => console.log('Selected:', seatId)}
/>;
```

### 읽기 전용 모드

```tsx
<SeatMap layout={facility} readonly={true} />
```

### 선택된 좌석 표시

```tsx
<SeatMap
	layout={facility}
	selectedSeat="seat-1"
	onSeatSelect={(seatId) => setSelectedSeat(seatId)}
/>
```

## Props

| 이름           | 타입                       | 기본값  | 설명               |
| -------------- | -------------------------- | ------- | ------------------ |
| `layout`       | `FacilityLayout`           | -       | 시설 레이아웃 정보 |
| `selectedSeat` | `string`                   | -       | 선택된 좌석 ID     |
| `onSeatSelect` | `(seatId: string) => void` | -       | 좌석 선택 콜백     |
| `readonly`     | `boolean`                  | `false` | 읽기 전용 모드     |

## 상태 색상

| 상태        | 색상   | 설명               |
| ----------- | ------ | ------------------ |
| `available` | 초록색 | 사용 가능한 좌석   |
| `occupied`  | 빨간색 | 사용 중인 좌석     |
| `reserved`  | 노란색 | 예약된 좌석        |
| `disabled`  | 회색   | 사용 불가능한 좌석 |

## 객체 타입

### 좌석 (seat)

- 예약 가능한 좌석
- 상태별 색상 표시
- 클릭으로 선택 가능

### 공간 (space)

- 빈 공간 표시
- 어두운 회색으로 표시
- 선택 불가능

### 사물 (object)

- 화장실, 기둥 등 시설물
- 회색으로 표시
- 사용자 정의 이름 표시

## 키보드 단축키

현재 좌석 맵 자체는 키보드 단축키를 지원하지 않지만, 관리자 편집 모드에서는 다음과 같은 단축키를 지원합니다:

- `←`, `→`, `↑`, `↓`: 셀 이동
- `Q`: 좌석 배치
- `W`: 공간 배치
- `E`: 사물 배치
- `X`: 삭제

## 성능 최적화

- 격자 기반 렌더링으로 효율적인 렌더링
- 상태 변경 시 필요한 부분만 업데이트
- 호버 및 선택 효과는 CSS 트랜지션 사용

## 확장성

- 새로운 좌석 타입 추가 가능
- 커스텀 색상 스키마 지원
- 다양한 그리드 크기 지원

## 예제

### 독서실 레이아웃

```tsx
const readingRoom = {
  id: 'reading-room-1',
  name: '독서실 A',
  category: '독서실',
  gridSize: { width: 15, height: 10 },
  objects: [
    // 좌석들
    { id: 'seat-1', type: 'seat', name: 'A-01', status: 'available', ... },
    { id: 'seat-2', type: 'seat', name: 'A-02', status: 'occupied', ... },
    // 화장실
    { id: 'toilet-1', type: 'object', name: '화장실', ... },
    // 통로
    { id: 'space-1', type: 'space', ... }
  ],
  cellSize: 40,
  createdAt: new Date(),
  updatedAt: new Date()
};
```

### 카페 레이아웃

```tsx
const cafe = {
  id: 'cafe-1',
  name: '카페 B',
  category: '카페',
  gridSize: { width: 12, height: 8 },
  objects: [
    // 테이블 좌석
    { id: 'table-1', type: 'seat', name: '테이블1', status: 'available', size: { width: 2, height: 2 }, ... },
    // 바 좌석
    { id: 'bar-1', type: 'seat', name: '바1', status: 'reserved', ... },
    // 카운터
    { id: 'counter-1', type: 'object', name: '카운터', size: { width: 4, height: 1 }, ... }
  ],
  cellSize: 40,
  createdAt: new Date(),
  updatedAt: new Date()
};
```

## 관련 컴포넌트

- `FacilityEditor`: 시설 레이아웃 편집 도구
- `SeatReservation`: 좌석 예약 인터페이스
- `FacilityStats`: 시설 통계 표시

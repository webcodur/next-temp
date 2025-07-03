# Barrier3D 컴포넌트

Three.js 기반의 3D 주차장 차단기 시뮬레이션 컴포넌트입니다.

## 주요 특징

- **3D 시각화**: Three.js 기반 실시간 3D 렌더링
- **다중 시점**: 대각선, 운전자, 보안 카메라 시점 지원
- **애니메이션**: 부드러운 차단기 동작 애니메이션
- **상호작용**: 클릭으로 차단기 개폐 제어
- **운행 모드**: 상시개방, 자동운행, 우회 모드
- **뉴모피즘 UI**: 통일된 디자인 시스템

## 기본 사용법

```tsx
import ParkingBarrier3D from '@/components/ui/ui-3d/barrier/Barrier3d';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [operationMode, setOperationMode] = useState('auto-operation');

  return (
    <ParkingBarrier3D
      width={300}
      height={350}
      isOpen={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      viewAngle="diagonal"
      operationMode={operationMode}
      onOperationModeChange={setOperationMode}
      showControls={true}
    />
  );
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `width` | `number` | `150` | 컴포넌트 너비 |
| `height` | `number` | `180` | 컴포넌트 높이 |
| `isOpen` | `boolean` | `false` | 차단기 개폐 상태 |
| `onToggle` | `() => void` | - | 토글 버튼 클릭 핸들러 |
| `showControls` | `boolean` | `true` | 컨트롤 UI 표시 여부 |
| `viewAngle` | `'diagonal' \| 'driver' \| 'security'` | `'diagonal'` | 카메라 시점 |
| `operationMode` | `'always-open' \| 'auto-operation' \| 'bypass'` | `'auto-operation'` | 운행 모드 |
| `onOperationModeChange` | `(mode: OperationMode) => void` | - | 운행 모드 변경 핸들러 |
| `animationDuration` | `number` | `800` | 애니메이션 지속 시간 (ms) |
| `className` | `string` | `''` | 추가 CSS 클래스 |

## 시점 모드

### diagonal (대각선 시점)
- 기본 시점으로 가장 입체감이 좋음
- 전체적인 구조 파악에 적합
- 카메라 위치: `[3.5, 3.5, 3.5]`

### driver (운전자 시점)
- 실제 운전자가 보는 관점
- 차량 진입 시뮬레이션에 적합
- 카메라 위치: `[5, 2, 0]`

### security (보안 카메라 시점)
- 모니터링 최적화 각도
- 보안 시스템 UI에 적합
- 카메라 위치: `[0, 6, 4]`

## 운행 모드

### always-open (상시개방)
- 차단기가 항상 열린 상태 유지
- 아이콘: CheckCircle
- 색상: 녹색 계열

### auto-operation (자동운행)
- 정상적인 차단기 동작 모드
- 아이콘: RotateCcw
- 색상: 파란색 계열

### bypass (우회)
- 비상 상황 시 우회 모드
- 아이콘: Zap
- 색상: 주황색 계열

## 사용 예시

### 기본 차단기

```tsx
function BasicBarrier() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">주차장 차단기</h3>
      <ParkingBarrier3D
        width={250}
        height={300}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
    </div>
  );
}
```

### 다중 시점 비교

```tsx
function MultiViewBarriers() {
  const [states, setStates] = useState({
    diagonal: false,
    driver: false,
    security: false
  });

  const toggleBarrier = (view: string) => {
    setStates(prev => ({
      ...prev,
      [view]: !prev[view]
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center">
        <h4 className="mb-2 font-medium">대각선 시점</h4>
        <ParkingBarrier3D
          width={200}
          height={240}
          viewAngle="diagonal"
          isOpen={states.diagonal}
          onToggle={() => toggleBarrier('diagonal')}
        />
      </div>
      
      <div className="text-center">
        <h4 className="mb-2 font-medium">운전자 시점</h4>
        <ParkingBarrier3D
          width={200}
          height={240}
          viewAngle="driver"
          isOpen={states.driver}
          onToggle={() => toggleBarrier('driver')}
        />
      </div>
      
      <div className="text-center">
        <h4 className="mb-2 font-medium">보안 시점</h4>
        <ParkingBarrier3D
          width={200}
          height={240}
          viewAngle="security"
          isOpen={states.security}
          onToggle={() => toggleBarrier('security')}
        />
      </div>
    </div>
  );
}
```

### 운행 모드 제어

```tsx
function BarrierWithModes() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('auto-operation');

  const handleModeChange = (newMode) => {
    setMode(newMode);
    
    // 상시개방 모드면 자동으로 열기
    if (newMode === 'always-open') {
      setIsOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">운행 모드 제어</h3>
        <div className="text-sm text-gray-600">
          현재 모드: {mode}
        </div>
      </div>
      
      <ParkingBarrier3D
        width={300}
        height={350}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        operationMode={mode}
        onOperationModeChange={handleModeChange}
        animationDuration={600}
      />
      
      <div className="text-sm text-gray-600">
        {mode === 'always-open' && '⚠️ 상시개방 모드 - 차단기가 열린 상태로 유지됩니다'}
        {mode === 'auto-operation' && '✅ 자동운행 모드 - 정상 동작 중'}
        {mode === 'bypass' && '🔧 우회 모드 - 비상 운행 중'}
      </div>
    </div>
  );
}
```

### 대시보드 통합

```tsx
function ParkingDashboard() {
  const [barriers, setBarriers] = useState([
    { id: 1, name: '입구 차단기', isOpen: false, mode: 'auto-operation' },
    { id: 2, name: '출구 차단기', isOpen: false, mode: 'auto-operation' },
    { id: 3, name: 'VIP 차단기', isOpen: true, mode: 'always-open' }
  ]);

  const updateBarrier = (id, updates) => {
    setBarriers(prev => prev.map(barrier => 
      barrier.id === id ? { ...barrier, ...updates } : barrier
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {barriers.map(barrier => (
        <div key={barrier.id} className="p-4 bg-white rounded-lg shadow">
          <h4 className="mb-2 font-medium">{barrier.name}</h4>
          <ParkingBarrier3D
            width={220}
            height={260}
            isOpen={barrier.isOpen}
            onToggle={() => updateBarrier(barrier.id, { 
              isOpen: !barrier.isOpen 
            })}
            operationMode={barrier.mode}
            onOperationModeChange={(mode) => updateBarrier(barrier.id, { 
              mode 
            })}
            viewAngle="diagonal"
          />
        </div>
      ))}
    </div>
  );
}
```

## 기술적 특징

- **Three.js**: WebGL 기반 3D 렌더링
- **반응형**: 컨테이너 크기에 따른 자동 조정
- **성능 최적화**: 필요시에만 렌더링
- **메모리 관리**: 컴포넌트 언마운트 시 자동 정리
- **접근성**: 키보드 네비게이션 지원

## 스타일링

- **뉴모피즘**: `neu-raised`, `neu-inset` 클래스 사용
- **그림자**: 실시간 그림자 렌더링
- **조명**: 전문적인 3D 조명 설정
- **재질**: 실감나는 PBR 재질 시스템 
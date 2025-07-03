# NeumorphicContainer 컴포넌트 시스템

뉴모피즘(Neumorphism) 디자인을 구현한 4가지 컨테이너 컴포넌트 시스템입니다.

## 구성 컴포넌트

### RaisedContainer
양각 효과 - 컨테이너가 배경에서 튀어나온 듯한 효과

### InsetContainer  
음각 효과 - 컨테이너가 배경에 들어간 듯한 효과

### FlatContainer
평면 효과 - 미묘한 테두리로 구분되는 평면 컨테이너

### CircleContainer
원형 컨테이너 - 이중 그림자 효과의 원형 뉴모피즘

## 주요 특징

- **CSS-in-JS 스타일링**: 동적 그림자 계산
- **테마 시스템 통합**: CSS 변수 기반 색상 관리
- **유연한 확장성**: className prop으로 커스터마이징
- **일관된 패딩**: 기본 16px 패딩 제공
- **접근성**: 적절한 색상 대비 확보

## 기본 사용법

```tsx
import { RaisedContainer } from '@/components/ui/ui-layout/neumorphicContainer/RaisedContainer';
import { InsetContainer } from '@/components/ui/ui-layout/neumorphicContainer/InsetContainer';
import { FlatContainer } from '@/components/ui/ui-layout/neumorphicContainer/FlatContainer';
import { CircleContainer } from '@/components/ui/ui-layout/neumorphicContainer/CircleContainer';

function MyComponent() {
  return (
    <div className="space-y-6">
      <RaisedContainer>
        <h3>양각 컨테이너</h3>
        <p>튀어나온 듯한 효과</p>
      </RaisedContainer>
      
      <InsetContainer>
        <h3>음각 컨테이너</h3>
        <p>들어간 듯한 효과</p>
      </InsetContainer>
      
      <FlatContainer>
        <h3>평면 컨테이너</h3>
        <p>미묘한 테두리 효과</p>
      </FlatContainer>
      
      <CircleContainer>
        <span>원형</span>
      </CircleContainer>
    </div>
  );
}
```

## Props

모든 컨테이너 컴포넌트는 동일한 Props를 사용합니다:

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 컨테이너 내용 (필수) |
| `className` | `string` | `''` | 추가 CSS 클래스 |

## 컨테이너별 상세 가이드

### RaisedContainer (양각)

```tsx
<RaisedContainer className="max-w-md">
  <h3 className="text-lg font-semibold mb-2">카드 제목</h3>
  <p className="text-muted-foreground">
    양각 효과로 카드가 배경에서 떠올라 보입니다.
  </p>
  <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded">
    액션 버튼
  </button>
</RaisedContainer>
```

**사용 사례:**
- 주요 카드 컴포넌트
- 중요한 정보 강조
- 버튼 대체 요소
- 네비게이션 패널

### InsetContainer (음각)

```tsx
<InsetContainer className="max-w-md">
  <h3 className="text-lg font-semibold mb-2">입력 영역</h3>
  <div className="space-y-3">
    <input 
      type="text" 
      placeholder="이름"
      className="w-full p-2 bg-transparent border-none outline-none"
    />
    <input 
      type="email" 
      placeholder="이메일"
      className="w-full p-2 bg-transparent border-none outline-none"
    />
  </div>
</InsetContainer>
```

**사용 사례:**
- 입력 폼 그룹
- 텍스트 영역
- 콘텐츠 웰(well)
- 인용구 영역

### FlatContainer (평면)

```tsx
<FlatContainer className="max-w-md">
  <h3 className="text-lg font-semibold mb-2">정보 패널</h3>
  <div className="grid grid-cols-2 gap-4 text-sm">
    <div>
      <span className="text-muted-foreground">상태:</span>
      <span className="ml-2 font-medium">활성</span>
    </div>
    <div>
      <span className="text-muted-foreground">타입:</span>
      <span className="ml-2 font-medium">일반</span>
    </div>
  </div>
</FlatContainer>
```

**사용 사례:**
- 정보 디스플레이
- 테이블 셀 대체
- 리스트 아이템
- 서브틀한 구분

### CircleContainer (원형)

```tsx
<CircleContainer className="h-32 w-32">
  <div className="text-center">
    <div className="text-2xl font-bold">42</div>
    <div className="text-xs text-muted-foreground">점수</div>
  </div>
</CircleContainer>
```

**사용 사례:**
- 프로필 이미지 컨테이너
- 통계 표시
- 아이콘 배경
- 장식 요소

## 고급 사용 예시

### 인터랙티브 카드

```tsx
function InteractiveCard() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {isPressed ? (
        <InsetContainer className="transition-all duration-150">
          <CardContent />
        </InsetContainer>
      ) : (
        <RaisedContainer className="transition-all duration-150 cursor-pointer hover:shadow-lg">
          <CardContent />
        </RaisedContainer>
      )}
    </div>
  );
}
```

### 네비게이션 메뉴

```tsx
function NavigationMenu() {
  const [activeItem, setActiveItem] = useState('home');

  const menuItems = [
    { id: 'home', label: '홈', icon: '🏠' },
    { id: 'profile', label: '프로필', icon: '👤' },
    { id: 'settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <div className="space-y-2">
      {menuItems.map((item) => (
        <div key={item.id} onClick={() => setActiveItem(item.id)}>
          {activeItem === item.id ? (
            <InsetContainer className="cursor-pointer">
              <div className="flex items-center space-x-3">
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            </InsetContainer>
          ) : (
            <FlatContainer className="cursor-pointer hover:bg-accent/50">
              <div className="flex items-center space-x-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </FlatContainer>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 프로그레스 표시

```tsx
function ProgressIndicator({ progress = 75 }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">진행률</h3>
      
      <InsetContainer className="relative h-8">
        <div 
          className="absolute top-0 left-0 h-full bg-primary/20 rounded transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      </InsetContainer>
      
      <div className="flex justify-center">
        <CircleContainer className="h-24 w-24">
          <div className="text-center">
            <div className="text-xl font-bold">{progress}%</div>
            <div className="text-xs text-muted-foreground">완료</div>
          </div>
        </CircleContainer>
      </div>
    </div>
  );
}
```

### 폼 레이아웃

```tsx
function NeumorphicForm() {
  return (
    <RaisedContainer className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">사용자 정보</h2>
      
      <div className="space-y-6">
        <InsetContainer>
          <label className="block text-sm font-medium mb-2">이름</label>
          <input 
            type="text"
            className="w-full bg-transparent border-none outline-none text-lg"
            placeholder="이름을 입력하세요"
          />
        </InsetContainer>
        
        <InsetContainer>
          <label className="block text-sm font-medium mb-2">이메일</label>
          <input 
            type="email"
            className="w-full bg-transparent border-none outline-none text-lg"
            placeholder="이메일을 입력하세요"
          />
        </InsetContainer>
        
        <InsetContainer>
          <label className="block text-sm font-medium mb-2">메시지</label>
          <textarea 
            rows={4}
            className="w-full bg-transparent border-none outline-none resize-none"
            placeholder="메시지를 입력하세요"
          />
        </InsetContainer>
        
        <div className="flex justify-end space-x-4">
          <FlatContainer className="cursor-pointer hover:bg-muted/50">
            <span className="px-4 py-2">취소</span>
          </FlatContainer>
          
          <RaisedContainer className="cursor-pointer hover:shadow-lg transition-shadow">
            <span className="px-4 py-2 font-medium">제출</span>
          </RaisedContainer>
        </div>
      </div>
    </RaisedContainer>
  );
}
```

## 스타일링 커스터마이징

### 크기 조정

```tsx
// 작은 컨테이너
<RaisedContainer className="p-2 text-sm">
  작은 내용
</RaisedContainer>

// 큰 컨테이너  
<RaisedContainer className="p-8 text-lg">
  큰 내용
</RaisedContainer>

// 원형 크기 조정
<CircleContainer className="h-20 w-20 text-sm">
  작은 원
</CircleContainer>
```

### 색상 테마

```tsx
// 다크 테마에서 자동 적응
<RaisedContainer className="text-foreground bg-background">
  테마 적응 컨텐츠
</RaisedContainer>

// 특정 색상 강조
<InsetContainer className="bg-accent/5">
  액센트 배경
</InsetContainer>
```

### 반응형 디자인

```tsx
<RaisedContainer className="w-full md:max-w-md lg:max-w-lg">
  반응형 너비
</RaisedContainer>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <RaisedContainer>카드 1</RaisedContainer>
  <RaisedContainer>카드 2</RaisedContainer>
  <RaisedContainer>카드 3</RaisedContainer>
</div>
```

## 디자인 가이드라인

### 사용 원칙
1. **계층 구조**: Raised > Flat > Inset 순으로 시각적 계층 구성
2. **일관성**: 동일한 기능에는 동일한 컨테이너 타입 사용
3. **적절한 간격**: 컨테이너 간 충분한 여백 확보
4. **색상 조화**: 배경과 조화로운 색상 선택

### 피해야 할 사항
- 같은 레벨에서 모든 컨테이너를 Raised로 사용
- 너무 많은 CircleContainer 사용
- 과도한 중첩 (컨테이너 내부에 또 다른 컨테이너)
- 텍스트 가독성을 해치는 과도한 효과

## 접근성 고려사항

- **색상 대비**: 충분한 명도 차이 확보
- **포커스 표시**: 인터랙티브 요소에 명확한 포커스 스타일
- **의미론적 구조**: 적절한 HTML 태그 사용
- **스크린 리더**: 장식적 효과가 콘텐츠 이해에 방해되지 않도록 주의

## 브라우저 지원

- **Modern Browsers**: 모든 주요 브라우저 지원
- **box-shadow**: IE9+ 지원
- **CSS Variables**: 현대적 브라우저 권장
- **Fallback**: CSS 변수 미지원 시 기본 색상 적용 
# NestedTabs 컴포넌트 기술 문서

## 아키텍처 개요

2단계 중첩 구조를 지원하는 탭 시스템입니다. 1단계 탭 선택에 따라 2단계 탭 목록과 콘텐츠가 동적으로 변경됩니다. 상태 관리는 `useState`와 `useMemo`를 사용하여 최적화되었습니다.

## 핵심 구현

### 상태 관리

2단계 탭의 활성 상태를 각각의 `useState`로 관리합니다.

```typescript
const [activeTopId, setActiveTopId] = useState<string>(tabs[0]?.id);
const [activeSubId, setActiveSubId] = useState<string>(tabs[0]?.subTabs[0]?.id);
```

1단계 탭 클릭 시, 하위 2단계 탭의 첫 번째 항목을 기본으로 활성화합니다.

```typescript
const handleTopTabClick = (topId: string) => {
    setActiveTopId(topId);
    const newTopTab = tabs.find(tab => tab.id === topId);
    if (newTopTab?.subTabs[0]) {
        setActiveSubId(newTopTab.subTabs[0].id);
    }
};
```

### 컨텐츠 렌더링 최적화

`useMemo`를 사용하여 활성 탭이 변경될 때만 관련 컨텐츠를 계산하고 렌더링합니다.

```typescript
const activeTopTab = useMemo(() => 
    tabs.find(tab => tab.id === activeTopId), 
    [tabs, activeTopId]
);

const activeSubTabContent = useMemo(() => {
    return activeTopTab?.subTabs.find(subTab => subTab.id === activeSubId)?.content;
}, [activeTopTab, activeSubId]);
```

## 스타일링 시스템

기존 `Tabs` 컴포넌트와 동일한 `neu-` 접두사를 사용하는 뉴모피즘 스타일 시스템을 따릅니다.

- `neu-flat`: 기본 배경
- `neu-inset`: 선택된 요소 (눌린 효과)
- `neu-raised`: 선택 가능한 요소 (올라온 효과)

탭의 정렬, 크기, 변형은 `cn` 유틸리티와 `props`를 통해 동적으로 클래스를 조합하여 적용합니다. 2단계 탭은 가독성을 위해 `sm` 사이즈로 고정되어 있습니다.

## 접근성 고려사항

현재 버전은 기본적인 마우스 클릭 인터랙션에 중점을 두고 있습니다. 향후 키보드 네비게이션(화살표 키 이동, Enter/Space 선택 등) 및 ARIA 속성 지원을 추가하여 접근성을 강화할 계획입니다.

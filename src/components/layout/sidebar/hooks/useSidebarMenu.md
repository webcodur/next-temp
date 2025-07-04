# 1. `useSidebarMenu` 훅

사이드바의 메뉴 상태와 동작을 관리하는 핵심 훅이다. `Sidebar.tsx` 컴포넌트에서 주로 사용된다.

## 1.1. 주요 기능

- **메뉴 상태 관리**: Top, Mid 레벨 메뉴의 선택 및 확장 상태를 관리한다.
- **URL 연동**: 브라우저의 현재 URL(`pathname`)을 감지하여 관련 메뉴를 자동으로 활성화하고 펼친다.
- **열림 모드 지원**:
  - `단일 열림 모드`: 한 번에 하나의 Mid 메뉴만 펼칠 수 있다.
  - `다중 열림 모드`: 여러 Mid 메뉴를 동시에 펼칠 수 있다.
- **전체 제어**: 모든 메뉴를 한 번에 펼치거나 닫는 기능을 제공한다.
- **Hydration 방지**: `isMounted` 상태를 사용하여 클라이언트 사이드 렌더링이 완료된 후에만 `localStorage`와 상호작용하여 SSR과의 불일치 문제를 방지한다.

## 1.2. 반환 값 (객체)

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `topMenu` | `string` | 현재 선택된 Top 메뉴의 키. |
| `midMenu` | `string` | 현재 선택된 Mid 메뉴의 키. |
| `midExpanded` | `Set<string>` | 현재 펼쳐진 모든 Mid 메뉴의 키 집합. |
| `singleOpenMode` | `boolean` | `true`이면 단일 열림 모드, `false`이면 다중 열림 모드. |
| `handleTopClick` | `(topKey: string) => void` | Top 메뉴 클릭 시 호출되는 핸들러. |
| `handleMidClick` | `(midKey: string) => void` | Mid 메뉴 클릭 시 호출되는 핸들러. |
| `handleSingleOpenToggle` | `() => void` | 단일/다중 열림 모드를 토글하는 핸들러. |
| `handleExpandAll` | `() => Promise<void>` | 현재 Top 메뉴에 속한 모든 Mid 메뉴를 펼치는 핸들러. 다중 모드에서는 순차적 애니메이션이 적용된다. |
| `handleCollapseAll` | `() => Promise<void>` | 현재 펼쳐진 모든 Mid 메뉴를 닫는 핸들러. 다중 모드에서는 순차적 애니메이션이 적용된다. |

## 1.3. 사용법

```tsx
import { useSidebarMenu } from '@/components/layout/sidebar/hooks';

function Sidebar() {
    const {
        topMenu,
        midMenu,
        midExpanded,
        handleTopClick,
        handleMidClick,
        // ... 등등
    } = useSidebarMenu();

    // 이 값들을 사용하여 사이드바 UI를 렌더링하고 상호작용을 처리한다.
    return (
        <aside>
            <SideLPanel topMenu={topMenu} onTopClick={handleTopClick} />
            <SideRPanel midMenu={midMenu} midExpanded={midExpanded} onMidClick={handleMidClick} />
        </aside>
    );
}
```

## 1.4. 핵심 로직

1. **초기화**: 컴포넌트 마운트 시 `isMounted`를 `true`로 설정하고 `localStorage`에서 `singleOpenMode` 값을 불러와 적용한다.
2. **URL 감지 (`useEffect`)**: `pathname`이 변경될 때마다 `menuData`를 순회하여 현재 URL과 일치하는 메뉴를 찾아 `topMenu`, `midMenu`를 설정하고, `midExpanded` 상태를 업데이트한다.
3. **모드 변경 (`useEffect`)**: `singleOpenMode`가 변경되면 `midExpanded` 상태를 조정한다. 예를 들어 다중 모드에서 단일 모드로 전환 시, 현재 활성화된 메뉴 하나만 남기고 모두 닫는다.
4. **클릭 핸들러**: 각 메뉴 클릭 시 모드(`singleOpenMode`)에 따라 `midExpanded` 상태를 적절히 변경한다.
5. **전체 제어 핸들러**: `handleExpandAll`, `handleCollapseAll`은 `async/await`와 `setTimeout`을 조합하여 순차적인 애니메이션 효과를 구현한다. 
# 3. `useSidebarKeyboard` 훅

검색 모달(`SearchModal.tsx`) 내에서 키보드 탐색(위/아래 화살표, Enter, Escape) 기능을 관리하는 훅이다.

## 3.1. 주요 기능

- **키보드 이벤트 리스닝**: `useEffect`를 사용하여 컴포넌트 마운트 시 `keydown` 이벤트 리스너를 추가하고, 언마운트 시 제거한다.
- **항목 인덱스 관리**: 현재 활성화된(포커스된) 항목의 인덱스를 `activeIndex` 상태로 관리한다.
- **화살표 키 탐색**:
  - `ArrowDown`: `activeIndex`를 1 증가시켜 다음 항목으로 포커스를 이동시킨다. 목록의 끝에 도달하면 처음으로 순환한다.
  - `ArrowUp`: `activeIndex`를 1 감소시켜 이전 항목으로 포커스를 이동시킨다. 목록의 처음에 도달하면 마지막으로 순환한다.
- **Enter 키 선택**: 현재 활성화된 항목을 선택하고, `onEnter` 콜백 함수를 실행한다.
- **Escape 키 종료**: `onEscape` 콜백 함수를 실행하여 보통 모달을 닫는 동작을 트리거한다.

## 3.2. 파라미터 (객체)

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `itemCount` | `number` | 키보드 탐색이 적용될 목록의 전체 항목 수. |
| `onEnter` | `(index: number) => void` | Enter 키를 눌렀을 때 실행될 콜백 함수. 현재 활성화된 항목의 인덱스를 인자로 받는다. |
| `onEscape` | `() => void` | Escape 키를 눌렀을 때 실행될 콜백 함수. |
| `enabled` | `boolean` (선택 사항) | 훅의 활성화 여부를 제어한다. `false`이면 키보드 이벤트를 무시한다. 기본값은 `true`. |

## 3.3. 반환 값

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `activeIndex` | `number` | 현재 활성화된(포커스된) 항목의 인덱스. 이 값을 사용하여 UI에서 특정 항목을 하이라이트할 수 있다. |

## 3.4. 사용법

```tsx
import { useSidebarKeyboard } from '@/components/layout/sidebar/hooks';

function SearchModal({ items, onSelect, onClose }) {
    const { activeIndex } = useSidebarKeyboard({
        itemCount: items.length,
        onEnter: (index) => onSelect(items[index]),
        onEscape: onClose,
        enabled: true,
    });

    return (
        <div>
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className={index === activeIndex ? 'active' : ''}
                >
                    {item.name}
                </div>
            ))}
        </div>
    );
}
```

## 3.5. 핵심 로직

1. **상태 및 이벤트 리스너 설정**: `activeIndex` 상태를 `useState`로, `keydown` 이벤트 핸들러를 `useEffect` 내에서 설정한다. `enabled` 플래그가 `false`이면 아무 작업도 하지 않는다.
2. **키보드 이벤트 처리 (`handleKeyDown`)**:
   - `event.key` 값을 `switch` 문으로 확인한다.
   - `ArrowDown`, `ArrowUp`: `activeIndex`를 순환적으로 업데이트한다. `(prevIndex + 1) % itemCount`와 같은 모듈러 연산을 사용하여 배열의 끝과 시작을 부드럽게 연결한다.
   - `Enter`: `event.preventDefault()`로 기본 동작(폼 제출 등)을 막고, `onEnter` 콜백을 실행한다.
   - `Escape`: `onEscape` 콜백을 실행한다.
3. **인덱스 초기화**: `itemCount`가 변경될 때마다 `activeIndex`를 -1로 초기화하여, 검색 결과가 바뀔 때마다 포커스가 리셋되도록 한다. 
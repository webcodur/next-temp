# 2. `useSidebarSearch` 훅

사이드바의 '현장 검색' 기능과 관련된 모든 상태와 로직을 관리하는 훅이다. `SearchBar.tsx`와 `SearchModal.tsx`에서 사용된다.

## 2.1. 주요 기능

- **검색 상태 관리**: 검색어(`searchQuery`), 검색 결과(`searchResults`), 검색 활성화 여부(`isSearchActive`)를 Jotai 아톰으로 관리한다.
- **검색 실행**: 입력된 검색어를 바탕으로 `dummySites` 데이터에서 현장 이름, 주소, 설명을 검색하여 결과를 필터링한다. (현재는 더미 데이터 사용, 추후 API 연동 필요)
- **최근 접속 현장 관리**:
  - 사용자가 검색 결과나 최근 목록에서 현장을 선택하면 `recentSites` 아톰에 추가/업데이트한다.
  - 최근 접속 시각(`accessedAt`)을 기록하고, 목록은 최대 10개까지 유지된다.
  - 중복된 현장이 선택될 경우, 기존 항목을 제거하고 최신 정보로 맨 앞에 추가한다.
- **UI 상호작용**: 검색어 입력, 초기화, 제출, 결과 선택 등 사용자 입력에 따른 상태 변경 로직을 제공한다.

## 2.2. 반환 값 (객체)

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `searchQuery` | `string` | 현재 검색어. |
| `searchResults` | `Site[]` | 검색 결과 배열. |
| `isSearchActive` | `boolean` | 검색창이 활성화되었는지 (보통 검색어가 있을 때 `true`). |
| `recentSites` | `Site[]` | 최근 접속한 현장 배열 (최대 10개). |
| `handleSearchChange` | `(value: string) => void` | 검색어 입력 시 호출되는 핸들러. |
| `handleSearchClear` | `() => void` | 검색어를 지우는 핸들러. |
| `handleSearchSubmit` | `() => void` | 검색을 실행하는 핸들러 (e.g., Enter 키 입력 시). |
| `handleResultSelect` | `(site: Site) => void` | 검색 결과나 최근 현장을 선택했을 때 호출되는 핸들러. |

*`Site` 타입: `{ id: string, name: string, address: string, description?: string, accessedAt?: number }`*

## 2.3. 사용법

```tsx
import { useSidebarSearch } from '@/components/layout/sidebar/hooks';

function SearchBar() {
    const {
        searchQuery,
        searchResults,
        recentSites,
        handleSearchChange,
        handleSearchClear,
        handleResultSelect,
    } = useSidebarSearch();

    // 이 값들을 사용하여 검색 UI를 렌더링하고 상호작용을 처리한다.
    return (
        <div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            {/* searchResults 또는 recentSites를 기반으로 드롭다운 목록 표시 */}
        </div>
    );
}
```

## 2.4. 핵심 로직

1. **상태 연결**: Jotai의 `useAtom`을 사용하여 전역 상태(`siteSearchQueryAtom` 등)와 훅의 로직을 연결한다.
2. **검색 수행 (`performSearch`)**: 검색어(`query`)가 비어있지 않으면 `dummySites` 배열을 `filter`하여 일치하는 항목을 찾아 `searchResults` 상태를 업데이트한다.
3. **최근 항목 추가 (`addToRecentSites`)**: 현장 선택 시, 해당 현장 객체에 `accessedAt` 타임스탬프를 추가하고, 기존 목록에서 중복을 제거한 뒤, 새 항목을 배열의 맨 앞에 삽입한다. `slice(0, 10)`을 통해 목록의 최대 크기를 유지한다.
4. **핸들러 함수**: 각 핸들러는 검색 관련 상태를 업데이트하고, 필요에 따라 다른 함수(`performSearch`, `addToRecentSites`)를 호출하여 유기적으로 동작한다. 
# 4. `useMenuSearch` 훅

사이드바의 '메뉴 검색' 기능과 관련된 모든 상태와 로직을 관리하는 훅이다. `MenuSearchBar.tsx`와 `SearchModal.tsx`에서 사용된다.

## 4.1. 주요 기능

- **검색 상태 관리**: 검색어(`searchQuery`), 검색 결과(`searchResults`), 검색 활성화 여부(`isSearchActive`)를 Jotai 아톰으로 관리한다.
- **메뉴 검색 실행**:
  - 입력된 검색어를 바탕으로 `menuData`에 정의된 모든 Mid, Bot 메뉴의 이름(`kor-name`)과 설명(`description`)을 검색한다.
  - 검색 결과는 Mid 메뉴가 상위에 오도록 정렬된다.
- **최근 검색 메뉴 관리**:
  - 사용자가 검색 결과에서 메뉴를 선택하면 `recentMenus` 아톰에 추가/업데이트한다.
  - 최근 접속 시각(`accessedAt`)을 기록하고, 목록은 최대 10개까지 유지된다.
- **페이지 이동**: 검색 결과를 선택하면 Next.js의 `useRouter`를 사용하여 해당 페이지로 이동시킨다.

## 4.2. 반환 값 (객체)

| 키 | 타입 | 설명 |
| --- | --- | --- |
| `searchQuery` | `string` | 현재 메뉴 검색어. |
| `searchResults` | `MenuSearchResult[]` | 메뉴 검색 결과 배열. |
| `isSearchActive` | `boolean` | 검색창이 활성화되었는지 여부. |
| `recentMenus` | `RecentMenu[]` | 최근 선택한 메뉴 배열 (최대 10개). |
| `handleSearchChange` | `(query: string) => void` | 검색어 입력 시 호출되는 핸들러. |
| `handleSearchClear` | `() => void` | 검색어를 지우는 핸들러. |
| `handleResultSelect` | `(result: MenuSearchResult) => void` | 검색 결과나 최근 메뉴를 선택했을 때 호출되는 핸들러. |

*타입 정의는 `types.ts` 및 훅 내부 참고*

## 4.3. 사용법

```tsx
import { useMenuSearch } from '@/components/layout/sidebar/hooks';

function MenuSearchBar() {
    const {
        searchQuery,
        searchResults,
        handleSearchChange,
        handleResultSelect,
    } = useMenuSearch();

    return (
        <div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            {/* searchResults를 기반으로 드롭다운 목록 표시 */}
        </div>
    );
}
```

## 4.4. 핵심 로직

1. **상태 및 라우터 연결**: Jotai의 `useAtom`으로 전역 상태를, Next.js의 `useRouter`로 페이지 네비게이션 기능을 가져온다.
2. **검색 수행 (`performSearch`)**:
   - `menuData`를 이중 `forEach`문으로 순회하며 모든 Mid, Bot 메뉴를 대상으로 검색한다.
   - `kor-name`과 `description` 필드를 소문자로 변환하여 검색어와 비교한다.
   - 검색된 결과는 `results` 배열에 추가되며, 타입(`mid` 또는 `bot`)과 메뉴 경로(`topKey`, `midKey`) 정보가 함께 저장된다.
   - 결과 배열은 `sort` 메서드를 통해 Mid 메뉴가 항상 Bot 메뉴보다 먼저 오도록 정렬된다.
3. **결과 선택 (`handleResultSelect`)**:
   - 선택된 항목이 페이지 링크(`href`)를 가진 `bot` 타입이면, `router.push`로 바로 이동시킨다.
   - 선택된 항목이 `mid` 타입이면, 해당 Mid 메뉴의 첫 번째 `bot` 메뉴를 찾아 그 페이지로 이동시킨다.
   - 페이지 이동 전에 `addToRecentMenus`를 호출하여 최근 메뉴 목록을 업데이트한다.
4. **최근 항목 추가 (`addToRecentMenus`)**: `useSidebarSearch`의 로직과 유사하게, 선택된 메뉴 정보를 `accessedAt` 타임스탬프와 함께 최근 목록의 맨 앞에 추가하고, 목록 크기를 10개로 유지한다.
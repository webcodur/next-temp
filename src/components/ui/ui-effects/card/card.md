# Card 기능 명세서

`Card`는 관련된 정보와 액션을 하나의 컨테이너에 그룹화하여 보여주는 유연한 UI 컴포넌트입니다.

## 1. 컴포넌트 구조

`Card`는 여러 하위 컴포넌트들을 조합하여 원하는 레이아웃을 만들 수 있습니다.

```mermaid
graph TD
    subgraph Card
        direction TB
        subgraph CardHeader
            direction TB
            A1[CardActions<br/>(우상단 액션 버튼들)]
            A2[CardBadge<br/>(상태 배지)]
            A3[CardTitle<br/>(제목)]
            A4[CardDescription<br/>(설명)]
        end
        B[CardContent<br/>(메인 콘텐츠 영역)]
        C[CardFooter<br/>(하단 푸터 영역, e.g., 확인 버튼)]
    end

    style CardHeader fill:#f3e5f5, stroke:#333
    style CardContent fill:#e3f2fd, stroke:#333
    style CardFooter fill:#e8f5e9, stroke:#333
```

- **Card**: 모든 요소를 감싸는 최상위 컨테이너입니다.
- **CardHeader**: 카드의 머리글 영역으로, 제목, 설명, 배지, 액션 버튼 등을 포함합니다.
- **CardContent**: 카드의 핵심 내용이 들어가는 본문 영역입니다.
- **CardFooter**: 카드의 바닥글 영역으로, 주로 확인/취소 버튼과 같은 최종 액션을 배치합니다.

## 2. 스타일 옵션: Variant와 Hover 효과

`variant`와 `hoverEffect` prop을 조합하여 다양한 시각적 스타일을 연출할 수 있습니다.

| `variant`       | 설명                                    | `hoverEffect` 적용 시                                   |
| :-------------- | :-------------------------------------- | :------------------------------------------------------ |
| `default`       | 기본 뉴모피즘 플랫 스타일입니다.        | 마우스를 올리면 카드가 살짝 들어가는 효과가 나타납니다. |
| `outline-solid` | 단색 테두리가 있는 스타일입니다.        | 마우스를 올리면 카드가 살짝 떠오르는 효과가 나타납니다. |
| `elevated`      | 그림자가 더 강한, 떠 있는 스타일입니다. | 기본적으로 떠 있는 효과가 적용되어 있습니다.            |

## 3. 하위 컴포넌트 역할

| 컴포넌트          | 역할                                      | 위치 예시     |
| :---------------- | :---------------------------------------- | :------------ |
| `Card`            | 전체 컨테이너                             | -             |
| `CardHeader`      | 머리글 영역                               | 상단          |
| `CardTitle`       | 제목                                      | Header 내부   |
| `CardDescription` | 부가 설명                                 | Header 내부   |
| `CardContent`     | 본문                                      | 중앙          |
| `CardFooter`      | 바닥글 영역                               | 하단          |
| `CardActions`     | 여러 액션 버튼을 담는 컨테이너            | Header 우상단 |
| `CardAction`      | 개별 액션 버튼 (예: 더보기, 좋아요)       | Actions 내부  |
| `CardBadge`       | 상태를 나타내는 배지 (예: '신규', '완료') | Header 좌상단 |

## 4. 주요 사용 시나리오

- **대시보드 위젯**: 현재 방문자 수, 매출 현황 등 주요 지표를 각각의 카드에 담아 대시보드를 구성합니다.
- **제품 목록**: 쇼핑몰에서 각 제품의 이미지, 이름, 가격, '장바구니 담기' 버튼을 하나의 카드로 묶어 보여줍니다.
- **사용자 프로필**: 커뮤니티에서 사용자의 아바타, 이름, 자기소개, '친구 추가' 버튼 등을 담은 프로필 카드를 표시합니다.
- **블로그 포스트 요약**: 블로그 목록 페이지에서 각 포스트의 썸네일, 제목, 요약, '더 읽기' 링크를 카드로 제공합니다.

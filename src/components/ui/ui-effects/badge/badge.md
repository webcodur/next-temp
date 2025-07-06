# Badge 기능 명세서

`Badge`는 상태, 카테고리, 알림 개수 등 간결한 정보를 시각적으로 강조하여 표시하는 데 사용되는 작은 UI 요소입니다.

## 1. Variant (종류)

`Badge`는 목적과 의미에 따라 선택할 수 있는 네 가지 기본 스타일(`variant`)을 제공합니다.

| Variant       | 시각적 표현 (예시)                                                                                             | 설명                                                            |
| :------------ | :------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| `default`     | <span style="background-color: black; color: white; padding: 2px 8px; border-radius: 9999px;">Primary</span>   | 가장 기본적인 스타일로, 주요 정보나 긍정적인 상태를 나타냅니다. |
| `secondary`   | <span style="background-color: gray; color: white; padding: 2px 8px; border-radius: 9999px;">Secondary</span>  | 덜 중요한 보조 정보나 중립적인 상태를 표시합니다.               |
| `destructive` | <span style="background-color: red; color: white; padding: 2px 8px; border-radius: 9999px;">Destructive</span> | 삭제, 위험, 오류 등 부정적인 상태를 강조하여 경고합니다.        |
| `outline`     | <span style="border: 1px solid gray; padding: 2px 8px; border-radius: 9999px;">Outline</span>                  | 다른 배지보다 시각적으로 덜 튀는, 테두리만 있는 스타일입니다.   |

## 2. 핵심 특징

```mermaid
graph LR
    subgraph "Badge의 특징"
        A["<b>다양한 Variant</b><br/>4가지 스타일 제공"]
        B["<b>뉴모피즘 디자인</b><br/>프로젝트 UI와 통일감"]
        C["<b>유연한 스타일링</b><br/>커스텀 클래스 적용 가능"]
    end
```

## 3. 주요 사용 시나리오

- **게시물 태그**: 블로그 포스트나 뉴스 기사에 'React', 'Tech', 'News'와 같은 카테고리 태그를 붙입니다.
- **사용자 상태 표시**: 사용자 목록에서 '온라인'(default), '오프라인'(secondary), '탈퇴'(destructive) 상태를 표시합니다.
- **알림 카운트**: 이메일 아이콘 옆에 읽지 않은 메시지 개수(`+9`)를 표시합니다.
- **결제 상태**: 주문 내역에서 '결제 완료'(default), '배송 중'(secondary), '주문 취소'(destructive) 상태를 명확하게 보여줍니다.
- **버전 정보**: 소프트웨어 이름 옆에 'v1.2.0'과 같은 버전 정보를 `outline` 배지로 표시합니다.

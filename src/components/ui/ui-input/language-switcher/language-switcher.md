# LanguageSwitcher 기능 명세서

`LanguageSwitcher`는 사용자가 애플리케이션의 표시 언어를 손쉽게 변경할 수 있도록 돕는 UI 컴포넌트입니다. 드롭다운 메뉴 형태로 사용 가능한 언어 목록을 보여주고, 선택 시 즉시 언어를 전환합니다.

## 1. 핵심 기능 및 동작

사용자가 언어 아이콘을 클릭하면 선택 가능한 언어 목록이 나타나고, 특정 언어를 선택하면 애플리케이션 전체의 언어가 변경된 후 페이지가 새로고침됩니다.

```mermaid
sequenceDiagram
    participant User
    participant LanguageSwitcher as LS
    participant I18nService as "국제화 서비스 (i18n)"

    User->>LS: 언어 아이콘 클릭
    LS-->>User: 언어 목록 드롭다운 표시 (한국어, English, العربية)

    User->>LS: 'English' 선택
    LS->>I18nService: changeLocale('en') 호출
    activate I18nService
    I18nService->>I18nService: 선택된 언어(en)를<br/>쿠키 또는 로컬 스토리지에 저장
    I18nService->>I18nService: window.location.reload() 호출하여<br/>페이지 새로고침
    deactivate I18nService
```

## 2. 형태(Variant)에 따른 UI 변화

`variant` prop을 통해 `header`, `sidebar`, `inline` 세 가지 다른 UI 형태로 렌더링할 수 있습니다. 각 형태는 특정 레이아웃에 최적화되어 있습니다.

```mermaid
graph TD
    subgraph "variant Prop"
        V_H[header]
        V_S[sidebar]
        V_I[inline]
    end

    subgraph "UI 결과물"
        UI_H["- 아이콘만 표시<br>- 클릭 시 콤팩트한 드롭다운"]
        UI_S["- 아이콘과 언어 이름 전체 표시<br>- 세로 레이아웃에 적합"]
        UI_I["- 현재 언어 이름과 아이콘 표시<br>- 일반적인 본문 내 사용에 적합"]
    end

    V_H --> UI_H
    V_S --> UI_S
    V_I --> UI_I

    style V_H fill:#e3f2fd
    style V_S fill:#e8f5e9
    style V_I fill:#fef9e7
```

| Variant   | 주요 특징                                     | 사용 위치 예시 |
| :-------- | :-------------------------------------------- | :------------- |
| `header`  | 공간을 절약하는 아이콘 기반의 콤팩트한 디자인 | 페이지 헤더    |
| `sidebar` | 명확한 텍스트 라벨을 포함한 세로 디자인       | 사이드바 메뉴  |
| `inline`  | 가장 표준적인 형태의 드롭다운                 | 설정 페이지 등 |

## 3. 사용 시나리오

- **다국어 웹사이트 헤더**: 웹사이트의 메인 헤더에 `header` variant를 배치하여 모든 페이지에서 일관된 언어 전환 기능을 제공합니다.
- **사용자 설정 페이지**: 사용자가 자신의 프로필 설정에서 선호 언어를 직접 선택할 수 있도록 `inline` variant를 제공합니다.
- **모바일 사이드 메뉴**: 모바일 환경의 햄버거 메뉴나 사이드바 내부에 `sidebar` variant를 배치하여 쉽게 언어를 변경할 수 있도록 합니다.

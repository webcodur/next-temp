# 단순 입력(Simple Input) 컴포넌트 모음

이 문서는 사용자의 입력을 받는 기본적인 UI 컴포넌트 여섯 가지(`Checkbox`, `CheckboxGroup`, `RadioGroup`, `ToggleButton`, `ToggleSwitch`, `Dropdown`)의 기능과 사용법을 설명합니다.

## 1. 컴포넌트 종류 및 핵심 기능

각 컴포넌트는 특정한 형태의 사용자 입력을 처리하는 데 사용됩니다.

```mermaid
graph TD
    subgraph "입력 컴포넌트"
        A[FieldCheckbox<br/>(체크박스)]
        B[FieldCheckboxGroup<br/>(체크박스 그룹)]
        C[FieldRadioGroup<br/>(라디오 그룹)]
        D[FieldToggleButton<br/>(토글 버튼)]
        E[FieldToggleSwitch<br/>(토글 스위치)]
        F[FieldDropdown<br/>(드롭다운)]
    end

    subgraph "핵심 기능"
        Func_A["- 단일 선택<br/>- On/Off 상태"]
        Func_B["- 다중 선택<br/>- 호버 영역 가이드라인<br/>- 유연한 배치"]
        Func_C["- 여러 옵션 중 단일 선택<br/>- 가로/세로 배치 지원<br/>- 호버 영역 가이드라인"]
        Func_D["- 두 가지 상태 전환<br/>- 아이콘/텍스트 기반"]
        Func_E["- On/Off 상태 전환<br/>- 시각적인 스위치 형태"]
        Func_F["- 여러 옵션 중 선택<br/>- 리스트 아이콘 포함<br/>- 드롭다운 메뉴"]
    end

    A --> Func_A
    B --> Func_B
    C --> Func_C
    D --> Func_D
    E --> Func_E
    F --> Func_F
```

---

## 2. FieldCheckbox

하나 이상의 옵션을 자유롭게 선택하거나 해제할 수 있는 체크박스입니다. `label` prop을 통해 각 체크박스 옆에 설명 텍스트를 추가할 수 있습니다.

| Prop       | 설명                        | 예시          |
| :--------- | :-------------------------- | :------------ |
| `label`    | 체크박스 옆에 표시될 텍스트 | "자동 로그인" |
| `checked`  | 체크 상태 (boolean)         | `true`        |
| `onChange` | 상태 변경 시 호출되는 함수  | `(e) => {}`   |

---

## 3. FieldCheckboxGroup

여러 체크박스를 그룹으로 배치하여 다중 선택을 처리하는 컴포넌트입니다. 호버 시 선택 영역이 시각적으로 표시되어 사용성이 향상됩니다.

| Prop       | 설명                                    | 예시                              |
| :--------- | :-------------------------------------- | :-------------------------------- |
| `options`  | 체크박스 옵션 배열 (`{value, label}`)  | `[{value: 'a', label: '옵션 A'}]` |
| `value`    | 선택된 값들의 배열                      | `['a', 'b']`                      |
| `onChange` | 값 변경 시 호출되는 함수                | `(values) => {}`                  |

---

## 4. FieldRadioGroup

여러 개의 선택지 중에서 반드시 하나만 선택해야 하는 경우에 사용됩니다. 가로/세로 배치를 지원하며 호버 시 선택 영역 가이드라인을 제공합니다.

| Prop       | 설명                                | 예시                              |
| :--------- | :---------------------------------- | :-------------------------------- |
| `options`  | 선택지 객체 배열 (`{value, label}`) | `[{value: 'a', label: '옵션 A'}]` |
| `value`    | 현재 선택된 값                      | `'a'`                             |
| `onChange` | 값 변경 시 호출되는 함수            | `(e) => {}`                       |
| `layout`   | 배치 방향 (`'vertical' \| 'horizontal'`) | `'vertical'`                    |

---

## 5. FieldToggleButton

아이콘이나 텍스트를 사용하여 두 가지 상태(예: 켜짐/꺼짐, 선택/비선택)를 전환하는 버튼입니다. 주로 시각적인 모드 전환에 사용됩니다.

| Prop        | 설명                                 | 예시                              |
| :---------- | :----------------------------------- | :-------------------------------- |
| `pressed`   | 토글 상태 (boolean)                  | `true`                            |
| `onChange`  | 토글 시 호출되는 함수                | `() => {}`                        |
| `variant`   | 버튼 스타일 변형                     | `'default'`, `'outline-solid'`    |

---

## 6. FieldToggleSwitch

시각적으로 명확한 On/Off 스위치를 제공하여, 설정이나 기능을 켜고 끄는 데 사용됩니다.

| Prop       | 설명                         | 예시        |
| :--------- | :--------------------------- | :---------- |
| `checked`  | 스위치 On/Off 상태 (boolean) | `true`      |
| `onChange` | 상태 변경 시 호출되는 함수   | `(e) => {}` |
| `label`    | 스위치 옆에 표시될 텍스트    | "알림 받기" |

---

## 7. FieldDropdown

여러 옵션 중에서 하나를 선택할 수 있는 드롭다운 메뉴입니다. 왼쪽에 리스트 아이콘, 우측에 컨텐츠를 포함합니다.

| Prop          | 설명                                | 예시                              |
| :------------ | :---------------------------------- | :-------------------------------- |
| `options`     | 드롭다운 옵션 배열 (`{value, label}`) | `[{value: 'a', label: '옵션 A'}]` |
| `value`       | 현재 선택된 값                      | `'a'`                             |
| `onChange`    | 값 변경 시 호출되는 함수            | `(value) => {}`                   |
| `placeholder` | 선택되지 않은 상태의 표시 텍스트    | "선택하세요"                      |

## 8. 사용 시나리오

- **설정 페이지**: `ToggleSwitch`로 각종 알림 설정을, `RadioGroup`으로 테마 설정을, `Dropdown`으로 언어 선택을 제어합니다.
- **가입 양식**: `Checkbox`로 개별 약관 동의를, `CheckboxGroup`으로 관심 분야를, `Dropdown`으로 직업을 선택받습니다.
- **에디터 툴바**: `ToggleButton`을 사용하여 텍스트 스타일(볼드, 이탤릭)을 켜고 끕니다.
- **필터링**: `CheckboxGroup`으로 카테고리를, `RadioGroup`으로 정렬 옵션을, `Dropdown`으로 지역을 선택합니다.

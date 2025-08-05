# 단순 입력(Simple Input) 컴포넌트 모음

이 문서는 사용자의 입력을 받는 기본적인 UI 컴포넌트 열두 가지(`Checkbox`, `CheckboxGroup`, `RadioGroup`, `ToggleButton`, `ToggleSwitch`, `Dropdown`, `TextInput`, `TextArea`, `DatePicker`, `TimePicker`, `DateRangePicker`, `MonthPicker`)의 기능과 사용법을 설명합니다.

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
        G[FieldTextInput<br/>(텍스트 입력)]
        H[FieldTextArea<br/>(텍스트 영역)]
        I[FieldDatePicker<br/>(날짜 선택기)]
        J[FieldTimePicker<br/>(시간 선택기)]
        K[FieldDateRangePicker<br/>(날짜 범위 선택기)]
        L[FieldMonthPicker<br/>(월 선택기)]
    end

    subgraph "핵심 기능"
        Func_A["- 단일 선택<br/>- On/Off 상태"]
        Func_B["- 다중 선택<br/>- 호버 영역 가이드라인<br/>- 유연한 배치"]
        Func_C["- 여러 옵션 중 단일 선택<br/>- 가로/세로 배치 지원<br/>- 호버 영역 가이드라인"]
        Func_D["- 두 가지 상태 전환<br/>- 아이콘/텍스트 기반"]
        Func_E["- On/Off 상태 전환<br/>- 시각적인 스위치 형태"]
        Func_F["- 여러 옵션 중 선택<br/>- 리스트 아이콘 포함<br/>- 드롭다운 메뉴"]
        Func_G["- 텍스트 입력<br/>- 다양한 입력 타입 지원<br/>- 포커스 상태 관리"]
        Func_H["- 다중 라인 텍스트 입력<br/>- 글자 수 제한<br/>- 크기 조절 옵션<br/>- 스크롤 지원"]
        Func_I["- 날짜 선택<br/>- 한국어 로케일 지원<br/>- 커스텀 헤더<br/>- 최소/최대 날짜 제한"]
        Func_J["- 시간 선택<br/>- 시간 간격 설정<br/>- 최소/최대 시간 제한<br/>- 24시간 형식"]
        Func_K["- 날짜 범위 선택<br/>- 시작/종료 날짜<br/>- 범위 검증<br/>- 시각적 피드백"]
        Func_L["- 년월 선택<br/>- 월별 보기<br/>- 년도 빠른 이동<br/>- 월별 필터링"]
    end

    A --> Func_A
    B --> Func_B
    C --> Func_C
    D --> Func_D
    E --> Func_E
    F --> Func_F
    G --> Func_G
    H --> Func_H
    I --> Func_I
    J --> Func_J
    K --> Func_K
    L --> Func_L
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

---

## 8. FieldTextInput

사용자가 텍스트를 직접 입력할 수 있는 입력 필드입니다. 다양한 입력 타입을 지원하며 포커스 상태에 따른 시각적 피드백을 제공합니다.

| Prop          | 설명                                | 예시                              |
| :------------ | :---------------------------------- | :-------------------------------- |
| `value`       | 현재 입력된 값                      | `'사용자 입력'`                   |
| `onChange`    | 값 변경 시 호출되는 함수            | `(value) => {}`                   |
| `placeholder` | 입력 전 표시될 안내 텍스트          | "텍스트를 입력하세요"             |
| `type`        | 입력 타입 (`'text' \| 'email' \| 'password' \| 'number'`) | `'text'`                    |
| `disabled`    | 비활성화 여부                      | `false`                          |

---

## 8. FieldTextArea

사용자가 여러 줄의 텍스트를 입력할 수 있는 텍스트 영역입니다. 긴 텍스트나 메모, 설명 등을 입력받을 때 사용됩니다.

| Prop          | 설명                                | 예시                              |
| :------------ | :---------------------------------- | :-------------------------------- |
| `value`       | 현재 입력된 값                      | `'사용자 입력 텍스트'`            |
| `onChange`    | 값 변경 시 호출되는 함수            | `(value) => {}`                   |
| `placeholder` | 입력 전 표시될 안내 텍스트          | "내용을 입력하세요"               |
| `rows`        | 텍스트 영역의 세로 줄 수            | `4`                               |
| `maxLength`   | 최대 입력 가능한 글자 수            | `500`                             |
| `resize`      | 크기 조절 옵션                      | `'vertical' \| 'none' \| 'both'`  |
| `disabled`    | 비활성화 여부                      | `false`                          |
| `showCharCount` | 글자 수 표시 여부                 | `true`                           |

---

## 9. FieldDatePicker

사용자가 날짜를 선택할 수 있는 날짜 선택기입니다. 한국어 로케일을 지원하며 커스텀 헤더를 통해 년도와 월을 빠르게 변경할 수 있습니다.

| Prop          | 설명                                | 예시                              |
| :------------ | :---------------------------------- | :-------------------------------- |
| `value`       | 선택된 날짜 (Date \| null)         | `new Date()`                      |
| `onChange`    | 날짜 변경 시 호출되는 함수          | `(date) => {}`                   |
| `placeholder` | 선택 전 표시될 안내 텍스트          | "날짜를 선택하세요"               |
| `dateFormat`  | 날짜 표시 형식                      | `'yyyy-MM-dd'`                   |
| `showTimeSelect` | 시간 선택 포함 여부               | `true`                            |
| `minDate`     | 선택 가능한 최소 날짜               | `new Date('2023-01-01')`         |
| `maxDate`     | 선택 가능한 최대 날짜               | `new Date('2024-12-31')`         |
| `disabled`    | 비활성화 여부                      | `false`                          |

---

## 10. FieldTimePicker

사용자가 시간을 선택할 수 있는 시간 선택기입니다. 15분 간격으로 시간을 선택할 수 있으며, 최소/최대 시간을 설정할 수 있습니다.

| Prop            | 설명                                | 예시                              |
| :-------------- | :---------------------------------- | :-------------------------------- |
| `value`         | 선택된 시간 (Date \| null)         | `new Date()`                      |
| `onChange`      | 시간 변경 시 호출되는 함수          | `(time) => {}`                   |
| `placeholder`   | 선택 전 표시될 안내 텍스트          | "시간을 선택하세요"               |
| `timeIntervals` | 시간 선택 간격 (분)                | `15`                              |
| `minTime`       | 선택 가능한 최소 시간               | `new Date('2023-01-01 09:00')`   |
| `maxTime`       | 선택 가능한 최대 시간               | `new Date('2023-01-01 18:00')`   |
| `disabled`      | 비활성화 여부                      | `false`                          |

---

## 11. FieldDateRangePicker

사용자가 날짜 범위를 선택할 수 있는 날짜 범위 선택기입니다. 시작 날짜와 종료 날짜를 순차적으로 선택할 수 있습니다.

| Prop          | 설명                                | 예시                              |
| :------------ | :---------------------------------- | :-------------------------------- |
| `startDate`   | 시작 날짜 (Date \| null)           | `new Date()`                      |
| `endDate`     | 종료 날짜 (Date \| null)           | `new Date()`                      |
| `onChange`    | 날짜 범위 변경 시 호출되는 함수     | `([start, end]) => {}`           |
| `placeholder` | 선택 전 표시될 안내 텍스트          | "날짜 범위를 선택하세요"           |
| `dateFormat`  | 날짜 표시 형식                      | `'yyyy-MM-dd'`                   |
| `minDate`     | 선택 가능한 최소 날짜               | `new Date('2023-01-01')`         |
| `maxDate`     | 선택 가능한 최대 날짜               | `new Date('2024-12-31')`         |
| `disabled`    | 비활성화 여부                      | `false`                          |

---

## 12. FieldMonthPicker

사용자가 년월을 선택할 수 있는 월 선택기입니다. 년도와 월을 빠르게 변경할 수 있으며 월별 필터링이 가능합니다.

| Prop          | 설명                                | 예시                              |
| :------------ | :---------------------------------- | :-------------------------------- |
| `value`       | 선택된 년월 (Date \| null)         | `new Date()`                      |
| `onChange`    | 년월 변경 시 호출되는 함수          | `(date) => {}`                   |
| `placeholder` | 선택 전 표시될 안내 텍스트          | "년월을 선택하세요"               |
| `dateFormat`  | 날짜 표시 형식                      | `'yyyy-MM'`                      |
| `minDate`     | 선택 가능한 최소 날짜               | `new Date('2023-01-01')`         |
| `maxDate`     | 선택 가능한 최대 날짜               | `new Date('2024-12-31')`         |
| `disabled`    | 비활성화 여부                      | `false`                          |

---

## 13. 사용 시나리오

- **설정 페이지**: `ToggleSwitch`로 각종 알림 설정을, `RadioGroup`으로 테마 설정을, `Dropdown`으로 언어 선택을 제어합니다.
- **가입 양식**: `Checkbox`로 개별 약관 동의를, `CheckboxGroup`으로 관심 분야를, `Dropdown`으로 직업을, `TextInput`으로 이름과 이메일을, `TextArea`로 자기소개를 입력받습니다.
- **에디터 툴바**: `ToggleButton`을 사용하여 텍스트 스타일(볼드, 이탤릭)을 켜고 끕니다.
- **필터링**: `CheckboxGroup`으로 카테고리를, `RadioGroup`으로 정렬 옵션을, `Dropdown`으로 지역을, `TextInput`으로 검색어를 입력받습니다.
- **게시글 작성**: `TextInput`으로 제목을, `TextArea`로 본문 내용을 입력받으며, 글자 수 제한과 크기 조절 기능을 제공합니다.
- **일정 관리**: `DatePicker`로 개별 일정 날짜를, `DateRangePicker`로 휴가 기간을, `TimePicker`로 회의 시간을 선택합니다.
- **예약 시스템**: `DatePicker`로 예약 날짜를, `TimePicker`로 예약 시간을, `DateRangePicker`로 장기 예약 기간을 설정합니다.
- **보고서 작성**: `MonthPicker`로 보고서 작성 월을, `DateRangePicker`로 데이터 분석 기간을 선택합니다.

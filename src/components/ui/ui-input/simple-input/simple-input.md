# 단순 입력(Simple Input) 컴포넌트 모음

이 문서는 사용자의 입력을 받는 기본적인 UI 컴포넌트 네 가지(`Checkbox`, `RadioGroup`, `ToggleButton`, `ToggleSwitch`)의 기능과 사용법을 설명합니다.

## 1. 컴포넌트 종류 및 핵심 기능

각 컴포넌트는 특정한 형태의 사용자 입력을 처리하는 데 사용됩니다.

```mermaid
graph TD
    subgraph "입력 컴포넌트"
        A[FieldCheckbox<br/>(체크박스)]
        B[FieldRadioGroup<br/>(라디오 그룹)]
        C[FieldToggleButton<br/>(토글 버튼)]
        D[FieldToggleSwitch<br/>(토글 스위치)]
    end

    subgraph "핵심 기능"
        Func_A["- 단일 또는 다중 선택<br/>- On/Off 상태"]
        Func_B["- 여러 옵션 중 단일 선택<br/>- 필수 선택"]
        Func_C["- 두 가지 상태 전환<br/>- 아이콘/텍스트 기반"]
        Func_D["- On/Off 상태 전환<br/>- 시각적인 스위치 형태"]
    end

    A --> Func_A
    B --> Func_B
    C --> Func_C
    D --> Func_D
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

## 3. FieldRadioGroup

여러 개의 선택지 중에서 반드시 하나만 선택해야 하는 경우에 사용됩니다. `options` prop으로 선택지 목록을 전달받습니다.

| Prop       | 설명                                | 예시                              |
| :--------- | :---------------------------------- | :-------------------------------- |
| `options`  | 선택지 객체 배열 (`{value, label}`) | `[{value: 'a', label: '옵션 A'}]` |
| `value`    | 현재 선택된 값                      | `'a'`                             |
| `onChange` | 값 변경 시 호출되는 함수            | `(e) => {}`                       |

---

## 4. FieldToggleButton

아이콘이나 텍스트를 사용하여 두 가지 상태(예: 켜짐/꺼짐, 선택/비선택)를 전환하는 버튼입니다. 주로 시각적인 모드 전환에 사용됩니다.

| Prop        | 설명                                 | 예시                              |
| :---------- | :----------------------------------- | :-------------------------------- |
| `isToggled` | 토글 상태 (boolean)                  | `true`                            |
| `onToggle`  | 토글 시 호출되는 함수                | `() => {}`                        |
| `children`  | 버튼 내부에 표시될 콘텐츠(아이콘 등) | `<SunIcon />` 또는 `<MoonIcon />` |

---

## 5. FieldToggleSwitch

시각적으로 명확한 On/Off 스위치를 제공하여, 설정이나 기능을 켜고 끄는 데 사용됩니다.

| Prop       | 설명                         | 예시        |
| :--------- | :--------------------------- | :---------- |
| `checked`  | 스위치 On/Off 상태 (boolean) | `true`      |
| `onChange` | 상태 변경 시 호출되는 함수   | `(e) => {}` |
| `label`    | 스위치 옆에 표시될 텍스트    | "알림 받기" |

## 6. 사용 시나리오

- **설정 페이지**: `ToggleSwitch`로 각종 알림 설정을, `RadioGroup`으로 테마(라이트/다크) 설정을 제어합니다.
- **가입 양식**: `Checkbox`로 약관 동의 여부를, `RadioGroup`으로 성별을 선택받습니다.
- **에디터 툴바**: `ToggleButton`을 사용하여 텍스트 스타일(볼드, 이탤릭)을 켜고 끕니다.

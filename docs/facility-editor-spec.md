# 시설 편집기 MVP

## 기본 기능

- 그리드 시스템: 셀별 타입 구분 가능
- 타입 설정: 각 셀에 'seat' 또는 'table' 타입 지정
- 이름 설정: 각 셀에 개별 이름 지정 가능
- UI 모듈: 타입 선택 및 이름 편집 인터페이스
- 실행취소/다시실행

## 컴포넌트 구조

- **FacilityEditor**: 메인 에디터
- **EditorGrid**: 그리드 및 클릭 이벤트
- **EditorToolbar**: 타입 선택 도구
- **NameEditModal**: 이름 편집 모달

## 데이터 타입

- **Position**: x, y 좌표
- **CellType**: 'empty' | 'seat' | 'table'
- **GridCell**: x, y, type, name
- **FacilityLayout**: gridSize, cells
- **EditorState**: selectedTool, selectedCell, history

## 에디터 모드

- **select**: 셀 선택
- **place**: 타입 설정
- **name**: 이름 편집

## 조작 방식

- 클릭: 셀 선택 또는 타입 설정
- 더블클릭: 이름 편집 모달
- Delete: 선택된 셀 타입 제거
- Ctrl+Z: 실행취소
- Ctrl+Shift+Z: 다시실행

## 개발 순서

1. 기본 타입 정의 (Position, CellType, GridCell, FacilityLayout)
2. 그리드 렌더링 (셀별 타입 표시)
3. 셀 타입 설정 (클릭으로 타입 지정)
4. 이름 편집 모달 (더블클릭으로 이름 설정)
5. 히스토리 시스템 (실행취소/다시실행)

/*
  파일명: /components/ui/ui-input/crud-button/crud-button.example.tsx
  기능: CrudButton 컴포넌트 사용 예제
  책임: 다양한 CRUD 버튼 사용 사례 데모
*/

'use client';

import { CrudButton } from './CrudButton';

export default function CrudButtonExample() {
  const handleAction = (action: string) => {
    console.log(`${action} 액션 실행됨`);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">폼 & 테이블용 CRUD 버튼</h2>
        <p className="text-muted-foreground">
          일관된 CRUD 액션을 위한 전용 버튼 컴포넌트
        </p>
      </div>

      {/* 목록화면 - 아이콘만 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">목록화면 - 아이콘만 (테이블 내)</h3>
        <div className="flex gap-2">
          <CrudButton 
            action="copy" 
            iconOnly 
            onClick={() => handleAction('복사')}
          />
          <CrudButton 
            action="delete" 
            iconOnly 
            onClick={() => handleAction('삭제')}
          />
        </div>
      </section>

      {/* 목록화면 - 아이콘 + 텍스트 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">목록화면 - 아이콘 + 텍스트</h3>
        <div className="flex gap-2">
          <CrudButton 
            action="create" 
            onClick={() => handleAction('추가')}
          />
          <CrudButton 
            action="edit" 
            onClick={() => handleAction('편집')}
          />
        </div>
      </section>

      {/* 상세화면 - 아이콘 + 텍스트 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">상세화면 - 아이콘 + 텍스트</h3>
        <div className="flex gap-2">
          <CrudButton 
            action="save" 
            onClick={() => handleAction('저장')}
          />
          <CrudButton 
            action="delete" 
            onClick={() => handleAction('삭제')}
          />
        </div>
      </section>

      {/* 사이즈 변형 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">사이즈 변형</h3>
        <div className="flex gap-2 items-center">
          <CrudButton action="create" size="sm" />
          <CrudButton action="create" size="default" />
          <CrudButton action="create" size="lg" />
        </div>
      </section>

      {/* 비활성 상태 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">비활성 상태</h3>
        <div className="flex gap-2">
          <CrudButton action="save" disabled />
          <CrudButton action="delete" disabled />
          <CrudButton action="copy" iconOnly disabled />
        </div>
      </section>

      {/* 모든 액션 데모 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">모든 액션 타입</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">텍스트 포함</h4>
            <div className="flex flex-col gap-2">
              <CrudButton action="create" onClick={() => handleAction('추가')} />
              <CrudButton action="edit" onClick={() => handleAction('편집')} />
              <CrudButton action="save" onClick={() => handleAction('저장')} />
              <CrudButton action="copy" onClick={() => handleAction('복사')} />
              <CrudButton action="delete" onClick={() => handleAction('삭제')} />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">아이콘만</h4>
            <div className="flex gap-2">
              <CrudButton action="create" iconOnly onClick={() => handleAction('추가')} />
              <CrudButton action="edit" iconOnly onClick={() => handleAction('편집')} />
              <CrudButton action="save" iconOnly onClick={() => handleAction('저장')} />
              <CrudButton action="copy" iconOnly onClick={() => handleAction('복사')} />
              <CrudButton action="delete" iconOnly onClick={() => handleAction('삭제')} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

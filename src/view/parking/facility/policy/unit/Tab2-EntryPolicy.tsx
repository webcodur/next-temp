'use client';

// Tab2-EntryPolicy.tsx : 출입 정책 + 블랙리스트 정책 탭

import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { FieldRadioGroup } from '@/components/ui/ui-input/simple-input/FieldRadioGroup';
import { FieldToggleSwitch } from '@/components/ui/ui-input/simple-input/FieldToggleSwitch';

// -------------------- 상수 및 타입 --------------------
export type CorpCategoryKey = '업무' | '상가' | '커뮤니티' | '유치원';

interface CorpPolicy {
  workHour: boolean;
  blacklist: boolean;
}

const corpCategories: CorpCategoryKey[] = ['업무', '상가', '커뮤니티', '유치원'];

const initialCorpPolicies: Record<CorpCategoryKey, CorpPolicy> = {
  업무: { workHour: false, blacklist: false },
  상가: { workHour: false, blacklist: false },
  커뮤니티: { workHour: false, blacklist: false },
  유치원: { workHour: false, blacklist: false },
};

// -------------------- UI 공통 스타일 --------------------
const CARD_STYLE = 'flex relative flex-col gap-4 p-6 rounded-xl neu-flat';
const TITLE_STYLE =
  'font-semibold text-center font-multilang text-lg h-8 flex items-center justify-center';
const ACTION_ICON_CONTAINER_STYLE = 'flex absolute top-2 right-2 gap-1';

// -------------------- 컴포넌트 --------------------
export default function Tab2EntryPolicy() {
  // Entry 정책 상태
  const [entryPolicy, setEntryPolicy] = useState<'all' | 'office'>('office');
  const [returnHourEnabled, setReturnHourEnabled] = useState<boolean>(false);
  const [corpPolicies, setCorpPolicies] = useState<Record<CorpCategoryKey, CorpPolicy>>(
    initialCorpPolicies,
  );
  const [editingCorpCat, setEditingCorpCat] = useState<CorpCategoryKey | null>(null);

  // Blacklist 정책 상태
  const [warningCount, setWarningCount] = useState<number>(2);

  return (
    <section className="flex flex-col gap-10">
      {/* 상단 3행 컨트롤 */}
      <div className="flex flex-col gap-6 max-w-5xl">
        {/* ① 출입 허용 */}
        <FieldRadioGroup
          label="출입 허용"
          value={entryPolicy}
          onChange={(v) => setEntryPolicy(v as 'all' | 'office')}
          layout="horizontal"
          options={[
            { label: '전체', value: 'all' },
            { label: '관리사무소 등록차량', value: 'office' },
          ]}
        />

        {/* ② 회차시간 사용 */}
        <FieldToggleSwitch
          label="회차시간 사용"
          checked={returnHourEnabled}
          onChange={setReturnHourEnabled}
          size="md"
        />

        {/* ③ 블랙리스트 등록 기준 */}
        <div className="flex gap-3 items-center">
          <span className="text-sm font-medium font-multilang shrink-0">블랙리스트 등록 기준</span>
          <input
            type="number"
            min={1}
            className="px-3 py-1.5 w-16 text-center rounded-md outline-none neu-flat bg-background focus:neu-inset"
            value={warningCount}
            onChange={(e) => setWarningCount(Number(e.target.value))}
          />
          <span className="text-sm font-multilang shrink-0">회 이상 경고 시 등록</span>
        </div>
      </div>

      {/* 회사 카테고리별 정책 */}
      {returnHourEnabled && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {corpCategories.map((cat) => {
            const policy = corpPolicies[cat];
            const isEditing = editingCorpCat === cat;
            return (
              <div key={cat} className={CARD_STYLE}>
                <h3 className={TITLE_STYLE}>{cat}</h3>

                {/* 액션 아이콘 */}
                <div className={ACTION_ICON_CONTAINER_STYLE}>
                  {isEditing ? (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => setEditingCorpCat(null)}>
                        <Check size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingCorpCat(null)}>
                        <X size={16} />
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => setEditingCorpCat(cat)}>
                      <Pencil size={16} />
                    </Button>
                  )}
                </div>

                {/* 회차시간 토글 */}
                <FieldToggleSwitch
                  label="회차시간"
                  checked={policy.workHour}
                  onChange={(val) =>
                    setCorpPolicies((prev) => ({
                      ...prev,
                      [cat]: { ...prev[cat], workHour: val },
                    }))
                  }
                  size="sm"
                  disabled={!isEditing}
                />

                {/* 블랙리스트 사용여부 토글 */}
                <FieldToggleSwitch
                  label="블랙리스트"
                  checked={policy.blacklist}
                  onChange={(val) =>
                    setCorpPolicies((prev) => ({
                      ...prev,
                      [cat]: { ...prev[cat], blacklist: val },
                    }))
                  }
                  size="sm"
                  disabled={!isEditing}
                />

                {/* 하단 액션 영역 제거: 상단 아이콘으로 대체 */}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
} 
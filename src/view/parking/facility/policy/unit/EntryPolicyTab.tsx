'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { FieldRadioGroup } from '@/components/ui/ui-input/simple-input/FieldRadioGroup';

// 타입 및 초기 데이터
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

export default function EntryPolicyTab() {
  const [entryPolicy, setEntryPolicy] = useState<'all' | 'office'>('office');
  const [corpUsage, setCorpUsage] = useState<'enabled' | 'disabled'>('disabled');
  const [corpPolicies, setCorpPolicies] = useState<Record<CorpCategoryKey, CorpPolicy>>(
    initialCorpPolicies,
  );
  const [editingCorpCat, setEditingCorpCat] = useState<CorpCategoryKey | null>(null);

  return (
    <section className="flex flex-col gap-8">
      <div className="grid gap-6 max-w-4xl md:grid-cols-2">
        {/* 출입 허용 */}
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

        {/* 회사 사용 설정 */}
        <FieldRadioGroup
          label="회사 사용 설정"
          value={corpUsage}
          onChange={(v) => setCorpUsage(v as 'enabled' | 'disabled')}
          layout="horizontal"
          options={[
            { label: '사용', value: 'enabled' },
            { label: '사용 안 함', value: 'disabled' },
          ]}
        />
      </div>

      {/* 회사 카테고리별 정책 카드 */}
      {corpUsage === 'enabled' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {corpCategories.map((cat) => {
            const policy = corpPolicies[cat];
            const isEditing = editingCorpCat === cat;
            return (
              <div key={cat} className="flex flex-col gap-3 p-4 rounded-lg neu-flat">
                <h3 className="font-semibold font-multilang">{cat}</h3>

                {/* 회사시간 사용 여부 */}
                <div className="flex justify-between items-center text-sm">
                  <span>회사시간 사용 여부</span>
                  <Button
                    variant={policy.workHour ? 'inset' : 'ghost'}
                    size="sm"
                    disabled={!isEditing}
                    onClick={() =>
                      setCorpPolicies((prev) => ({
                        ...prev,
                        [cat]: { ...prev[cat], workHour: !prev[cat].workHour },
                      }))
                    }
                  >
                    {policy.workHour ? '사용' : '사용 안 함'}
                  </Button>
                </div>

                {/* 블랙리스트 적용 여부 */}
                <div className="flex justify-between items-center text-sm">
                  <span>블랙리스트 적용 여부</span>
                  <Button
                    variant={policy.blacklist ? 'inset' : 'ghost'}
                    size="sm"
                    disabled={!isEditing}
                    onClick={() =>
                      setCorpPolicies((prev) => ({
                        ...prev,
                        [cat]: { ...prev[cat], blacklist: !prev[cat].blacklist },
                      }))
                    }
                  >
                    {policy.blacklist ? '사용' : '사용 안 함'}
                  </Button>
                </div>

                {/* 액션 */}
                {isEditing ? (
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditingCorpCat(null)}
                    >
                      저장
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditingCorpCat(null)}
                    >
                      취소
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => setEditingCorpCat(cat)}
                  >
                    수정하기
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
} 
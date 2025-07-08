'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { Pencil, Check, X } from 'lucide-react';

// #region 타입 및 초기값 정의
export type CategoryKey =
  | '입주'
  | '방문'
  | '업무'
  | '정기'
  | '임대'
  | '상가'
  | '택시(택배 포함)';

export type GateKey = '정문입차' | '정문출차';

interface GatePolicy {
  categories: Record<CategoryKey, boolean>;
}

const defaultCategories: CategoryKey[] = [
  '입주',
  '방문',
  '업무',
  '정기',
  '임대',
  '상가',
  '택시(택배 포함)',
];

const initialGatePolicy: Record<GateKey, GatePolicy> = {
  정문입차: {
    categories: {
      입주: true,
      방문: true,
      업무: true,
      정기: true,
      임대: true,
      상가: true,
      '택시(택배 포함)': true,
    },
  },
  정문출차: {
    categories: {
      입주: true,
      방문: false,
      업무: false,
      정기: true,
      임대: false,
      상가: false,
      '택시(택배 포함)': false,
    },
  },
};
// #endregion

export default function ParkingPolicyTab() {
  const [gatePolicies, setGatePolicies] = useState<Record<GateKey, GatePolicy>>(
    initialGatePolicy,
  );
  const [editGate, setEditGate] = useState<GateKey | null>(null);
  const [editingName, setEditingName] = useState('');
  const [gateDisplayNames, setGateDisplayNames] = useState<Record<GateKey, string>>({
    정문입차: '정문입차',
    정문출차: '정문출차',
  });

  const toggleCategory = (gate: GateKey, cat: CategoryKey) => {
    setGatePolicies((prev) => ({
      ...prev,
      [gate]: {
        categories: {
          ...prev[gate].categories,
          [cat]: !prev[gate].categories[cat],
        },
      },
    }));
  };

  const saveGateName = (gate: GateKey) => {
    if (!editingName.trim()) return;
    setGateDisplayNames((prev) => ({ ...prev, [gate]: editingName.trim() }));
    setEditGate(null);
  };

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {(['정문입차', '정문출차'] as GateKey[]).map((gate) => {
        const isEditing = editGate === gate;
        return (
          <div
            key={gate}
            className="flex relative flex-col gap-4 p-6 rounded-xl neu-flat"
          >
            {/* 게이트 제목 */}
            {isEditing ? (
              <input
                className="px-2 py-1 text-lg font-bold rounded-md outline-none font-multilang neu-flat focus:neu-inset bg-background"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
              />
            ) : (
              <h2 className="text-lg font-bold text-center font-multilang">
                {gateDisplayNames[gate]}
              </h2>
            )}

            {/* 액션 아이콘 */}
            <div className="flex absolute top-2 right-2 gap-1">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="icon" onClick={() => saveGateName(gate)}>
                    <Check size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditGate(null)}>
                    <X size={16} />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditGate(gate);
                    setEditingName(gateDisplayNames[gate]);
                  }}
                >
                  <Pencil size={16} />
                </Button>
              )}
            </div>

            <p className="text-sm text-center">출입 가능 차량</p>

            {/* 카테고리 버튼들 */}
            <div className="grid grid-cols-2 gap-2">
              {defaultCategories.map((cat) => {
                const active = gatePolicies[gate].categories[cat];
                return (
                  <CategoryChip
                    key={cat}
                    label={cat}
                    active={active}
                    disabled={!isEditing}
                    onToggle={() => toggleCategory(gate, cat)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

// ----------------------------------------------------------------------
// CategoryChip
interface CategoryChipProps {
  label: CategoryKey;
  active: boolean;
  disabled: boolean;
  onToggle: () => void;
}

function CategoryChip({ label, active, disabled, onToggle }: CategoryChipProps): React.ReactElement {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className={`flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-multilang select-none transition-all duration-150 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${active ? 'neu-inset bg-primary/10 text-primary border-primary/30 shadow-inner' : 'neu-raised bg-background text-foreground shadow-md hover:shadow-lg'}`}
      onClick={disabled ? undefined : onToggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={active}
    >
      {label}
    </div>
  );
} 
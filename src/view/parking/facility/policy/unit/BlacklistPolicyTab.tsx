'use client';

import React, { useState } from 'react';
export default function BlacklistPolicyTab() {
  const [warningCount, setWarningCount] = useState(2);
  return (
    <section className="flex flex-col gap-6 max-w-lg">
      <div className="flex gap-3 items-center p-4 rounded-lg neu-flat">
        <span className="text-sm font-medium font-multilang shrink-0">
          블랙리스트 등록 기준
        </span>
        <input
          type="number"
          min={1}
          className="px-3 py-1.5 w-16 text-center rounded-md outline-none neu-flat bg-background focus:neu-inset"
          value={warningCount}
          onChange={(e) => setWarningCount(Number(e.target.value))}
        />
        <span className="text-sm font-multilang shrink-0">회 이상 경고 시 등록</span>
      </div>
    </section>
  );
} 
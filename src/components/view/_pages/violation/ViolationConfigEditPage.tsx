/* 메뉴 설명: 규정 위반 설정 편집 */
'use client';

import React from 'react';
import ConfigEdit from '@/components/view/_etc/config/ConfigEdit';

export default function ViolationConfigEditPage() {
  return (
    <ConfigEdit
      category="Violation"
      title="규정 위반 설정 편집"
      backRoute="/parking/violation/violation-config"
      successMessage="규정 위반 설정이 성공적으로 수정되었습니다."
      categoryErrorMessage="이 설정은 규정 위반 카테고리에 속하지 않습니다."
    />
  );
}
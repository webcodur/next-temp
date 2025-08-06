/* 메뉴 설명: 블랙리스트 설정 편집 */
'use client';

import React from 'react';
import ConfigEdit from '@/components/view/_etc/config/ConfigEdit';

export default function BlacklistConfigEditPage() {
  return (
    <ConfigEdit
      category="Blacklist"
      title="블랙리스트 설정 편집"
      backRoute="/parking/violation/blacklist-config"
      successMessage="블랙리스트 설정이 성공적으로 수정되었습니다."
      categoryErrorMessage="이 설정은 블랙리스트 카테고리에 속하지 않습니다."
    />
  );
}
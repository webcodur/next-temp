/* 메뉴 설명: 규정 위반 설정 */
'use client';

import React from 'react';
import ConfigManagement from '@/components/view/_etc/config/ConfigManagement';

export default function ViolationConfigManagementPage() {
  return (
    <ConfigManagement
      category="Violation"
      title="규정 위반 설정"
      subtitle="주차장 규정 위반과 관련된 시스템 설정을 관리합니다"
      successMessage="규정 위반 설정이 성공적으로 수정되었습니다."
      categoryErrorMessage="규정 위반 카테고리에 속하지 않는 설정입니다."
    />
  );
}
/* 메뉴 설명: 블랙리스트 설정 */
'use client';

import React from 'react';
import ConfigManagement from '@/components/view/_etc/config/ConfigManagement';

export default function BlacklistConfigManagementPage() {
  return (
    <ConfigManagement
      category="Blacklist"
      title="블랙리스트 설정"
      subtitle="블랙리스트 관리와 관련된 시스템 설정을 관리합니다"
      editBaseRoute="/parking/violation/blacklist-config"
      createRoute="/parking/violation/blacklist-config/create"
    />
  );
}
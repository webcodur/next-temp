'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MemberResidentHouseholdPage = dynamic(() => import('@/components/view/member/resident-household/MemberResidentHouseholdPage'), { ssr: false });

export default function MemberResidentHouseholdRoute() {
  return <MemberResidentHouseholdPage />;
} 
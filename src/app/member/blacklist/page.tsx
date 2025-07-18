'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const MemberBlacklistPage = dynamic(() => import('@/components/view/member/blacklist/MemberBlacklistPage'), { ssr: false });

export default function MemberBlacklistRoute() {
  return <MemberBlacklistPage />;
} 
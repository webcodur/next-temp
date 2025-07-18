'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MemberVisitorPage = dynamic(() => import('@/components/view/member/visitor/MemberVisitorPage'), { ssr: false });

export default function MemberVisitorRoute() {
  return <MemberVisitorPage />;
} 
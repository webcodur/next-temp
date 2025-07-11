'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MemberVehicleRegistrationPage = dynamic(() => import('@/components/view/member/vehicle-registration/MemberVehicleRegistrationPage'), { ssr: false });

export default function MemberVehicleRegistrationRoute() {
  return <MemberVehicleRegistrationPage />;
} 
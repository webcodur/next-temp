'use client';

import React from 'react';
import AccessControlManager from '@/components/view/_screen/access-control/AccessControlManager';
import { mockBarriers } from '@/data/mockParkingData';

export default function EntryPage() {
  return (
    <AccessControlManager barriers={mockBarriers} />
  );
}
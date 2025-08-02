'use client';

import { useSearchParams } from 'next/navigation';
import InstanceCreateView from '@/components/view/parking/household-management/instance/InstanceCreateView';

export default function InstanceCreatePage() {
  const searchParams = useSearchParams();
  const preSelectedHouseholdId = searchParams.get('householdId');
  
  return (
    <InstanceCreateView 
      preSelectedHouseholdId={preSelectedHouseholdId || undefined} 
    />
  );
}
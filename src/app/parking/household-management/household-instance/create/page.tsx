'use client';

import { useSearchParams } from 'next/navigation';
import HouseholdInstanceCreateView from '@/components/view/parking/household-management/householdInstance/HouseholdInstanceCreateView';

export default function HouseholdInstanceCreatePage() {
  const searchParams = useSearchParams();
  const preSelectedHouseholdId = searchParams.get('householdId');
  
  return (
    <HouseholdInstanceCreateView 
      preSelectedHouseholdId={preSelectedHouseholdId || undefined} 
    />
  );
} 
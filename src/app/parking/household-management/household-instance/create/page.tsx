'use client';

import { useSearchParams } from 'next/navigation';
import { redirect } from 'next/navigation';

export default function HouseholdInstanceCreatePage() {
  const searchParams = useSearchParams();
  const preSelectedHouseholdId = searchParams.get('householdId');
  
  const redirectUrl = preSelectedHouseholdId 
    ? `/parking/household-management/instance/create?householdId=${preSelectedHouseholdId}`
    : '/parking/household-management/instance/create';
    
  redirect(redirectUrl);
} 
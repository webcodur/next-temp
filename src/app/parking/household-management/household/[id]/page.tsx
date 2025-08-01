import { use } from 'react';
import HouseholdDetailView from '@/components/view/parking/household-management/householdDetail/HouseholdDetailView';

interface HouseholdDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function HouseholdDetailPage({ params }: HouseholdDetailPageProps) {
  const resolvedParams = use(params);
  return <HouseholdDetailView householdId={resolvedParams.id} />;
} 
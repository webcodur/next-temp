import { use } from 'react';
import HouseholdInstanceDetailView from '@/components/view/parking/household-management/householdInstance/HouseholdInstanceDetailView';

interface HouseholdInstanceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function HouseholdInstanceDetailPage({ params }: HouseholdInstanceDetailPageProps) {
  const resolvedParams = use(params);
  return <HouseholdInstanceDetailView instanceId={resolvedParams.id} />;
} 
import { use } from 'react';
import { redirect } from 'next/navigation';

interface HouseholdInstanceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function HouseholdInstanceDetailPage({ params }: HouseholdInstanceDetailPageProps) {
  const resolvedParams = use(params);
  redirect(`/parking/household-management/instance/${resolvedParams.id}`);
} 
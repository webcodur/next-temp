import InstanceDetailView from '@/components/view/parking/household-management/instance/InstanceDetailView';

interface InstanceDetailPageProps {
  params: {
    id: string;
  };
}

export default function InstanceDetailPage({ params }: InstanceDetailPageProps) {
  return <InstanceDetailView instanceId={params.id} />;
}
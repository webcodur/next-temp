import { use } from 'react';
import ViolationDetailPage from '@/components/view/parking/cars/violations/ViolationDetailPage';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: Props) {
  const resolvedParams = use(params);
  return <ViolationDetailPage id={parseInt(resolvedParams.id)} />;
}
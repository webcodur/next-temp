import ViolationDetailPage from '@/components/view/parking/cars/violations/ViolationDetailPage';

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  return <ViolationDetailPage id={parseInt(params.id)} />;
}
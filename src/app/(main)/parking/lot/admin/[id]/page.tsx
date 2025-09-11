import AdminDetailPage from '@/components/view/_pages/operation/admin/AdminDetailPage';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <AdminDetailPage adminId={parseInt(id)} />;
}

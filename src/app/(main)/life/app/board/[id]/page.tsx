import AppBoardDetailPage from '@/components/view/_pages/life/app/board/AppBoardDetailPage';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const boardId = parseInt(id, 10);

  if (isNaN(boardId)) {
    return <div>잘못된 게시글 ID입니다.</div>;
  }

  return <AppBoardDetailPage boardId={boardId} />;
}

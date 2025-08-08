/* 메뉴 설명: 블랙리스트 차량 상세 및 수정 - 블랙리스트 항목 상세 조회 및 수정 */

import { use } from 'react';
import BlacklistDetailPage from '@/components/view/_pages/violation/BlacklistDetailPage';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: Props) {
  const resolvedParams = use(params);
  return <BlacklistDetailPage id={parseInt(resolvedParams.id)} />;
}
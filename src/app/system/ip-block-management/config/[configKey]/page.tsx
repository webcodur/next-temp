import { use } from 'react';
import IpBlockConfigEditPage from '@/components/view/system/ip-block-management/IpBlockConfigEditPage';

interface ConfigDetailPageProps {
  params: Promise<{
    configKey: string;
  }>;
}

export default function ConfigDetailPage({ params }: ConfigDetailPageProps) {
  const resolvedParams = use(params);
  const { configKey } = resolvedParams;
  const decodedConfigKey = decodeURIComponent(configKey);
  
  return <IpBlockConfigEditPage configKey={decodedConfigKey} />;
} 
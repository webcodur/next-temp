'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';
import { useLocale } from '@/hooks/useI18n';
import type { LucideIcon } from 'lucide-react';
import { Car, Users, Smartphone, Shield, Calendar, CreditCard, Phone, LockKeyhole, User } from 'lucide-react';

// 내부 카드 컴포넌트 – 재사용성을 높여 간결한 UI 코드 유지
function InfoCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="flex flex-col gap-1 p-4 w-full rounded-lg neu-flat">
      <div className="flex gap-2 items-center">
        <Icon className="w-4 h-4 neu-icon-active" />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className="text-base font-semibold text-primary">{value}</span>
    </div>
  );
}

export default function FacilityInfoPage() {
  // 페이지 설명 설정
  usePageDescription('시설 기본 정보를 표시합니다.');
  const { isRTL } = useLocale();

  /* -------------------------------------------------------------------------- */
  /*                                 MOCK DATA                                  */
  /* -------------------------------------------------------------------------- */
  // NOTE: 실제 서비스에서는 SWR, React Query 등으로 API 데이터를 받아온다고 가정한다.
  const facility = {
    type: 'APT 및 주거시설',
    name: 'meerkat',
    isPaid: false,
    address: '경기 시흥시 배곧동 249',
    totalHouseholds: 1151,
    installedHouseholds: 30,
    metrics: [
      { label: '주차이용면적', value: '300면', icon: Car },
      { label: '세대수 전체', value: '1,151세대', icon: Users },
      { label: '앱 설치', value: '30세대', icon: Smartphone },
      { label: '설치 차단기', value: '2대', icon: Shield },
      { label: '근무자 수', value: '5명', icon: Users },
    ],
    contract: { period: '-', paid: '무료' },
    contact: { manager: '미어캣 고객센터', phone: '1668-4179' },
    password: '8411',
  } as const;

  // 앱 설치율 정보 카드 추가
  const installRate = ((facility.installedHouseholds / facility.totalHouseholds) * 100).toFixed(1) + '%';

  const extendedMetrics = [
    ...facility.metrics,
    { label: '앱 설치율', value: installRate, icon: Smartphone },
    { label: '계약 기간', value: facility.contract.period, icon: Calendar },
    { label: '유료 여부', value: facility.contract.paid, icon: CreditCard },
    { label: '담당자', value: facility.contact.manager, icon: User },
    { label: '연락처', value: facility.contact.phone, icon: Phone },
    { label: '세대방문 비밀번호', value: facility.password, icon: LockKeyhole },
  ];

  return (
    <main
      className="flex flex-col gap-12 px-4 mx-auto w-full max-w-5xl md:px-6"
      dir={isRTL ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      {/* ----------------------------- 헤더 영역 ----------------------------- */}
      <header className="flex flex-col gap-3">
        {/* 시설 유형 라벨 */}
        <span className="inline-block px-3 py-1 text-sm rounded-full text-primary w-fit neu-flat">
          {facility.type}
        </span>

        {/* 시설명, 과금 상태 */}
        <h1
          className={`flex gap-2 items-end text-3xl font-semibold leading-snug ${
            isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="font-multilang">{facility.name}</span>
          <span className="text-base text-primary">{facility.contract.paid}</span>
        </h1>

        {/* 주소 */}
        <p className="text-lg text-foreground">{facility.address}</p>
      </header>

      {/* --------------------------- 핵심 메트릭 영역 -------------------------- */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {extendedMetrics.map(metric => (
          <InfoCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </section>
    </main>
  );
} 
'use client';
import React from 'react';
import { usePageDescription } from '@/hooks/usePageDescription';
import { Car, Users, Smartphone, Shield, Calendar, CreditCard, Phone, LockKeyhole, User } from 'lucide-react';
import GridForm from '@/components/ui/ui-layout/grid-form/GridForm';

export default function FacilityInfoPage() {
  // 페이지 설명 설정
  usePageDescription('시설 기본 정보를 표시합니다.');

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

  // 앱 설치율 계산
  const installRate = ((facility.installedHouseholds / facility.totalHouseholds) * 100).toFixed(1) + '%';

  /* -------------------------------------------------------------------------- */
  /*                               데이터 분류                                  */
  /* -------------------------------------------------------------------------- */
  
  // 1. 시설 기본 정보 - 변하지 않는 고정적인 시설 정보
  const basicInfo = [
    { label: '시설 유형', value: facility.type, icon: Shield },
    { label: '시설명', value: facility.name, icon: User },
    { label: '주소', value: facility.address, icon: LockKeyhole },
  ];

  // 2. 시설 규모 - 물리적 크기와 용량 정보
  const facilityScale = [
    { label: '세대수 전체', value: '1,151세대', icon: Users },
    { label: '주차이용면적', value: '300면', icon: Car },
  ];

  // 3. 디지털 서비스 현황 - 앱 설치 및 디지털화 진행 상황
  const digitalStatus = [
    { label: '앱 설치 세대', value: '30세대', icon: Smartphone },
    { label: '앱 설치율', value: installRate, icon: Smartphone },
  ];

  // 4. 운영 현황 - 실제 운영되고 있는 시설과 인력
  const operationStatus = [
    { label: '설치 차단기', value: '2대', icon: Shield },
    { label: '근무자 수', value: '5명', icon: Users },
  ];

  // 5. 계약 및 관리 - 계약 정보와 관리 체계
  const contractManagement = [
    { label: '계약 기간', value: facility.contract.period, icon: Calendar },
    { label: '유료 여부', value: facility.contract.paid, icon: CreditCard },
    { label: '담당자', value: facility.contact.manager, icon: User },
    { label: '연락처', value: facility.contact.phone, icon: Phone },
    { label: '세대방문 비밀번호', value: facility.password, icon: LockKeyhole },
  ];

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto">
      {/* ----------------------------- 기본 정보 ----------------------------- */}
      <section className="py-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">기본 정보</h2>
        <GridForm labelWidth="200px">
          {basicInfo.map(({ label, value, icon: Icon }) => (
            <GridForm.Row key={label}>
              <GridForm.Label className="flex items-center gap-2">
                <Icon className="w-4 h-4 neu-icon-active" />
                {label}
              </GridForm.Label>
              <GridForm.Content>
                <span className="text-base font-medium">{value}</span>
              </GridForm.Content>
            </GridForm.Row>
          ))}
        </GridForm>
      </section>


      {/* ----------------------------- 시설 규모 ----------------------------- */}
      <section className="py-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">시설 규모</h2>
        <GridForm labelWidth="200px">
          {facilityScale.map(({ label, value, icon: Icon }) => (
            <GridForm.Row key={label}>
              <GridForm.Label className="flex items-center gap-2">
                <Icon className="w-4 h-4 neu-icon-active" />
                {label}
              </GridForm.Label>
              <GridForm.Content>
                <span className="text-base font-medium">{value}</span>
              </GridForm.Content>
            </GridForm.Row>
          ))}
        </GridForm>
      </section>


      {/* ------------------------- 디지털 서비스 현황 ------------------------- */}
      <section className="py-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">디지털 서비스 현황</h2>
        <GridForm labelWidth="200px">
          {digitalStatus.map(({ label, value, icon: Icon }) => (
            <GridForm.Row key={label}>
              <GridForm.Label className="flex items-center gap-2">
                <Icon className="w-4 h-4 neu-icon-active" />
                {label}
              </GridForm.Label>
              <GridForm.Content>
                <span className="text-base font-medium">{value}</span>
              </GridForm.Content>
            </GridForm.Row>
          ))}
        </GridForm>
      </section>


      {/* ----------------------------- 운영 현황 ----------------------------- */}
      <section className="py-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">운영 현황</h2>
        <GridForm labelWidth="200px">
          {operationStatus.map(({ label, value, icon: Icon }) => (
            <GridForm.Row key={label}>
              <GridForm.Label className="flex items-center gap-2">
                <Icon className="w-4 h-4 neu-icon-active" />
                {label}
              </GridForm.Label>
              <GridForm.Content>
                <span className="text-base font-medium">{value}</span>
              </GridForm.Content>
            </GridForm.Row>
          ))}
        </GridForm>
      </section>


      {/* --------------------------- 계약 및 관리 --------------------------- */}
      <section className="py-6">
        <h2 className="mb-6 text-xl font-semibold text-foreground">계약 및 관리</h2>
        <GridForm labelWidth="200px">
          {contractManagement.map(({ label, value, icon: Icon }) => (
            <GridForm.Row key={label}>
              <GridForm.Label className="flex items-center gap-2">
                <Icon className="w-4 h-4 neu-icon-active" />
                {label}
              </GridForm.Label>
              <GridForm.Content>
                <span className="text-base font-medium">{value}</span>
              </GridForm.Content>
            </GridForm.Row>
          ))}
        </GridForm>
      </section>
    </div>
  );
} 
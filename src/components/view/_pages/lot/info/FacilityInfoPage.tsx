/* 메뉴 설명: 페이지 기능 설명 */
'use client';
import React from 'react';

import { Building2, Users, Smartphone, Settings, FileText } from 'lucide-react';
import { GridFormAuto, type GridFormFieldSchema } from '@/components/ui/ui-layout/grid-form';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';

export default function FacilityInfoPage() {
  // 페이지 설명 설정
  

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
      { label: '주차이용면적', value: '300면' },
      { label: '세대수 전체', value: '1,151세대' },
      { label: '앱 설치', value: '30세대' },
      { label: '설치 차단기', value: '2대' },
      { label: '근무자 수', value: '5명' },
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
    { label: '시설 유형', value: facility.type },
    { label: '시설명', value: facility.name },
    { label: '주소', value: facility.address },
  ];

  // 2. 시설 규모 - 물리적 크기와 용량 정보
  const facilityScale = [
    { label: '세대수 전체', value: '1,151세대' },
    { label: '주차이용면적', value: '300면' },
  ];

  // 3. 디지털 서비스 현황 - 앱 설치 및 디지털화 진행 상황
  const digitalStatus = [
    { label: '앱 설치 세대', value: '30세대' },
    { label: '앱 설치율', value: installRate },
  ];

  // 4. 운영 현황 - 실제 운영되고 있는 시설과 인력
  const operationStatus = [
    { label: '설치 차단기', value: '2대' },
    { label: '근무자 수', value: '5명' },
  ];

  // 5. 계약 및 관리 - 계약 정보와 관리 체계
  const contractManagement = [
    { label: '계약 기간', value: facility.contract.period },
    { label: '유료 여부', value: facility.contract.paid },
    { label: '담당자', value: facility.contact.manager },
    { label: '연락처', value: facility.contact.phone },
    { label: '세대방문 비밀번호', value: facility.password },
  ];

  return (
    <div className="flex flex-col gap-6 mx-auto w-full max-w-5xl">
      <PageHeader 
        title="주차장 시설 정보" 
        subtitle="시설 기본정보, 규모, 디지털 서비스 현황 및 운영 관리"
      />
      
      <div className="flex flex-col w-full">
        {/* ----------------------------- 기본 정보 ----------------------------- */}
        <section className="pb-6">
          <h2 className="flex gap-2 items-center mb-6 text-xl font-semibold text-foreground">
            <Building2 className="w-5 h-5 neu-icon-active" />
            기본 정보
          </h2>
          {(() => {
            const fields: GridFormFieldSchema[] = basicInfo.map(({ label, value }) => ({
              id: label.replace(/\s+/g, ''),
              label: label,
              component: (
                <span className="text-base font-medium">{value}</span>
              )
            }));

            return <GridFormAuto fields={fields} />;
          })()}
        </section>


        {/* ----------------------------- 시설 규모 ----------------------------- */}
        <section className="py-6">
          <h2 className="flex gap-2 items-center mb-6 text-xl font-semibold text-foreground">
            <Users className="w-5 h-5 neu-icon-active" />
            시설 규모
          </h2>
          {(() => {
            const fields: GridFormFieldSchema[] = facilityScale.map(({ label, value }) => ({
              id: label.replace(/\s+/g, ''),
              label: label,
              component: (
                <span className="text-base font-medium">{value}</span>
              )
            }));

            return <GridFormAuto fields={fields} />;
          })()}
        </section>


        {/* ------------------------- 디지털 서비스 현황 ------------------------- */}
        <section className="py-6">
          <h2 className="flex gap-2 items-center mb-6 text-xl font-semibold text-foreground">
            <Smartphone className="w-5 h-5 neu-icon-active" />
            디지털 서비스 현황
          </h2>
          {(() => {
            const fields: GridFormFieldSchema[] = digitalStatus.map(({ label, value }) => ({
              id: label.replace(/\s+/g, ''),
              label: label,
              component: (
                <span className="text-base font-medium">{value}</span>
              )
            }));

            return <GridFormAuto fields={fields} />;
          })()}
        </section>


        {/* ----------------------------- 운영 현황 ----------------------------- */}
        <section className="py-6">
          <h2 className="flex gap-2 items-center mb-6 text-xl font-semibold text-foreground">
            <Settings className="w-5 h-5 neu-icon-active" />
            운영 현황
          </h2>
          {(() => {
            const fields: GridFormFieldSchema[] = operationStatus.map(({ label, value }) => ({
              id: label.replace(/\s+/g, ''),
              label: label,
              component: (
                <span className="text-base font-medium">{value}</span>
              )
            }));

            return <GridFormAuto fields={fields} />;
          })()}
        </section>


        {/* --------------------------- 계약 및 관리 --------------------------- */}
        <section className="py-6">
          <h2 className="flex gap-2 items-center mb-6 text-xl font-semibold text-foreground">
            <FileText className="w-5 h-5 neu-icon-active" />
            계약 및 관리
          </h2>
          {(() => {
            const fields: GridFormFieldSchema[] = contractManagement.map(({ label, value }) => ({
              id: label.replace(/\s+/g, ''),
              label: label,
              component: (
                <span className="text-base font-medium">{value}</span>
              )
            }));

            return <GridFormAuto fields={fields} />;
          })()}
        </section>
      </div>
    </div>
  );
} 
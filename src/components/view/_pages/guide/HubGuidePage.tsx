/**
 * @path src/components/view/global/info/guide/HubGuidePage.tsx
 * @description 허브 이용 안내 페이지
 * @responsibility 주차 SAAS 시스템 사용 가이드 및 안내 정보 제공
 */

'use client';
import React from 'react';
import { 
  Car, 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle,
  Info,
  Lightbulb,
  FileText
} from 'lucide-react';

// UI 컴포넌트
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Card } from '@/components/ui/ui-effects/card/Card';
import { Badge } from '@/components/ui/ui-effects/badge/Badge';
import { Accordion } from '@/components/ui/ui-layout/accordion/Accordion';

// Hooks

// #region 가이드 데이터
const guideInfo = {
  systemOverview: {
    title: '시스템 개요',
    description: '주차 SAAS 허브는 통합 주차장 관리 시스템으로, 효율적인 주차 운영을 위한 모든 기능을 제공합니다.',
    features: [
      { icon: Car, title: '차량 관리', description: '입주민/방문자 차량 등록 및 관리' },
      { icon: Users, title: '사용자 관리', description: '입주민, 관리자 계정 통합 관리' },
      { icon: Shield, title: '보안 기능', description: '출입 통제 및 보안 관리' },
      { icon: BarChart3, title: '통계 분석', description: '이용 현황 및 수익 분석' },
      { icon: Settings, title: '시설 관리', description: '주차장 시설 및 설정 관리' },
      { icon: Clock, title: '실시간 모니터링', description: '실시간 주차 현황 모니터링' }
    ]
  },
  quickStart: {
    title: '빠른 시작 가이드',
    steps: [
      {
        step: 1,
        title: '시스템 접속',
        description: '관리자 계정으로 로그인하여 시스템에 접속합니다.',
        details: [
          '웹 브라우저에서 시스템 주소로 접속',
          '관리자 계정(ID/비밀번호) 입력',
          '대시보드 화면 확인'
        ]
      },
      {
        step: 2,
        title: '기본 설정',
        description: '주차장 정보 및 기본 설정을 완료합니다.',
        details: [
          '주차장 기본 정보 입력',
          '주차 요금 및 규칙 설정',
          '운영 시간 설정'
        ]
      },
      {
        step: 3,
        title: '사용자 등록',
        description: '입주민 및 관리자 계정을 등록합니다.',
        details: [
          '입주민 정보 일괄 등록',
          '관리자 계정 추가 생성',
          '권한 설정 및 승인'
        ]
      },
      {
        step: 4,
        title: '차량 등록',
        description: '입주민 차량 및 방문자 차량을 등록합니다.',
        details: [
          '입주민 차량 번호 등록',
          '방문자 차량 임시 등록',
          '차량 분류 및 태그 설정'
        ]
      }
    ]
  },
  userRoles: {
    title: '사용자 역할별 기능',
    roles: [
      {
        role: '슈퍼 관리자',
        description: '시스템 전체 관리 권한',
        permissions: [
          '모든 주차장 관리',
          '시스템 설정 변경',
          '관리자 계정 생성/삭제',
          '결제 및 정산 관리',
          '시스템 백업/복원'
        ]
      },
      {
        role: '주차장 관리자',
        description: '개별 주차장 운영 관리',
        permissions: [
          '해당 주차장 운영 관리',
          '입주민/차량 등록 관리',
          '출입 기록 조회',
          '요금 정산 처리',
          '각종 신고 처리'
        ]
      },
      {
        role: '보안 관리자',
        description: '보안 및 출입 통제 관리',
        permissions: [
          '출입 통제 설정',
          '보안 카메라 관리',
          '비상상황 대응',
          '출입 기록 모니터링',
          '보안 알림 관리'
        ]
      },
      {
        role: '입주민',
        description: '개인 주차장 이용 관리',
        permissions: [
          '개인 차량 등록/수정',
          '방문자 차량 신청',
          '주차 이력 조회',
          '요금 결제',
          '불만/건의 신청'
        ]
      }
    ]
  },
  faq: {
    title: '자주 묻는 질문',
    items: [
      {
        question: '비밀번호를 잊어버렸어요',
        answer: '로그인 화면에서 "비밀번호 찾기"를 클릭하거나, 시스템 관리자에게 문의하세요. 관리자는 사용자 계정의 비밀번호를 초기화할 수 있습니다.'
      },
      {
        question: '새로운 차량을 등록하려면 어떻게 해야 하나요?',
        answer: '차량 관리 메뉴에서 "차량 추가" 버튼을 클릭하고, 차량 번호, 소유자 정보, 차량 종류 등 필요한 정보를 입력하세요.'
      },
      {
        question: '방문자 차량은 어떻게 관리하나요?',
        answer: '방문자 차량은 임시 등록이 가능합니다. 방문 예정 시간, 차량 번호 등을 입력하여 임시 출입 권한을 부여할 수 있습니다.'
      },
      {
        question: '주차 통계는 어디서 확인할 수 있나요?',
        answer: '통계 메뉴에서 일간/주간/월간 주차 현황, 수익 분석, 이용자 통계 등을 확인할 수 있습니다.'
      },
      {
        question: '시스템 오류가 발생했을 때는 어떻게 하나요?',
        answer: '시스템 오류 발생 시 즉시 기술지원팀에 연락하거나, 시스템 내 신고 기능을 이용하여 문제를 신고해 주세요.'
      }
    ]
  },
};
// #endregion

export default function HubGuidePage() {

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 헤더 */}
      <PageHeader 
        title="허브 이용 안내"
        subtitle="주차 SAAS 허브 시스템의 기능과 사용법을 안내합니다."
      />

      {/* 시스템 개요 */}
      <Card className="p-6">
        <div className="flex gap-3 items-center mb-4">
          <Info className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">{guideInfo.systemOverview.title}</h2>
        </div>
        <p className="mb-6 text-gray-600">{guideInfo.systemOverview.description}</p>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guideInfo.systemOverview.features.map((feature, index) => (
            <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg">
              <feature.icon className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="mb-1 font-medium">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 빠른 시작 가이드 */}
      <Card className="p-6">
        <div className="flex gap-3 items-center mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h2 className="text-xl font-semibold">{guideInfo.quickStart.title}</h2>
        </div>
        
        <div className="space-y-6">
          {guideInfo.quickStart.steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex justify-center items-center w-8 h-8 font-semibold text-white rounded-full bg-primary">
                  {step.step}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 font-semibold">{step.title}</h3>
                <p className="mb-3 text-gray-600">{step.description}</p>
                <ul className="space-y-1">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex gap-2 items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 사용자 역할별 기능 */}
      <Card className="p-6">
        <div className="flex gap-3 items-center mb-4">
          <Users className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-semibold">{guideInfo.userRoles.title}</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {guideInfo.userRoles.roles.map((role, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200">
              <div className="flex gap-2 items-center mb-3">
                <Badge variant="secondary">{role.role}</Badge>
              </div>
              <p className="mb-4 text-gray-600">{role.description}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">주요 권한:</h4>
                <ul className="space-y-1">
                  {role.permissions.map((permission, permIndex) => (
                    <li key={permIndex} className="flex gap-2 items-center text-sm">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 자주 묻는 질문 */}
      <Card className="p-6">
        <div className="flex gap-3 items-center mb-4">
          <FileText className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-semibold">{guideInfo.faq.title}</h2>
        </div>
        
        <div className="space-y-4">
          {guideInfo.faq.items.map((item, index) => (
            <Accordion 
              key={index}
              title={item.question}
              className="w-full"
            >
              <p className="leading-relaxed text-gray-600">{item.answer}</p>
            </Accordion>
          ))}
        </div>
      </Card>


      {/* 추가 안내사항 */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3 items-start">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="mb-2 font-semibold text-blue-900">추가 안내사항</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• 시스템 업데이트는 매월 둘째 주 수요일 새벽 2시에 진행됩니다.</li>
              <li>• 정기 점검은 분기별로 실시되며, 사전 공지를 통해 안내드립니다.</li>
              <li>• 사용자 매뉴얼은 시스템 내 도움말 메뉴에서 언제든지 확인할 수 있습니다.</li>
              <li>• 새로운 기능 추가 시 별도의 교육 자료를 제공합니다.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
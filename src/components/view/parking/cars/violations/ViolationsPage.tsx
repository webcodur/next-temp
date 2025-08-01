'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/ui-input/button/Button';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import { PaginatedTable } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { Trash2, Plus } from 'lucide-react';
import { searchCarViolations } from '@/services/carViolations';

import type { 
  CarViolation, 
  SearchCarViolationRequest,
  CarViolationType,
  ViolationStatus,
  ViolationReporterType
} from '@/types/carViolation';

// #region 타입 정의
interface TableCarViolation extends CarViolation {
  violationTypeText: string;
  statusText: string;
  reporterTypeText: string;
  [key: string]: unknown;
}
// #endregion

// #region 상수 정의
const VIOLATION_TYPE_OPTIONS = [
  { value: 'UNAUTHORIZED_PARKING', label: '무단 주차' },
  { value: 'OVERTIME_PARKING', label: '초과 주차' },
  { value: 'RESERVED_SPOT_VIOLATION', label: '지정석 위반' },
  { value: 'FIRE_LANE_PARKING', label: '소방차로 주차' },
  { value: 'DISABLED_SPOT_VIOLATION', label: '장애인 구역 위반' },
  { value: 'DOUBLE_PARKING', label: '이중 주차' },
  { value: 'BLOCKING_EXIT', label: '출구 차단' },
  { value: 'NO_PERMIT_PARKING', label: '허가증 없는 주차' },
  { value: 'EXPIRED_PERMIT', label: '허가증 만료' },
  { value: 'SPEEDING', label: '과속' },
  { value: 'NOISE_VIOLATION', label: '소음 위반' },
  { value: 'VANDALISM', label: '기물 파손' },
  { value: 'OTHER', label: '기타' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'PROCESSED', label: '처리됨' },
  { value: 'DISMISSED', label: '기각됨' },
  { value: 'APPEALED', label: '이의제기' },
  { value: 'CANCELLED', label: '취소됨' },
];

const REPORTER_TYPE_OPTIONS = [
  { value: 'SYSTEM', label: '시스템' },
  { value: 'ADMIN', label: '관리자' },
  { value: 'RESIDENT', label: '입주민' },
  { value: 'SECURITY', label: '경비원' },
];
// #endregion

// #region 유틸리티 함수
function getViolationTypeText(type: CarViolationType): string {
  return VIOLATION_TYPE_OPTIONS.find(option => option.value === type)?.label || type;
}

function getStatusText(status: ViolationStatus): string {
  return STATUS_OPTIONS.find(option => option.value === status)?.label || status;
}

function getReporterTypeText(type: ViolationReporterType): string {
  return REPORTER_TYPE_OPTIONS.find(option => option.value === type)?.label || type;
}

function transformToTableData(violations: CarViolation[]): TableCarViolation[] {
  return violations.map(violation => ({
    ...violation,
    violationTypeText: getViolationTypeText(violation.violationType),
    statusText: getStatusText(violation.status),
    reporterTypeText: getReporterTypeText(violation.reporterType),
  }));
}
// #endregion

export default function ViolationsPage() {
  const router = useRouter();

  // #region 상태 관리
  const [violations, setViolations] = useState<TableCarViolation[]>([]);

  const [searchFilters, setSearchFilters] = useState<SearchCarViolationRequest>({
    page: 1,
    limit: 10,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    violation?: TableCarViolation;
  }>({ isOpen: false });
  
  // 검색 폼 상태
  const [searchForm, setSearchForm] = useState({
    carNumber: '',
    violationType: '',
    status: '',
    reporterType: '',
    violationTimeFrom: '',
    violationTimeTo: '',
  });
  // #endregion

  // #region API 호출 함수
  const loadViolations = useCallback(async (filters?: SearchCarViolationRequest) => {
    try {
      const result = await searchCarViolations(filters || searchFilters);
      
      if (result.success && result.data) {
        const transformedData = transformToTableData(result.data.data);
        setViolations(transformedData);
      } else {
        console.error('위반 기록 로딩 실패:', result.errorMsg);
        setViolations([]);
      }
    } catch (error) {
      console.error('위반 기록 로딩 중 오류:', error);
      setViolations([]);
    }
  }, [searchFilters]);

  const handleDeleteViolation = useCallback(async (violation: TableCarViolation) => {
    try {
      // 실제 삭제 API가 있다면 여기서 호출
      // await deleteCarViolation(violation.id);
      
      // 로컬 상태에서 제거 (낙관적 업데이트)
      setViolations(prev => prev.filter(v => v.id !== violation.id));
      setDeleteModal({ isOpen: false });
      
      // TODO: 실제 삭제 API 추가 시 적절한 오류 처리 구현
      console.log('위반 기록 삭제:', violation.id);
    } catch (error) {
      console.error('위반 기록 삭제 중 오류:', error);
      // 실패 시 다시 로드
      loadViolations();
    }
  }, [loadViolations]);
  // #endregion

  // #region 이벤트 핸들러
  const handleSearch = useCallback(() => {
    const filters: SearchCarViolationRequest = {
      page: 1,
      limit: searchFilters.limit,
      ...(searchForm.carNumber && { carNumber: searchForm.carNumber }),
      ...(searchForm.violationType && { violationType: searchForm.violationType as CarViolationType }),
      ...(searchForm.status && { status: searchForm.status as ViolationStatus }),
      ...(searchForm.reporterType && { reporterType: searchForm.reporterType as ViolationReporterType }),
      ...(searchForm.violationTimeFrom && { violationTimeFrom: searchForm.violationTimeFrom }),
      ...(searchForm.violationTimeTo && { violationTimeTo: searchForm.violationTimeTo }),
    };
    setSearchFilters(filters);
    loadViolations(filters);
  }, [searchForm, searchFilters.limit, loadViolations]);

  const handleReset = useCallback(() => {
    setSearchForm({
      carNumber: '',
      violationType: '',
      status: '',
      reporterType: '',
      violationTimeFrom: '',
      violationTimeTo: '',
    });
    const resetFilters = { page: 1, limit: 10 };
    setSearchFilters(resetFilters);
    loadViolations(resetFilters);
  }, [loadViolations]);

  const handlePageChange = useCallback((page: number) => {
    const updatedFilters = { ...searchFilters, page };
    setSearchFilters(updatedFilters);
    loadViolations(updatedFilters);
  }, [searchFilters, loadViolations]);

  const handleRowClick = useCallback((violation: TableCarViolation) => {
    router.push(`/parking/cars/violation/${violation.id}`);
  }, [router]);

  const handleCreateClick = useCallback(() => {
    router.push('/parking/cars/violation/create');
  }, [router]);
  // #endregion

  // #region 테이블 설정
  const columns = useMemo(() => [
    {
      key: 'carNumber' as keyof TableCarViolation,
      header: '차량번호',
      width: '120px',
    },
    {
      key: 'violationTypeText' as keyof TableCarViolation,
      header: '위반 유형',
      width: '140px',
    },
    {
      key: 'violationTime' as keyof TableCarViolation,
      header: '위반 시각',
      width: '160px',
      render: (value: unknown) => {
        const dateValue = value as string;
        return new Date(dateValue).toLocaleString('ko-KR');
      },
    },
    {
      key: 'statusText' as keyof TableCarViolation,
      header: '상태',
      width: '100px',
    },
    {
      key: 'reporterTypeText' as keyof TableCarViolation,
      header: '신고자',
      width: '100px',
    },
    {
      key: 'severityLevel' as keyof TableCarViolation,
      header: '심각도',
      width: '80px',
    },
    {
      key: 'penaltyPoints' as keyof TableCarViolation,
      header: '벌점',
      width: '80px',
    },
    {
      key: 'actions' as keyof TableCarViolation,
      header: '작업',
      width: '80px',
      cell: (violation: TableCarViolation) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="ghost"
            size="sm"
            title="삭제"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, violation });
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ], []);
  // #endregion

  // #region 초기 데이터 로드
  useEffect(() => {
    loadViolations();
  }, [loadViolations]);
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="위반 차량" 
        subtitle="주차장 내 차량 위반 기록을 조회하고 관리합니다."
        rightActions={
          <Button
            variant="accent"
            size="sm"
            onClick={handleCreateClick}
            title="위반 기록 추가"
          >
            <Plus size={16} />
          </Button>
        }
      />

      {/* 고급 검색 */}
      <AdvancedSearch
        title="검색 조건"
        onSearch={handleSearch}
        onReset={handleReset}
        fields={[
          {
            key: 'carNumber',
            label: '차량번호',
            visible: true,
            element: (
              <Field
                label="차량번호"
                type="text"
                placeholder="차량번호를 입력하세요"
                value={searchForm.carNumber}
                onChange={(value) => setSearchForm(prev => ({ ...prev, carNumber: value }))}
              />
            ),
          },
          {
            key: 'violationType',
            label: '위반 유형',
            visible: true,
            element: (
              <Field
                label="위반 유형"
                type="select"
                options={VIOLATION_TYPE_OPTIONS}
                placeholder="위반 유형을 선택하세요"
                value={searchForm.violationType}
                onChange={(value) => setSearchForm(prev => ({ ...prev, violationType: value || '' }))}
              />
            ),
          },
          {
            key: 'status',
            label: '상태',
            visible: true,
            element: (
              <Field
                label="상태"
                type="select"
                options={STATUS_OPTIONS}
                placeholder="상태를 선택하세요"
                value={searchForm.status}
                onChange={(value) => setSearchForm(prev => ({ ...prev, status: value || '' }))}
              />
            ),
          },
          {
            key: 'reporterType',
            label: '신고자 유형',
            visible: true,
            element: (
              <Field
                label="신고자 유형"
                type="select"
                options={REPORTER_TYPE_OPTIONS}
                placeholder="신고자 유형을 선택하세요"
                value={searchForm.reporterType}
                onChange={(value) => setSearchForm(prev => ({ ...prev, reporterType: value || '' }))}
              />
            ),
          },
        ]}
      />

      {/* 데이터 테이블 */}
      <PaginatedTable<TableCarViolation>
        data={violations}
        columns={columns}
        onRowClick={handleRowClick}
        currentPage={searchFilters.page || 1}
        pageSize={searchFilters.limit || 10}
        onPageChange={handlePageChange}
      />

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="위반 기록 삭제"
      >
        <div className="space-y-4">
          <p>정말로 이 위반 기록을 삭제하시겠습니까?</p>
          {deleteModal.violation && (
            <div className="p-4 rounded-lg bg-muted">
              <p><strong>차량번호:</strong> {deleteModal.violation.carNumber}</p>
              <p><strong>위반 유형:</strong> {deleteModal.violation.violationTypeText}</p>
              <p><strong>위반 시각:</strong> {new Date(deleteModal.violation.violationTime).toLocaleString('ko-KR')}</p>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ isOpen: false })}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteModal.violation && handleDeleteViolation(deleteModal.violation)}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
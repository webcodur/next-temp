'use client';

import React from 'react';
import { VehicleEntry, SearchFilters } from '@/types/parking';
import { SmartTable, SmartTableColumn } from '@/components/ui/ui-data/smartTable/SmartTable';
import InfiniteScroll from '@/components/ui/ui-data/infinite-scroll/InfiniteScroll';
import { parseCarAllowType } from '@/data/mockParkingData';
import LicensePlate from '@/components/ui/system-testing/license-plate/LicensePlate';
import { useTranslations } from '@/hooks/useI18n';

interface VehicleSmartTableProps {
  vehicles: VehicleEntry[];
  filters: SearchFilters;
  selectedVehicle: VehicleEntry | null;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const VehicleSmartTable: React.FC<VehicleSmartTableProps> = ({
  vehicles,
  selectedVehicle,
  onLoadMore,
  hasMore,
  isLoading,
  size = 'md',
}) => {
  const t = useTranslations();

  // Size mapping for style adjustments
  const sizeMapping = {
    sm: { font: 'text-xs', plateWidth: '120px', padding: 'py-2 px-3' },
    md: { font: 'text-sm', plateWidth: '140px', padding: 'py-2.5 px-4' },
    lg: { font: 'text-base', plateWidth: '160px', padding: 'py-3 px-5' },
  } as const;
  const sz = sizeMapping[size];

  // Column definitions
  const columns: SmartTableColumn<VehicleEntry>[] = [
    {
      header: t('주차_테이블_헤더_순번'),
      width: '8%',
      align: 'center',
      cell: (_item, idx) => <span>{vehicles.length - idx}</span>,
    },
    {
      header: t('주차_테이블_헤더_차량구분'),
      width: '20%',
      align: 'center',
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {parseCarAllowType(item.type)}
          </span>
          {(item.address_1depth || item.address_2depth) && (
            <span className="text-xs text-muted-foreground">
              {item.address_1depth} {item.address_2depth}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t('주차_테이블_헤더_차량번호'),
      width: '25%',
      align: 'center',
      cell: (item) => (
        <div className="flex flex-col gap-1">
          <LicensePlate plateNumber={item.car_number} width={sz.plateWidth} />
          {item.modify_car_number && (
            <>
              <span className="text-xs text-warning">→</span>
              <LicensePlate plateNumber={item.modify_car_number} width={sz.plateWidth} />
            </>
          )}
        </div>
      ),
    },
    {
      header: t('주차_테이블_헤더_입출차'),
      width: '12%',
      align: 'center',
      cell: (item) => (
        <div>
          <span
            className={`inline-flex px-1 py-0.5 rounded text-xs font-medium ${
              item.status === 1 ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
            }`}
          >
            {item.status === 1 ? t('주차_상태_입차') : t('주차_상태_출차')}
          </span>
          {item.device_name && (
            <div className="text-xs text-muted-foreground">{item.device_name}</div>
          )}
        </div>
      ),
    },
    {
      header: t('주차_테이블_헤더_이용시간'),
      width: '35%',
      align: 'center',
      cell: (item) => <span>{item.use_time}</span>,
    },
  ];

  return (
    <div className="rounded-xl neu-flat bg-background">
      {vehicles.length === 0 ? (
        <SmartTable
          data={[]}
          columns={columns}
          emptyMessage="차량 데이터가 없습니다."
          rowClassName={(item) => {
            const base = `${sz.font} ${sz.padding} hover:bg-muted cursor-pointer`;
            const state =
              item.id === selectedVehicle?.id && item.status === selectedVehicle?.status
                ? 'bg-primary/10'
                : item.is_black === 'Y'
                  ? 'bg-destructive/10'
                  : '';
            return base + ' ' + state;
          }}
          headerClassName={`${sz.font}`}
        />
      ) : (
        <InfiniteScroll loadMore={onLoadMore} hasMore={hasMore} isLoading={isLoading} threshold={0.8}>
          <SmartTable
            data={vehicles}
            columns={columns}
            rowClassName={(item) => {
              const base = `${sz.font} ${sz.padding} hover:bg-muted cursor-pointer`;
              const state =
                item.id === selectedVehicle?.id && item.status === selectedVehicle?.status
                  ? 'bg-primary/10'
                  : item.is_black === 'Y'
                    ? 'bg-destructive/10'
                    : '';
              return base + ' ' + state;
            }}
            headerClassName={`${sz.font}`}
          />
        </InfiniteScroll>
      )}
    </div>
  );
};

export default VehicleSmartTable; 
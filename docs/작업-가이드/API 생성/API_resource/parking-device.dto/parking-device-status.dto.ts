import { ApiProperty } from '@nestjs/swagger';
import { BaseListResponseDto } from '../../common/dto/base.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { IsOptional, IsNumber, IsDateString } from 'class-validator';

export class ParkingDeviceStatusLogDto {
  @ApiProperty({
    description: 'ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '차단기 ID',
    example: 1,
  })
  device_id: number;

  @ApiProperty({
    description: '상태 (1: 자동운행, 2: 항시열림, 3: 바이패스)',
    enum: [1, 2, 3],
    example: 1,
  })
  status: number;

  @ApiProperty({
    description: '에러 코드',
    example: 'ERR_PAPER_LOW',
    required: false,
  })
  error_code?: string | null;

  @ApiProperty({
    description: '에러 메시지',
    example: '용지 부족',
    required: false,
  })
  error_message?: string | null;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;
}

export class SearchParkingDeviceStatusDto extends PaginationQueryDto {
  @ApiProperty({
    description: '차단기 ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  device_id?: number;

  @ApiProperty({
    description: '상태 (1: 자동운행, 2: 항시열림, 3: 바이패스)',
    enum: [1, 2, 3],
    required: false,
  })
  @IsNumber()
  @IsOptional()
  status?: number;

  @ApiProperty({
    description: '시작 날짜',
    example: '2024-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    description: '종료 날짜',
    example: '2024-01-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;
}

export class ParkingDeviceStatusListResponseDto extends BaseListResponseDto<ParkingDeviceStatusLogDto> {
  @ApiProperty({
    description: '상태 로그 목록',
    type: [ParkingDeviceStatusLogDto],
  })
  data: ParkingDeviceStatusLogDto[];
}

export class DeviceStatusSummaryDto {
  @ApiProperty({
    description: '전체 차단기 수',
    example: 10,
  })
  total_devices: number;

  @ApiProperty({
    description: '온라인 차단기 수',
    example: 8,
  })
  online_devices: number;

  @ApiProperty({
    description: '오프라인 차단기 수',
    example: 1,
  })
  offline_devices: number;

  @ApiProperty({
    description: '오류 차단기 수',
    example: 1,
  })
  error_devices: number;

  @ApiProperty({
    description: '유지보수 중인 차단기 수',
    example: 0,
  })
  maintenance_devices: number;
}

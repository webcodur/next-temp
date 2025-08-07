import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsInt,
  IsString,
  IsDateString,
  IsJSON,
  IsArray,
} from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export enum ParkingDeviceActionType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}

export enum ChangedByType {
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
  API = 'API',
}

export class ParkingDeviceHistoryDto {
  @ApiProperty({
    description: 'ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '차단기 ID',
    example: 1,
  })
  parking_device_id: number;

  @ApiProperty({
    description: '작업 유형',
    enum: ParkingDeviceActionType,
    example: ParkingDeviceActionType.UPDATED,
  })
  action_type: ParkingDeviceActionType;

  @ApiProperty({
    description: '변경 전 데이터',
    example: { name: '기존 차단기', status: 1 },
    required: false,
  })
  before_data?: any;

  @ApiProperty({
    description: '변경 후 데이터',
    example: { name: '새로운 차단기', status: 2 },
    required: false,
  })
  after_data?: any;

  @ApiProperty({
    description: '변경된 필드 목록 (쉼표 구분)',
    example: 'name,status',
    required: false,
  })
  changed_fields?: string;

  @ApiProperty({
    description: '변경한 관리자 ID',
    example: 1,
    required: false,
  })
  admin_id?: number;

  @ApiProperty({
    description: '변경 주체 유형',
    enum: ChangedByType,
    example: ChangedByType.ADMIN,
  })
  changed_by_type: ChangedByType;

  @ApiProperty({
    description: '변경 사유',
    example: '차단기 설정 변경',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    description: 'IP 주소',
    example: '192.168.1.100',
    required: false,
  })
  ip_address?: string;

  @ApiProperty({
    description: 'User Agent',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  user_agent?: string;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: '변경한 관리자 정보',
    required: false,
  })
  admin?: {
    id: number;
    name: string;
    email: string;
  };
}

export class SearchParkingDeviceHistoryDto extends PaginationQueryDto {
  @ApiProperty({
    description: '작업 유형 필터',
    enum: ParkingDeviceActionType,
    required: false,
  })
  @IsEnum(ParkingDeviceActionType)
  @IsOptional()
  action_type?: ParkingDeviceActionType;

  @ApiProperty({
    description: '변경된 필드 목록 (쉼표 구분)',
    example: ['name', 'status'],
    required: false,
  })
  @IsString()
  @IsOptional()
  changed_field?: string;

  @ApiProperty({
    description: '시작 날짜 (YYYY-MM-DD)',
    example: '2024-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({
    description: '종료 날짜 (YYYY-MM-DD)',
    example: '2024-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  end_date?: string;
}

export class CreateParkingDeviceHistoryDto {
  @ApiProperty({
    description: '차단기 ID',
    example: 1,
  })
  @IsInt()
  parking_device_id: number;

  @ApiProperty({
    description: '작업 유형',
    enum: ParkingDeviceActionType,
    example: ParkingDeviceActionType.UPDATED,
  })
  @IsEnum(ParkingDeviceActionType)
  action_type: ParkingDeviceActionType;

  @ApiProperty({
    description: '변경 전 데이터',
    required: false,
  })
  @IsJSON()
  @IsOptional()
  before_data?: any;

  @ApiProperty({
    description: '변경 후 데이터',
    required: false,
  })
  @IsJSON()
  @IsOptional()
  after_data?: any;

  @ApiProperty({
    description: '변경된 필드 목록 (쉼표 구분)',
    example: 'name,status',
    required: false,
  })
  @IsString()
  @IsOptional()
  changed_fields?: string;

  @ApiProperty({
    description: '변경 사유',
    example: '차단기 설정 변경',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

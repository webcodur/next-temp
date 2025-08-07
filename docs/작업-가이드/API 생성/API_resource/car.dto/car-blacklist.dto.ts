import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  IsDate,
} from 'class-validator';
import { car_blacklist_type, blacklist_reason_type } from '@prisma/client';
import { BaseSearchDto } from 'src/common/dto/base.dto';
import { TransformBoolean } from 'src/decorators/transform-boolean.decorator';

export class CreateManualBlacklistDto {
  @ApiProperty({ description: '차량번호', example: '12가3456' })
  @IsString()
  @IsNotEmpty()
  car_number: string;

  @ApiProperty({
    description: '등록 사유',
    enum: blacklist_reason_type,
    example: 'VIOLATION_ACCUMULATION',
  })
  @IsEnum(blacklist_reason_type)
  registration_reason: blacklist_reason_type;

  @ApiProperty({
    description: '차단 상세 사유',
    example: '캡스 직원이 출퇴근을 여기서 합니다.',
  })
  @IsString()
  @IsNotEmpty()
  block_reason: string;

  @ApiProperty({
    description: '차단 기간 (일, 0이면 무기한)',
    minimum: 0,
    example: 30,
  })
  @IsInt()
  @Min(0)
  block_days: number;
}

export class UnblockBlacklistDto {
  @ApiProperty({ description: '해제 사유', example: '착하게 살거라' })
  @IsString()
  @IsNotEmpty()
  unblock_reason: string;
}

export class SearchBlacklistDto extends BaseSearchDto {
  @ApiPropertyOptional({ description: '차량번호' })
  @IsOptional()
  @IsString()
  car_number?: string;

  @ApiPropertyOptional({
    description: '블랙리스트 유형',
    enum: car_blacklist_type,
  })
  @IsOptional()
  @IsEnum(car_blacklist_type)
  blacklist_type?: car_blacklist_type;

  @ApiPropertyOptional({
    description: '등록 사유',
    enum: blacklist_reason_type,
  })
  @IsOptional()
  @IsEnum(blacklist_reason_type)
  registration_reason?: blacklist_reason_type;

  @ApiPropertyOptional({ description: '활성 상태' })
  @IsOptional()
  @TransformBoolean()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: '페이지 번호',
    default: 1,
    minimum: 1,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지 크기',
    default: 20,
    minimum: 1,
    maximum: 100,
    example: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;
}

export class BlacklistResponseDto {
  @ApiProperty({ description: '블랙리스트 ID', example: 1 })
  id: number;

  @ApiPropertyOptional({ description: '차량 ID', example: 1 })
  car_id?: number | null;

  @ApiProperty({ description: '차량번호', example: '12가3456' })
  car_number: string;

  @ApiProperty({
    description: '블랙리스트 유형',
    enum: car_blacklist_type,
    example: 'AUTO',
  })
  blacklist_type: car_blacklist_type;

  @ApiProperty({
    description: '등록 사유',
    enum: blacklist_reason_type,
    example: 'UNAUTHORIZED_PARKING',
  })
  registration_reason: blacklist_reason_type;

  @ApiProperty({ description: '총 위반 횟수', example: 1 })
  total_violations: number;

  @ApiProperty({ description: '총 페널티 점수', example: 1 })
  total_penalty_points: number;

  @ApiProperty({
    description: '차단 시작 시간',
    example: '2025-01-01T00:00:00.000Z',
  })
  blocked_at: Date | null;

  @ApiPropertyOptional({
    description: '차단 해제 예정 시간',
    example: '2025-01-15T00:00:00.000Z',
  })
  blocked_until?: Date | null;

  @ApiProperty({ description: '자동 해제 여부', example: true })
  auto_unblock: boolean;

  @ApiProperty({ description: '차단 활성 상태', example: true })
  is_active: boolean;

  @ApiPropertyOptional({
    description: '실제 해제 시간',
    example: '2025-01-15T00:00:00.000Z',
  })
  unblocked_at?: Date | null;

  @ApiPropertyOptional({ description: '해제한 관리자 ID' })
  unblocked_by?: number | null;

  @ApiPropertyOptional({ description: '해제 사유', example: '착하게 살거라' })
  unblock_reason?: string | null;

  @ApiPropertyOptional({ description: '차단 상세 사유' })
  block_reason?: string | null;

  @ApiPropertyOptional({ description: '증거 데이터', example: '증거 데이터' })
  evidence_data?: any;

  @ApiPropertyOptional({ description: '등록한 관리자 ID', example: 1 })
  registered_by?: number | null;

  @ApiProperty({
    description: '생성 시간',
    example: '2025-01-15T00:00:00.000Z',
  })
  created_at: Date | null;

  @ApiProperty({
    description: '수정 시간',
    example: '2025-01-15T00:00:00.000Z',
  })
  updated_at: Date | null;

  @ApiPropertyOptional({
    description: '차량 정보',
    example: { id: 1, car_number: '12가3456', brand: '현대', model: '쏘나타' },
  })
  car?: {
    id: number;
    car_number: string;
    brand: string | null;
    model: string | null;
  } | null;

  @ApiPropertyOptional({
    description: '등록한 관리자 정보',
    example: { id: 1, name: '관리자 이름', account: 'admin' },
  })
  registered_admin?: {
    id: number;
    name: string | null;
    account: string;
  } | null;

  @ApiPropertyOptional({
    description: '해제한 관리자 정보',
    example: { id: 1, name: '관리자 이름', account: 'admin' },
  })
  unblocked_admin?: {
    id: number;
    name: string | null;
    account: string;
  } | null;
}

export class BlacklistStatusDto {
  @ApiProperty({ description: '블랙리스트 등록 여부', example: true })
  is_blacklisted: boolean;

  @ApiPropertyOptional({
    description: '블랙리스트 정보',
    example: { id: 1, car_number: '12가3456', brand: '현대', model: '쏘나타' },
  })
  blacklist?: BlacklistResponseDto | null;
}

export class BlacklistStatsDto {
  @ApiProperty({ description: '총 블랙리스트 수', example: 1 })
  total_blacklists: number;

  @ApiProperty({ description: '활성 블랙리스트 수', example: 1 })
  active_blacklists: number;

  @ApiProperty({ description: '자동 등록 수', example: 1 })
  auto_registrations: number;

  @ApiProperty({ description: '수동 등록 수', example: 1 })
  manual_registrations: number;

  @ApiProperty({ description: '오늘 등록된 수', example: 1 })
  today_registrations: number;

  @ApiProperty({ description: '이번 주 등록된 수', example: 1 })
  week_registrations: number;

  @ApiProperty({ description: '이번 달 등록된 수', example: 1 })
  month_registrations: number;
}

export class UpdateBlacklistDto {
  @ApiProperty({
    description: '등록 사유',
    enum: blacklist_reason_type,
    example: 'VIOLATION_ACCUMULATION',
  })
  @IsEnum(blacklist_reason_type)
  registration_reason: blacklist_reason_type;

  @ApiPropertyOptional({
    description: '차단 해제 예정 시간',
    example: '2025-01-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  blocked_until?: Date | null;

  @ApiPropertyOptional({
    description: '차단 상세 사유',
    example: '캡스 직원이 출퇴근을 여기서 합니다.',
  })
  @IsOptional()
  @IsString()
  block_reason?: string | null;

  @ApiPropertyOptional({
    description: '해제 사유',
    example: '착하게 살거라',
  })
  @IsOptional()
  @IsString()
  unblock_reason?: string | null;
}

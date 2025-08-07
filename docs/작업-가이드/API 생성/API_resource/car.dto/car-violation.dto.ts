import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import {
  car_violation_type,
  violation_reporter_type,
  violation_status,
} from '@prisma/client';
import { BaseIdEntityDto, BaseSearchDto } from 'src/common/dto/base.dto';
import { TransformBoolean } from 'src/decorators/transform-boolean.decorator';

export class CreateCarViolationDto {
  @ApiProperty({ description: '차량번호', example: '12가3456' })
  @IsString()
  @IsNotEmpty()
  car_number: string;

  @ApiProperty({
    description: '위반 유형',
    enum: car_violation_type,
    example: 'UNAUTHORIZED_PARKING',
  })
  @IsEnum(car_violation_type)
  violation_type: car_violation_type;

  @ApiProperty({
    description: '위반 코드 (세부 분류)',
    example: 'IL-003',
  })
  @IsString()
  @IsNotEmpty()
  violation_code: string;

  @ApiPropertyOptional({ description: '위반 장소', example: '주차장 입구' })
  @IsOptional()
  @IsString()
  violation_location?: string;

  @ApiProperty({
    description: '위반 시간',
    example: '2025-09-15T00:00:00.000Z',
  })
  @IsDateString()
  violation_time: string;

  @ApiPropertyOptional({
    description: '위반 상세 내용',
    example: '주차장 입구에서 주차를 하지 않았습니다.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '증거 이미지 URL 배열',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidence_image_urls?: string[];

  @ApiPropertyOptional({
    description: '신고자 유형',
    enum: violation_reporter_type,
    example: 'SYSTEM',
    default: violation_reporter_type.SYSTEM,
  })
  @IsOptional()
  @IsEnum(violation_reporter_type)
  reporter_type?: violation_reporter_type;

  @ApiPropertyOptional({
    description: '관리자 ID (수동 신고시)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  reporter_id?: number;

  @ApiPropertyOptional({
    description: '위반 심각도 (1-5)',
    example: 1,
    minimum: 1,
    maximum: 5,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  severity_level?: number;

  @ApiPropertyOptional({
    description: '페널티 점수',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  penalty_points?: number;
}

export class UpdateCarViolationDto {
  @ApiPropertyOptional({
    description: '위반 상세 내용',
    example: '주차장 입구에서 주차를 하지 않았습니다.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '증거 이미지 URL 배열',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  evidence_image_urls?: string[];

  @ApiPropertyOptional({
    description: '위반 심각도 (1-5)',
    example: 1,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  severity_level?: number;

  @ApiPropertyOptional({
    description: '페널티 점수',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  penalty_points?: number;

  @ApiPropertyOptional({
    description: '위반 상태',
    enum: violation_status,
    example: 'DISMISSED',
  })
  @IsOptional()
  @IsEnum(violation_status)
  status?: violation_status;
}

export class ProcessCarViolationDto {
  @ApiProperty({
    description: '처리 메모',
    example: '주차장 입구에서 주차를 하지 않았습니다.',
  })
  @IsString()
  @IsNotEmpty()
  processing_note: string;

  @ApiProperty({
    description: '위반 상태',
    enum: violation_status,
    example: 'DISMISSED',
  })
  @IsEnum(violation_status)
  status: violation_status;
}

export class SearchCarViolationDto extends BaseSearchDto {
  @ApiPropertyOptional({ description: '차량번호' })
  @IsOptional()
  @IsString()
  car_number?: string;

  @ApiPropertyOptional({
    description: '위반 유형',
    enum: car_violation_type,
    example: 'UNAUTHORIZED_PARKING',
  })
  @IsOptional()
  @IsEnum(car_violation_type)
  violation_type?: car_violation_type;

  @ApiPropertyOptional({
    description: '위반 상태',
    enum: violation_status,
    example: 'ACTIVE',
  })
  @IsOptional()
  @IsEnum(violation_status)
  status?: violation_status;

  @ApiPropertyOptional({
    description: '신고자 유형',
    enum: violation_reporter_type,
    example: 'SYSTEM',
  })
  @IsOptional()
  @IsEnum(violation_reporter_type)
  reporter_type?: violation_reporter_type;

  @ApiPropertyOptional({
    description: '처리 여부',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  @Type(() => Boolean)
  is_processed?: boolean;

  @ApiPropertyOptional({
    description: '위반 시작 일시',
    example: '2025-09-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  violation_time_from?: string;

  @ApiPropertyOptional({
    description: '위반 종료 일시',
    example: '2025-09-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  violation_time_to?: string;
}

export class CarViolationDto extends BaseIdEntityDto {
  @ApiProperty({ description: '위반 ID', example: 1 })
  id: number;

  @ApiPropertyOptional({ description: '차량 ID', example: 1 })
  car_id?: number;

  @ApiProperty({ description: '차량번호', example: '12가3456' })
  car_number: string;

  @ApiProperty({
    description: '위반 유형',
    enum: car_violation_type,
    example: 'UNAUTHORIZED_PARKING',
  })
  violation_type: car_violation_type;

  @ApiProperty({ description: '위반 코드' })
  violation_code: string;

  @ApiPropertyOptional({ description: '위반 장소', example: '주차장 입구' })
  violation_location?: string;

  @ApiProperty({
    description: '위반 시간',
    example: '2025-09-15T00:00:00.000Z',
  })
  violation_time: Date;

  @ApiPropertyOptional({
    description: '위반 상세 내용',
    example: '주차장 입구에서 주차를 하지 않았습니다.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: '증거 이미지 URL 배열',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  evidence_image_urls?: string[];

  @ApiProperty({
    description: '신고자 유형',
    enum: violation_reporter_type,
    example: 'SYSTEM',
  })
  reporter_type: violation_reporter_type;

  @ApiProperty({ description: '위반 심각도', example: 1 })
  severity_level: number;

  @ApiProperty({ description: '페널티 점수', example: 1 })
  penalty_points: number;

  @ApiProperty({ description: '처리 여부', example: true })
  is_processed: boolean;

  @ApiPropertyOptional({
    description: '처리 시간',
    example: '2025-09-15T00:00:00.000Z',
  })
  processed_at?: Date;

  @ApiPropertyOptional({ description: '처리한 관리자 ID', example: 1 })
  processed_by?: number;

  @ApiPropertyOptional({
    description: '처리 메모',
    example: '주차장 입구에서 주차를 하지 않았습니다.',
  })
  processing_note?: string;

  @ApiProperty({
    description: '위반 상태',
    enum: violation_status,
    example: 'PENDING',
  })
  status: violation_status;

  @ApiPropertyOptional({
    description: '주차장 ID',
    example: 1,
  })
  parkinglot_id?: number;

  @ApiPropertyOptional({
    description: '차량 정보',
    example: { id: 1, car_number: '12가3456', brand: '현대', model: '쏘나타' },
  })
  car?: {
    id: number;
    car_number: string;
    brand: string | null;
    model: string | null;
  };

  @ApiPropertyOptional({
    description: '등록한 관리자 정보',
    example: { id: 1, name: '관리자 이름', account: 'admin' },
  })
  registered_admin?: {
    id: number;
    name: string | null;
    account: string;
  };

  @ApiPropertyOptional({
    description: '처리한 관리자 정보',
    example: { id: 1, name: '관리자 이름', account: 'admin' },
  })
  processor_admin?: {
    id: number;
    name: string | null;
    account: string;
  };
}

export class CarViolationSummaryDto {
  @ApiProperty({ description: '차량번호', example: '12가3456' })
  car_number: string;

  @ApiProperty({ description: '총 위반 횟수', example: 1 })
  total_violations: number;

  @ApiProperty({ description: '총 페널티 점수', example: 1 })
  total_penalty_points: number;

  @ApiProperty({
    description: '최근 위반 시간',
    example: '2025-09-15T00:00:00.000Z',
  })
  last_violation_time?: Date;

  @ApiProperty({
    description: '가장 심각한 위반 유형',
    enum: car_violation_type,
    example: 'UNAUTHORIZED_PARKING',
  })
  most_serious_violation?: car_violation_type;

  @ApiProperty({ description: '블랙리스트 등록 위험도 (1-5)', example: 1 })
  risk_level: number;
}

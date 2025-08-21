import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  MaxLength,
  IsIP,
  IsUrl,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Trim } from '../../decorators/trim.decorator';

export class CreateParkingDeviceDto {
  @ApiProperty({
    description: '차단기 이름',
    example: '정문 입구 차단기',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  @Trim()
  name: string;

  @ApiProperty({
    description: '차단기 IP 주소',
    example: '192.168.1.100',
  })
  @IsIP()
  @IsNotEmpty()
  ip: string;

  @ApiProperty({
    description: '차단기 포트',
    example: '8000',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  @Trim()
  port: string;

  @ApiProperty({
    description: '통합 보드 포트',
    example: '8001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(191)
  @Trim()
  server_port?: string;

  @ApiProperty({
    description: 'CCTV 주소',
    example: 'http://192.168.1.100:554/stream',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(191)
  @Trim()
  cctv_url: string;

  @ApiProperty({
    description: '차단기 상태 (1: 자동운행, 2: 항시열림, 3: 바이패스)',
    enum: [1, 2, 3],
    example: 1,
    default: 1,
  })
  @IsNumber()
  @IsIn([1, 2, 3])
  @IsOptional()
  status?: number = 1;

  @ApiProperty({
    description: '차단기 타입 (1: 라즈베리파이, 2: 통합보드)',
    enum: [1, 2],
    example: 1,
    default: 1,
  })
  @IsNumber()
  @IsIn([1, 2])
  @IsOptional()
  device_type?: number = 1;

  @ApiProperty({
    description: '발권기 사용 여부',
    example: 'Y',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Trim()
  is_ticketing?: string;

  @ApiProperty({
    description: '정산기 사용 여부',
    example: 'N',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Trim()
  is_receipting?: string;

  @ApiProperty({
    description: '용지 부족 알림 받을 전화번호',
    example: '010-1234-5678',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Trim()
  representative_phone?: string;

  @ApiProperty({
    description: '순서 (KOP 메인 화면에서 보이는 순서)',
    example: 1,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  sequence?: number = 0;

  @ApiProperty({
    description: '입주차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsIn([0, 1])
  @IsOptional()
  resident_permission?: number = 1;

  @ApiProperty({
    description: '정기차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsIn([0, 1])
  @IsOptional()
  regular_permission?: number = 1;

  @ApiProperty({
    description: '방문차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsIn([0, 1])
  @IsOptional()
  visitor_permission?: number = 1;

  @ApiProperty({
    description: '임시차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsIn([0, 1])
  @IsOptional()
  temp_permission?: number = 1;

  @ApiProperty({
    description: '업무차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsIn([0, 1])
  @IsOptional()
  business_permission?: number = 1;

  @ApiProperty({
    description: '상가차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsIn([0, 1])
  @IsOptional()
  commercial_permission?: number = 1;

  @ApiProperty({
    description: '택시 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @IsIn([0, 1])
  @IsOptional()
  taxi_permission?: number = 0;

  @ApiProperty({
    description: '발권차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    default: 1,
    required: false,
  })
  @IsNumber()
  @IsIn([0, 1])
  @IsOptional()
  ticket_machine_permission?: number = 1;

  @ApiProperty({
    description: '미등록차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 0,
    default: 0,
    required: false,
  })
  @IsNumber()
  @IsIn([0, 1])
  @IsOptional()
  unregistered_permission?: number = 0;
}

export class CreateParkingDeviceWithPolicyDto extends CreateParkingDeviceDto {}

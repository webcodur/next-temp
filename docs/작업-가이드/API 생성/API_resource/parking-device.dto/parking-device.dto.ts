import { ApiProperty } from '@nestjs/swagger';
import { BaseListResponseDto } from '../../common/dto/base.dto';

export class ParkingDeviceDto {
  @ApiProperty({
    description: 'ID',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: '주차장 ID',
    example: 1,
  })
  parkinglot_id: number;

  @ApiProperty({
    description: '차단기 이름',
    example: '정문 입구 차단기',
  })
  name: string;

  @ApiProperty({
    description: '차단기 IP 주소',
    example: '192.168.1.100',
  })
  ip: string;

  @ApiProperty({
    description: '차단기 포트',
    example: '8000',
  })
  port: string;

  @ApiProperty({
    description: '통합 보드 포트',
    example: '8001',
    required: false,
  })
  server_port?: string | null;

  @ApiProperty({
    description: 'CCTV 주소',
    example: 'http://192.168.1.100:554/stream',
  })
  cctv_url: string;

  @ApiProperty({
    description: '차단기 상태 (1: 자동운행, 2: 항시열림, 3: 바이패스)',
    enum: [1, 2, 3],
    example: 1,
  })
  status: number;

  @ApiProperty({
    description: '차단기 타입 (1: 라즈베리파이, 2: 통합보드)',
    enum: [1, 2],
    example: 1,
  })
  device_type: number;

  @ApiProperty({
    description: '발권기 사용 여부',
    example: 'Y',
    required: false,
  })
  is_ticketing?: string | null;

  @ApiProperty({
    description: '정산기 사용 여부',
    example: 'N',
    required: false,
  })
  is_receipting?: string | null;

  @ApiProperty({
    description: '용지 부족 알림 받을 전화번호',
    example: '010-1234-5678',
    required: false,
  })
  representative_phone?: string | null;

  @ApiProperty({
    description: '순서 (KOP 메인 화면에서 보이는 순서)',
    example: 1,
  })
  sequence: number;

  @ApiProperty({
    description: '입주차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    required: false,
  })
  resident_permission?: number | null;

  @ApiProperty({
    description: '정기차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    required: false,
  })
  regular_permission?: number | null;

  @ApiProperty({
    description: '방문차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    required: false,
  })
  visitor_permission?: number | null;

  @ApiProperty({
    description: '임시차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    required: false,
  })
  temp_permission?: number | null;

  @ApiProperty({
    description: '업무차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    required: false,
  })
  business_permission?: number | null;

  @ApiProperty({
    description: '상가차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    required: false,
  })
  commercial_permission?: number | null;

  @ApiProperty({
    description: '택시 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 0,
    required: false,
  })
  taxi_permission?: number | null;

  @ApiProperty({
    description: '발권차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 1,
    required: false,
  })
  ticket_machine_permission?: number | null;

  @ApiProperty({
    description: '미등록차 출입 가능 여부 (0: 비허용, 1: 허용)',
    enum: [0, 1],
    example: 0,
    required: false,
  })
  unregistered_permission?: number | null;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  created_at?: Date | null;

  @ApiProperty({
    description: '수정일시',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  updated_at?: Date | null;
}

export class ParkingDeviceListResponseDto extends BaseListResponseDto<ParkingDeviceDto> {
  @ApiProperty({
    description: '차단기 목록',
    type: [ParkingDeviceDto],
  })
  data: ParkingDeviceDto[];
}

export class ParkingDeviceDetailDto extends ParkingDeviceDto {}

export class ParkingDeviceWithPolicyDto extends ParkingDeviceDto {}

export class ParkingDeviceWithPolicyAndStatusDto extends ParkingDeviceDto {}

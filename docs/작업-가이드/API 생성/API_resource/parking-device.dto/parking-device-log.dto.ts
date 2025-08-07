import { ApiProperty } from '@nestjs/swagger';

export class ParkingDeviceStatusLogDto {
  @ApiProperty({
    description: '상태 로그 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '차단기 ID',
    example: 1,
  })
  device_id: number;

  @ApiProperty({
    description: '차단기 상태 (1: 자동운행, 2: 항시열림, 3: 바이패스)',
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

export class ParkingDeviceCommandLogDto {
  @ApiProperty({
    description: '명령 로그 ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '차단기 ID',
    example: 1,
  })
  device_id: number;

  @ApiProperty({
    description: '관리자 ID',
    example: 1,
    required: false,
  })
  admin_id?: number | null;

  @ApiProperty({
    description: '명령 타입',
    example: 'OPEN',
    enum: ['OPEN', 'CLOSE', 'STATUS_CHECK', 'TICKET', 'RECEIPT', 'VISIT_CARD'],
  })
  command: string;

  @ApiProperty({
    description: '명령 실행 상태 (0: 대기, 1: 성공, 2: 실패)',
    enum: [0, 1, 2],
    example: 1,
  })
  status: number;

  @ApiProperty({
    description: '요청 데이터',
    example: { action: 'open', reason: 'manual' },
    required: false,
  })
  request_data?: any;

  @ApiProperty({
    description: '응답 데이터',
    example: { result: 'success', message: 'Gate opened' },
    required: false,
  })
  response_data?: any;

  @ApiProperty({
    description: '에러 메시지',
    example: '차단기 연결 실패',
    required: false,
  })
  error_message?: string | null;

  @ApiProperty({
    description: '생성일시',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;
}

export class CreateParkingDeviceCommandLogDto {
  @ApiProperty({
    description: '명령 타입',
    example: 'OPEN',
    enum: ['OPEN', 'CLOSE', 'STATUS_CHECK', 'TICKET', 'RECEIPT', 'VISIT_CARD'],
  })
  command: string;

  @ApiProperty({
    description: '요청 데이터',
    example: { action: 'open', reason: 'manual' },
    required: false,
  })
  request_data?: any;
}

export class CreateParkingDeviceStatusLogDto {
  @ApiProperty({
    description: '차단기 상태 (1: 자동운행, 2: 항시열림, 3: 바이패스)',
    enum: [1, 2, 3],
    example: 1,
  })
  status: number;

  @ApiProperty({
    description: '에러 코드',
    example: 'ERR_PAPER_LOW',
    required: false,
  })
  error_code?: string;

  @ApiProperty({
    description: '에러 메시지',
    example: '용지 부족',
    required: false,
  })
  error_message?: string;
}

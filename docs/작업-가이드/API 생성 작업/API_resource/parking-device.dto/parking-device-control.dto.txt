import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsObject,
  MaxLength,
} from 'class-validator';
export class ParkingDeviceControlDto {
  @ApiProperty({
    description: '제어 명령',
    enum: ['OPEN', 'CLOSE', 'STATUS_CHECK', 'TICKET', 'RECEIPT', 'VISIT_CARD'],
    example: 'OPEN',
  })
  @IsString()
  @IsNotEmpty()
  command: string;

  @ApiProperty({
    description: '요청 데이터',
    example: { car_number: '12가3456' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  request_data?: Record<string, any>;
}

export class ParkingDeviceTicketingDto {
  @ApiProperty({
    description: '차량 번호',
    example: '12가3456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  car_number: string;

  @ApiProperty({
    description: '동',
    example: '101',
    required: false,
  })
  @IsString()
  @IsOptional()
  dong?: string;

  @ApiProperty({
    description: '호수',
    example: '1501',
    required: false,
  })
  @IsString()
  @IsOptional()
  hosu?: string;

  @ApiProperty({
    description: '전화번호',
    example: '010-1234-5678',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone_number?: string;
}

export class ParkingDeviceReceiptDto {
  @ApiProperty({
    description: '차량 번호',
    example: '12가3456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  car_number: string;

  @ApiProperty({
    description: '주차 로그 ID',
    example: 12345,
    required: false,
  })
  @IsOptional()
  parking_log_id?: number;
}

export class ControlResponseDto {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '차단기가 열렸습니다.',
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
    required: false,
  })
  data?: Record<string, any>;

  @ApiProperty({
    description: '에러 코드',
    required: false,
  })
  error_code?: string;

  @ApiProperty({
    description: '에러 메시지',
    required: false,
  })
  error_message?: string;
}

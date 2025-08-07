import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VehicleAccessCheckDto {
  @ApiProperty({
    description: '차량 번호',
    example: '12가1234',
  })
  @IsString()
  @IsNotEmpty()
  car_number: string;
}

export class VehicleAccessResponseDto {
  @ApiProperty({
    description: '출입 허가 여부',
    example: true,
  })
  allowed: boolean;

  @ApiProperty({
    description: '차량 유형',
    example: 'TAXI',
    enum: [
      'RESIDENT',
      'VISITOR',
      'TAXI',
      'DELIVERY',
      'COMMERCIAL',
      'EMERGENCY',
      'REGULAR',
      'TEMPORARY',
      'UNREGISTERED',
    ],
  })
  car_type: string;

  @ApiProperty({
    description: '거절 사유 (허가되지 않은 경우)',
    example: '택시 출입이 허용되지 않습니다.',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    description: '시간 제한 정보 (있는 경우)',
    example: '택시 출입 허용 시간: 06:00 - 22:00',
    required: false,
  })
  time_restriction?: string;
}

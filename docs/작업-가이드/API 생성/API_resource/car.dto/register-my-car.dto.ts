import { IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransformBoolean } from 'src/decorators/transform-boolean.decorator';

export class RegisterMyCarDto {
  @ApiProperty({
    description: '차량-세대 연결 ID',
    example: 1,
  })
  @IsNumber()
  car_instance_id: number;

  @ApiProperty({
    description: '출차 알림 설정',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  car_alarm?: boolean;

  @ApiProperty({
    description: '주 사용자 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  is_primary?: boolean;
}

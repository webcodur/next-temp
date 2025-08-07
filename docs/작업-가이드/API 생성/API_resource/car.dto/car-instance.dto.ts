import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';
import { InstanceDto } from 'src/instance/dto/instance.dto';
import { TransformBoolean } from 'src/decorators/transform-boolean.decorator';

export class CreateCarInstanceDto {
  @ApiProperty({
    description: '차량 번호',
    example: '12가2200',
  })
  @IsString()
  car_number: string;

  @ApiProperty({
    description: '인스턴스 ID',
    example: 1,
  })
  @IsNumber()
  instance_id: number;

  @ApiProperty({
    description: '차량 공유 활성화 여부',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  car_share_onoff?: boolean;
}

export class UpdateCarInstanceDto {
  @ApiProperty({
    description: '차량 공유 활성화 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  car_share_onoff?: boolean;
}

export class CarInstanceDto {
  @ApiProperty({
    description: 'ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '등록 차량 번호',
    example: '12가2200',
  })
  car_number: string;

  @ApiProperty({
    description: '인스턴스 ID',
    example: 1,
  })
  instance_id: number;

  @ApiProperty({
    description: '차량 공유 활성화 여부',
    example: false,
  })
  car_share_onoff: boolean;

  @ApiProperty({
    description: '생성일',
    example: '2025-08-05T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: '수정일',
    example: '2025-08-05T00:00:00.000Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: '인스턴스 정보',
    type: () => InstanceDto,
    required: false,
  })
  instance?: InstanceDto;
}

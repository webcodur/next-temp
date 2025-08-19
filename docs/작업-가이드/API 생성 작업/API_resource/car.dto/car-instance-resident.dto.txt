import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseEntityDto } from '../../common/dto/base.dto';
import { InstanceDto } from 'src/instance/dto/instance.dto';
import { ResidentDto } from 'src/resident/dto/resident.dto';
import { CarDto } from './car.dto';
import { TransformBoolean } from 'src/decorators/transform-boolean.decorator';

/**
 * 차량-인스턴스-거주자 관계 기본 DTO
 */
export class CarInstanceResidentDto extends BaseEntityDto {
  @ApiProperty({ description: '차량-거주자 관계 ID' })
  @IsInt()
  id: number;

  @ApiProperty({ description: '차량-인스턴스 연결 ID' })
  @IsInt()
  car_instance_id: number;

  @ApiProperty({ description: '거주자 ID' })
  @IsInt()
  resident_id: number;

  @ApiProperty({ description: '출차 알림 여부', example: true })
  @IsBoolean()
  @TransformBoolean()
  car_alarm: boolean;

  @ApiProperty({ description: '주 소유자 여부', example: false })
  @IsBoolean()
  @TransformBoolean()
  is_primary: boolean;
}

/**
 * 차량-인스턴스-거주자 관계 생성 DTO
 */
export class CreateCarInstanceResidentDto {
  @ApiProperty({ description: '차량-인스턴스 연결 ID' })
  @IsInt()
  car_instance_id: number;

  @ApiProperty({ description: '거주자 ID' })
  @IsInt()
  resident_id: number;

  @ApiProperty({
    description: '출차 알림 여부',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  car_alarm?: boolean;

  @ApiProperty({
    description: '주 소유자 여부',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  is_primary?: boolean;
}

/**
 * 차량-인스턴스-거주자 관계 수정 DTO
 */
export class UpdateCarInstanceResidentDto {
  @ApiProperty({
    description: '출차 알림 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  car_alarm?: boolean;

  @ApiProperty({
    description: '주 소유자 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @TransformBoolean()
  is_primary?: boolean;
}

// CarInstanceDto는 circular dependency를 피하기 위해 여기서 정의
export class CarInstanceDto {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '차량 번호' })
  car_number: string;

  @ApiProperty({ description: '인스턴스 ID' })
  instance_id: number;

  @ApiProperty({ description: '차량 공유 활성화 여부' })
  car_share_onoff: boolean;

  @ApiProperty({ description: '차량 정보', type: () => CarDto })
  car?: CarDto;

  @ApiProperty({ description: '인스턴스 정보', type: () => InstanceDto })
  instance?: InstanceDto;
}

/**
 * 차량-인스턴스-거주자 관계 상세 정보 DTO
 */
export class CarInstanceResidentDetailDto extends CarInstanceResidentDto {
  @ApiProperty({
    description: '차량-인스턴스 정보',
    type: () => CarInstanceDto,
  })
  car_instance?: CarInstanceDto;

  @ApiProperty({
    description: '거주자 정보',
    type: () => ResidentDto,
  })
  resident?: ResidentDto;
}

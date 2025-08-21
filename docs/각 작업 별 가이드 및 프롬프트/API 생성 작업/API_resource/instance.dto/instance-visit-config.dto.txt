import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { BaseIdEntityDto } from '../../common/dto/base.dto';

/**
 * InstanceVisitConfigDto
 * 인스턴스 방문 설정 정보 DTO
 */
export class InstanceVisitConfigDto extends BaseIdEntityDto {
  @ApiProperty({
    description: '인스턴스 ID',
    example: 1,
  })
  instance_id: number;

  @ApiProperty({
    description: '기본 방문 허용 시간(분)',
    example: 90,
  })
  available_visit_time: number;

  @ApiProperty({
    description: '구매한 추가 방문 시간(분)',
    example: 120,
  })
  purchased_visit_time: number;

  @ApiProperty({
    description: '방문 요청 제한 횟수',
    example: 7,
  })
  visit_request_limit: number;
}

/**
 * UpdateInstanceVisitConfigDto
 * 인스턴스 방문 설정 수정을 위한 DTO
 */
export class UpdateInstanceVisitConfigDto {
  @ApiProperty({
    description: '기본 방문 허용 시간(분)',
    example: 90,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  available_visit_time?: number;

  @ApiProperty({
    description: '구매한 추가 방문 시간(분)',
    example: 120,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  purchased_visit_time?: number;

  @ApiProperty({
    description: '방문 요청 제한 횟수',
    example: 7,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  visit_request_limit?: number;
}

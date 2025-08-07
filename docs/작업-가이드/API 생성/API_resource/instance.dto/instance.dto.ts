import { ApiProperty } from '@nestjs/swagger';
import { BaseIdEntityDto } from '../../common/dto/base.dto';
import { ResidentDto } from '../../resident/dto/resident.dto';
import { ResidentInstanceDto } from '../../resident/dto/resident-instance.dto';
import { InstanceServiceConfigDto } from './instance-service-config.dto';
import { InstanceVisitConfigDto } from './instance-visit-config.dto';

/**
 * InstanceDto
 * 인스턴스 기본 정보를 담는 DTO
 */
export class InstanceDto extends BaseIdEntityDto {
  @ApiProperty({
    description: '주차장 ID',
    example: 1,
  })
  parkinglot_id: number;

  @ApiProperty({
    description: '주소 1차 (예: 동)',
    example: '101동',
  })
  address_1depth: string;

  @ApiProperty({
    description: '주소 2차 (예: 호수)',
    example: '101호',
  })
  address_2depth: string;

  @ApiProperty({
    description: '주소 3차 (선택사항)',
    example: '방 1',
    required: false,
  })
  address_3depth?: string | null;

  @ApiProperty({
    description: '인스턴스 유형',
    example: 'GENERAL',
    enum: ['GENERAL', 'TEMP', 'COMMERCIAL'],
  })
  instance_type: string;

  @ApiProperty({
    description: '패스워드 (4자리)',
    example: '1234',
  })
  password: string;

  @ApiProperty({
    description: '메모',
    example: '특이사항 없음',
    required: false,
  })
  memo?: string | null;
}

/**
 * InstanceDetailDto
 * 인스턴스 상세 정보 (모든 관련 정보 포함)
 */
export class InstanceDetailDto extends InstanceDto {
  @ApiProperty({
    description: '거주자 목록',
    isArray: true,
  })
  resident_instance: any[];

  @ApiProperty({
    description: '서비스 설정',
    type: InstanceServiceConfigDto,
    required: false,
  })
  instance_service_config?: InstanceServiceConfigDto | null;

  @ApiProperty({
    description: '방문 설정',
    type: InstanceVisitConfigDto,
    required: false,
  })
  instance_visit_config?: InstanceVisitConfigDto | null;
}

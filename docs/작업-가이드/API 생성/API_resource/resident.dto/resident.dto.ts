import { ApiProperty } from '@nestjs/swagger';
import { BaseIdEntityDto } from '../../common/dto/base.dto';
import { ResidentInstanceDto } from 'src/resident/dto/resident-instance.dto';
import { InstanceDto } from 'src/instance/dto/instance.dto';
/**
 * ResidentDto
 * 거주자 기본 정보를 담는 DTO
 */
export class ResidentDto extends BaseIdEntityDto {
  @ApiProperty({
    description: '이름',
    example: '홍길동',
  })
  name: string;

  @ApiProperty({
    description: '전화번호',
    example: '010-1234-5678',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: '이메일',
    example: 'hong@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: '생년월일',
    example: '1990-01-01T00:00:00.000Z',
    required: false,
  })
  birth_date?: Date;

  @ApiProperty({
    description: '성별',
    example: 'M',
    enum: ['M', 'F'],
    required: false,
  })
  gender?: string;

  @ApiProperty({
    description: '비상연락처',
    example: '010-9876-5432',
    required: false,
  })
  emergency_contact?: string;

  @ApiProperty({
    description: '메모',
    example: '특이사항 없음',
    required: false,
  })
  memo?: string;
}

// 2. Instance 포함된 ResidentInstance DTO
export class ResidentInstanceWithInstanceDto extends ResidentInstanceDto {
  @ApiProperty({
    description: '인스턴스 정보',
    type: () => InstanceDto,
  })
  instance: InstanceDto | null;
}

// 4. 최종 Resident DTO
export class ResidentDetailDto extends ResidentDto {
  @ApiProperty({
    description: '거주자-인스턴스 관계 정보 배열',
    type: () => [ResidentInstanceWithInstanceDto],
    isArray: true,
  })
  resident_instance: ResidentInstanceWithInstanceDto[];
}

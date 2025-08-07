import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, Length } from 'class-validator';
import { instance_type } from '@prisma/client';
import { Trim } from '../../decorators/trim.decorator';

/**
 * CreateInstanceDto
 * 인스턴스 생성을 위한 DTO
 */
export class CreateInstanceDto {
  @ApiProperty({
    description: '주소 1차 (예: 동)',
    example: '101동',
  })
  @IsString()
  @Trim()
  address_1depth: string;

  @ApiProperty({
    description: '주소 2차 (예: 호수)',
    example: '101호',
  })
  @IsString()
  @Trim()
  address_2depth: string;

  @ApiProperty({
    description: '주소 3차 (선택사항)',
    example: '방 1',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  address_3depth?: string;

  @ApiProperty({
    description: '인스턴스 유형',
    example: 'GENERAL',
    enum: instance_type,
  })
  @IsEnum(instance_type)
  instance_type: instance_type;

  @ApiProperty({
    description: '패스워드 (4자리)',
    example: '1234',
  })
  @IsString()
  @Length(4, 4)
  @Trim()
  password: string;

  @ApiProperty({
    description: '메모',
    example: '특이사항 없음',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  memo?: string;
}

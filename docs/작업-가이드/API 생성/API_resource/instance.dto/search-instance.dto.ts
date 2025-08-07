import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { instance_type } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Trim } from '../../decorators/trim.decorator';

/**
 * SearchInstanceDto
 * 인스턴스 검색을 위한 DTO
 */
export class SearchInstanceDto extends PaginationQueryDto {
  @ApiProperty({
    description: '인스턴스 유형',
    example: 'GENERAL',
    enum: instance_type,
    required: false,
  })
  @IsOptional()
  @IsEnum(instance_type)
  instance_type?: instance_type;

  @ApiProperty({
    description: '주소 1차 (예: 동)',
    example: '101동',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  address_1depth?: string;

  @ApiProperty({
    description: '주소 2차 (예: 호수)',
    example: '101호',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  address_2depth?: string;

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
    description: '인스턴스 ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  instance_id?: number;

  @ApiProperty({
    description: '인스턴스명',
    example: '김철수',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  instance_name?: string;
}

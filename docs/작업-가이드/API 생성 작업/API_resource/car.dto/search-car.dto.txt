import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSearchDto } from '../../common/dto/base.dto';
import { Trim } from '../../decorators/trim.decorator';

export class SearchCarDto extends BaseSearchDto {
  @ApiProperty({
    description: '차량 번호',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  car_number?: string;

  @ApiProperty({
    description: '차량 브랜드',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  brand?: string;

  @ApiProperty({
    description: '차량 모델',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  model?: string;

  @ApiProperty({
    description: '차종',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  type?: string;

  @ApiProperty({
    description: '연료 타입',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Trim()
  fuel?: string;

  @ApiProperty({
    description: '연식 (시작)',
    example: 2020,
    minimum: 1900,
    maximum: 2030,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2030)
  year_from?: number;

  @ApiProperty({
    description: '연식 (끝)',
    example: 2023,
    minimum: 1900,
    maximum: 2030,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2030)
  year_to?: number;

  @ApiProperty({
    description: '주차장 ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  parkinglot_id?: number;

  @ApiProperty({
    description: '세대 인스턴스 ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  instance_id?: number;

  @ApiProperty({
    description: '거주자 ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  resident_id?: number;
}
